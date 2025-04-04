import pandas as pd
import requests

# Fonction pour obtenir la géolocalisation d'une IP via ipinfo.io
def get_geolocation(ip):
    try:
        url = f"https://ipinfo.io/{ip}/json"
        response = requests.get(url)
        data = response.json()
        
        if data.get("status") == "fail":
            return {"Pays": "Inconnu", "Ville": "Inconnue", "Région": "Inconnue", "Drapeau": "🏳️"}
        else:
            country = data.get("country", "Inconnu")
            city = data.get("city", "Inconnue")
            region = data.get("region", "Inconnue")
            # Vous pouvez ajuster les couleurs de drapeau en fonction du pays ici
            country_flags = {"FR": "🇫🇷", "US": "🇺🇸", "CA": "🇨🇦"}  # Ajoutez plus de pays si nécessaire
            flag = country_flags.get(country, "🏳️")
            return {"Pays": country, "Ville": city, "Région": region, "Drapeau": flag}
    except Exception as e:
        return {"Pays": "Erreur", "Ville": "Erreur", "Région": "Erreur", "Drapeau": "❌"}

# Fonction pour filtrer les 20 IPs les plus fréquentes avec plus d'informations
def filter_top_ips(input_csv):
    # Charger le fichier CSV
    df = pd.read_csv(input_csv)

    # Fusionner les colonnes 'IP source' et 'IP destination' pour éviter les doublons
    ips = pd.concat([df['IP source'], df['IP destination']])

    # Compter la fréquence des IPs
    ip_counts = ips.value_counts()

    # Garder les 20 IPs les plus fréquentes
    top_ips = ip_counts.head(20)

    # Préparer les résultats dans une liste avec plus de colonnes
    top_ips_info = []

    for ip in top_ips.index:
        # Filtrer les paquets correspondants à chaque IP
        ip_data = df[(df['IP source'] == ip) | (df['IP destination'] == ip)]

        # Récupérer des informations supplémentaires sur chaque IP
        total_packets = ip_data.shape[0]  # Nombre total de paquets
        src_ports = ip_data['Port source'].unique()  # Ports sources uniques
        dst_ports = ip_data['Port destination'].unique()  # Ports destination uniques
        protocols = ip_data['Protocole'].unique()  # Protocoles utilisés
        
        # Récupérer la géolocalisation
        geo_info = get_geolocation(ip)

        # Ajouter les informations de chaque IP dans la liste
        top_ips_info.append({
            "IP": ip,
            "Count": top_ips[ip],
            "Total Paquets": total_packets,
            "Protocoles": ", ".join(protocols),
            "Pays": geo_info["Pays"],
            "Ville": geo_info["Ville"],
            "Région": geo_info["Région"],
            "Drapeau": geo_info["Drapeau"]
        })

    # Convertir la liste en DataFrame
    df_top_ips_info = pd.DataFrame(top_ips_info)

    # Sauvegarder les résultats dans un fichier CSV
    output_csv = input_csv.split('.')[0] + '_top_ips_info.csv'
    df_top_ips_info.to_csv(output_csv, index=False)

    # Sauvegarder les résultats dans un fichier JSON
    # output_json = input_csv.split('.')[0] + '_top_ips_info.json'
    # df_top_ips_info.to_json(output_json, orient='records', lines=True)

    print(f"Les 20 IPs les plus fréquentes avec plus d'informations ont été sauvegardées sous {output_csv}")#et {output_json}

    return df_top_ips_info

# Exemple d'utilisation
input_csv = "/usr/src/csv/chall_wshark6_analyse.csv"  
df_top_ips = filter_top_ips(input_csv)
