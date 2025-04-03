import requests
import time
import pandas as pd
import json

API_KEY = "ed83782b93965ac6499edd2e3326af028326048fd48654c5145b0eda113f7866"  

# Fonction pour vérifier une IP avec VirusTotal
def check_virustotal(ip):
    url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip}"
    headers = {"x-apikey": API_KEY}
    attempt = 0
    while attempt < 5:  # Tentative de requêtes jusqu'à 5 fois en cas d'erreurs
        try:
            response = requests.get(url, headers=headers)
            
            # Si la requête est réussie
            if response.status_code == 200:
                data = response.json()
                stats = data["data"]["attributes"]["last_analysis_stats"]
                return {
                    "IP": ip,
                    "Malicious": stats.get("malicious", 0),
                    "Suspicious": stats.get("suspicious", 0),
                    "Harmless": stats.get("harmless", 0),
                    "Undetected": stats.get("undetected", 0)
                }
            
            # Si la limite de requêtes est atteinte (erreur 429), attendre et réessayer
            elif response.status_code == 429:
                print(f"🌐 Limite de requêtes atteinte pour {ip}. Attente de 30 secondes...")
                time.sleep(30)  # Attente de 30 secondes avant de réessayer
                attempt += 1
            
            # Si une autre erreur survient (autre code HTTP)
            else:
                print(f"Erreur {response.status_code} pour l'IP {ip}")
                return {"IP": ip, "Error": f"Erreur {response.status_code}"}
        
        except Exception as e:
            print(f"Erreur lors de la requête pour {ip}: {str(e)}")
            return {"IP": ip, "Error": str(e)}
    
    # Si on dépasse les tentatives, on retourne une erreur
    return {"IP": ip, "Error": "Maximum de tentatives atteint"}

# Charger les IPs à vérifier à partir d'un fichier CSV (ou autre source)
input_csv = "/usr/src/csv/ex4_analyse_top_ips_info.csv"  
df = pd.read_csv(input_csv)

# Affiche toutes les colonnes pour vérifier le nom correct
print(df.columns)

# Liste des IPs à vérifier (exemple avec IP source)
ip_list = df['IP'].tolist()  # Remplacer 'IP source' par le nom correct de ta colonne

# Résultats de l'analyse
results = []

# Analyser chaque IP
for ip in ip_list:
    print(f"Vérification de l'IP {ip}...")
    result = check_virustotal(ip)
    results.append(result)

# Sauvegarder les résultats dans un fichier JSON
output_file = "virustotal_results.json"
with open(output_file, "w") as f:
    json.dump(results, f, indent=4)

print(f"✅ Analyse terminée ! Résultats sauvegardés dans {output_file}")
