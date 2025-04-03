import subprocess
import json
import requests
import pandas as pd

# Fonction pour exécuter la commande tshark et récupérer les résultats
def run_tshark(pcap_file):
    tshark_command = [
        "tshark",  # Plus besoin du chemin absolu sous Linux/Docker
        "-r", pcap_file,  # Fichier PCAP
        "-Y", "ip.src or ip.dst or kerberos",  # Filtrer pour IP et Kerberos
        "-T", "fields",  # Choisir les champs à extraire
        "-e", "ip.src",  # IP source
        "-e", "ip.dst",  # IP destination
        "-e", "kerberos.CNameString",  # Nom d'utilisateur Kerberos
        "-e", "kerberos.addr_nb",      # Nom de la machine via NetBIOS
        "-e", "eth.src",  # Adresse MAC source
        "-e", "eth.dst"   # Adresse MAC destination
    ]
    
    # Exécution de la commande
    result = subprocess.run(tshark_command, capture_output=True, text=True)
    
    if result.returncode == 0:
        return result.stdout
    else:
        print("Erreur lors de l'exécution de tshark.")
        return None

# Fonction pour parser les résultats tshark et extraire les informations nécessaires
def parse_tshark_output(output):
    lines = output.strip().split("\n")
    data = []

    for line in lines:
        fields = line.split("\t")
        
        if len(fields) >= 6:  # S'assurer qu'il y a bien 6 colonnes
            ip_src = fields[0]
            ip_dst = fields[1]
            kerberos_user = fields[2]
            netbios_name = fields[3]
            mac_src = fields[4]
            mac_dst = fields[5]
            
            data.append({
                "IP source": ip_src,
                "IP destination": ip_dst,
                "Kerberos User": kerberos_user,
                "NetBIOS Name": netbios_name,
                "MAC source": mac_src,
                "MAC destination": mac_dst
            })
    
    return data

# Fonction pour soumettre les informations extraites à l'API
def submit_flag(user_id, mac_address, ip_address, host_name, user_account):
    url = "http://93.127.203.48:5000/pcap/submit"  # Remplacez par l'URL de l'API
    headers = {"Content-Type": "application/json"}
    payload = {
        "user_id": user_id,
        "lines": [
            mac_address,
            ip_address,
            host_name,
            user_account
        ]
    }
    
    try:
        # Soumettre les données à l'API
        response = requests.post(url, json=payload, headers=headers)
        
        # Vérifier le statut de la réponse
        if response.status_code == 200:
            data = response.json()
            flag = data.get("flag")
            print(f"Flag obtenu : {flag}")
        elif response.status_code == 400:
            print("Erreur : Format de la requête invalide. Assurez-vous que les informations sont correctes.")
        elif response.status_code == 403:
            print("Erreur : Réponse incorrecte, les informations soumises ne sont pas celles attendues.")
        else:
            print(f"Erreur inconnue : {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la connexion : {e}")

# Exemple d'utilisation
pcap_file = "/usr/src/data/chall_wshark4.pcap"  

# Exécuter tshark pour extraire les informations
tshark_output = run_tshark(pcap_file)

if tshark_output:
    # Analyser les résultats de tshark
    parsed_data = parse_tshark_output(tshark_output)
    
    # Exemple de soumission pour chaque paquet trouvé (à adapter selon vos besoins)
    for entry in parsed_data:
        user_id = "noah"  # Remplacez par votre identifiant utilisateur
        mac_address = entry["MAC source"]
        ip_address = entry["IP source"]
        host_name = entry["NetBIOS Name"]
        user_account = entry["Kerberos User"]
        
        # Soumettre les informations extraites
        submit_flag(user_id, mac_address, ip_address, host_name, user_account)
else:
    print("Erreur lors de l'extraction des informations du fichier PCAP.")
