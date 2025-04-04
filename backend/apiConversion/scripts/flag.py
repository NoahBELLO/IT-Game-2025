# import subprocess
# import json
# import requests
# import pandas as pd

# # Fonction pour exécuter la commande tshark et récupérer les résultats
# def run_tshark(pcap_file):
#     tshark_command = [
#         "tshark",  # Plus besoin du chemin absolu sous Linux/Docker
#         "-r", pcap_file,  # Fichier PCAP
#         "-Y", "ip.src or ip.dst or kerberos",  # Filtrer pour IP et Kerberos
#         "-T", "fields",  # Choisir les champs à extraire
#         "-e", "ip.src",  # IP source
#         "-e", "ip.dst",  # IP destination
#         "-e", "kerberos.CNameString",  # Nom d'utilisateur Kerberos
#         "-e", "kerberos.addr_nb",      # Nom de la machine via NetBIOS
#         "-e", "eth.src",  # Adresse MAC source
#         "-e", "eth.dst"   # Adresse MAC destination
#     ]
    
#     # Exécution de la commande
#     result = subprocess.run(tshark_command, capture_output=True, text=True)
    
#     if result.returncode == 0:
#         return result.stdout
#     else:
#         print("Erreur lors de l'exécution de tshark.")
#         return None

# # Fonction pour parser les résultats tshark et extraire les informations nécessaires
# def parse_tshark_output(output):
#     lines = output.strip().split("\n")
#     data = []

#     for line in lines:
#         fields = line.split("\t")
        
#         if len(fields) >= 6:  # S'assurer qu'il y a bien 6 colonnes
#             ip_src = fields[0]
#             ip_dst = fields[1]
#             kerberos_user = fields[2]
#             netbios_name = fields[3]
#             mac_src = fields[4]
#             mac_dst = fields[5]
            
#             data.append({
#                 "IP source": ip_src,
#                 "IP destination": ip_dst,
#                 "Kerberos User": kerberos_user,
#                 "NetBIOS Name": netbios_name,
#                 "MAC source": mac_src,
#                 "MAC destination": mac_dst
#             })
#             print(data)
#     return data

# # Fonction pour soumettre les informations extraites à l'API
# def submit_flag(user_id, mac_address, ip_address, host_name, user_account):
#     url = "http://93.127.203.48:5000/pcap/submit"  # Remplacez par l'URL de l'API
#     headers = {"Content-Type": "application/json"}
#     payload = {
#         "user_id": user_id,
#         "lines": [
#             mac_address,
#             ip_address,
#             host_name,
#             user_account
#         ]
#     }
    
#     try:
#         # Soumettre les données à l'API
#         response = requests.post(url, json=payload, headers=headers)
        
#         # Vérifier le statut de la réponse
#         if response.status_code == 200:
#             data = response.json()
#             flag = data.get("flag")
#             print(f"Flag obtenu : {flag}")
#         elif response.status_code == 400:
#             print("Erreur : Format de la requête invalide. Assurez-vous que les informations sont correctes.")
#         elif response.status_code == 403:
#             print("Erreur : Réponse incorrecte, les informations soumises ne sont pas celles attendues.")
#         else:
#             print(f"Erreur inconnue : {response.status_code}")
#     except requests.exceptions.RequestException as e:
#         print(f"Erreur lors de la connexion : {e}")

# # Exemple d'utilisation
# pcap_file = "/usr/src/data/chall_wshark4.pcap"  

# # Exécuter tshark pour extraire les informations
# tshark_output = run_tshark(pcap_file)

# if tshark_output:
#     # Analyser les résultats de tshark
#     parsed_data = parse_tshark_output(tshark_output)
    
#     # Exemple de soumission pour chaque paquet trouvé (à adapter selon vos besoins)
#     for entry in parsed_data:
#         user_id = "noah"  # Remplacez par votre identifiant utilisateur
#         mac_address = entry["MAC source"]
#         ip_address = entry["IP source"]
#         host_name = entry["NetBIOS Name"]
#         user_account = entry["Kerberos User"]
        
#         # Soumettre les informations extraites
#         submit_flag(user_id, mac_address, ip_address, host_name, user_account)
# else:
#     print("Erreur lors de l'extraction des informations du fichier PCAP.")

import requests
import subprocess
import json

def envoyer_donnees_pcap(data):
    url = "http://93.127.203.48:5000/pcap/submit"
    
    payload = {
        "user_id": "noahbello",
        "lines": [
            data.get("mac_address"),
            data.get("ip"),
            data.get("nom_machine"),
            data.get("nom_utilisateur")
        ]
    }

    response = requests.post(url, json=payload)
    response_data = response.json()
    print(response_data)
    flag = response_data.get("flag", "Flag non trouvÃ©")
    return flag


def extract_pcap_info(pcap_file: str) -> json:

    tshark_command = [
        "tshark", 
        "-r", pcap_file,
        "-Y", "ip.src || ip.dst || kerberos",
        "-T", "fields",
        "-e", "ip.src",
        "-e", "ip.dst",
        "-e", "kerberos.CNameString",
        "-e", "kerberos.addr_nb",
        "-e", "eth.src",
        "-e", "eth.dst"
    ]
    
    process = subprocess.Popen(tshark_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    
    stderr_output = stderr.decode().strip()
    if stderr_output and "could be dangerous" not in stderr_output.lower():
        raise RuntimeError(f"Erreur: {stderr_output}")
    
    lines = stdout.decode().splitlines()
    ip_to_info = {}
    
    for line in lines:
        parts = line.split("\t")
        ip_src = parts[0] if len(parts) > 0 and parts[0] else None
        ip_dst = parts[1] if len(parts) > 1 and parts[1] else None
        cname = parts[2] if len(parts) > 2 and parts[2] and "desktop" not in parts[2].lower() else None
        nbns_name = parts[3] if len(parts) > 3 and parts[3] else None
        mac_src = parts[4] if len(parts) > 4 and parts[4] else None
        mac_dst = parts[5] if len(parts) > 5 and parts[5] else None
        
        if ip_src:
            if ip_src not in ip_to_info:
                ip_to_info[ip_src] = {"nom_utilisateur": "N/A", "nom_machine": "N/A", "mac_address": "N/A"}
            if cname:
                ip_to_info[ip_src]["nom_utilisateur"] = cname
            if nbns_name:
                ip_to_info[ip_src]["nom_machine"] = nbns_name
            if mac_src:
                ip_to_info[ip_src]["mac_address"] = mac_src
        
        if ip_dst:
            if ip_dst not in ip_to_info:
                ip_to_info[ip_dst] = {"nom_utilisateur": "N/A", "nom_machine": "N/A", "mac_address": "N/A"}
            if cname:
                ip_to_info[ip_dst]["nom_utilisateur"] = cname
            if nbns_name:
                ip_to_info[ip_dst]["nom_machine"] = nbns_name
            if mac_dst:
                ip_to_info[ip_dst]["mac_address"] = mac_dst
    
    output_list = [
        {
            "ip": ip,
            "nom_utilisateur": info["nom_utilisateur"],
            "nom_machine": info["nom_machine"],
            "mac_address": info["mac_address"]
        } 
        for ip, info in ip_to_info.items()
        if not (info["nom_utilisateur"] == "N/A" and info["nom_machine"] == "N/A")
    ]
    
    return json.dumps(output_list, indent=4)

# Conversion du JSON string en liste d'objets Python avant de le passer à la fonction
resultat = extract_pcap_info("/usr/src/data/chall_wshark6.pcap") #logs.pcap
resultat_parsed = json.loads(resultat)  # Désérialisation du JSON en objet Python
print(json.dumps(resultat_parsed))
# flags = []
# # Envoi des données extraites à l'API pour chaque entrée trouvée
# for data in resultat_parsed:
#     flag = envoyer_donnees_pcap(data)
#     # print(flag)
#     flags.append(flag)
    
# print(json.dumps(flags))