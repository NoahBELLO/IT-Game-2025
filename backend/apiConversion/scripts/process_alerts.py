# import pandas as pd
# import requests
# import json
# import socket

# # Dictionnaire des techniques MITRE ATT&CK
# mitre_attack_dict = {
#     "T1110.001": "Brute Force - Password Guessing",
#     "T1071.001": "Application Layer Protocol - Web Shell",
#      "T1110.001": "Password Guessing",
#     "T1110.002": "Password Cracking",
#     "T1071.001": "Application Layer Protocol",
#     "T1059.001": "PowerShell",
#     "T1003.001": "LSASS Memory",
#     "T1021.001": "Remote Desktop Protocol",
#     "T1041.001": "Exfiltration Over Command and Control Channel",
#     "T1075.001": "Pass-the-Hash",
#     "T1056.001": "Input Capture",
#     "T1076.001": "Input Capture: Keystrokes",
#     "T1486.001": "Data Encrypted for Impact",
#     "T1499.001": "Endpoint Denial of Service",
#     "T1086.001": "PowerShell",
#     "T1190.001": "Exploit Public-Facing Application",
#     "T1027.002": "Obfuscated Files or Information",
#     "T1078.001": "Valid Accounts",
#     "T1070.001": "Indicator Removal on Host",
#     "T1069.002": "Permission Groups Discovery",
# }

# def get_geolocation(ip):
#     """
#     Fonction pour obtenir la géolocalisation d'une IP via ipinfo.io
#     """
#     try:
#         url = f"https://ipinfo.io/{ip}/json"
#         response = requests.get(url)
#         data = response.json()
#         return {
#             "Pays": data.get("country", "Inconnu"),
#             "Ville": data.get("city", "Inconnue"),
#             "Région": data.get("region", "Inconnue"),
#         }
#     except Exception as e:
#         return {"Pays": "Erreur", "Ville": "Erreur", "Région": "Erreur"}

# def get_dns_info(ip):
#     """
#     Résolution DNS pour une adresse IP
#     """
#     try:
#         # Utilisation de socket pour obtenir le nom de domaine de l'IP
#         host = socket.gethostbyaddr(ip)
#         return host[0]  # Retourne le nom de domaine
#     except (socket.error, socket.herror, socket.gaierror):
#         return "Inconnu"

# def get_virustotal_info(ip, api_key):
#     """
#     Récupérer les informations de VirusTotal pour une adresse IP
#     """
#     url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip}"
#     headers = {"x-apikey": api_key}
#     response = requests.get(url, headers=headers)
    
#     if response.status_code == 200:
#         data = response.json()
#         last_analysis_stats = data["data"]["attributes"]["last_analysis_stats"]
#         return last_analysis_stats
#     else:
#         return {"malicious": 0, "suspicious": 0, "harmless": 0, "undetected": 0}

# def calculate_severity(virustotal_info):
#     """
#     Calculer la gravité basée sur VirusTotal
#     """
#     if virustotal_info.get("malicious", 0) > 3:
#         return "Haute"
#     elif virustotal_info.get("malicious", 0) > 1:
#         return "Moyenne"
#     return "Faible"

# def get_mitre_attack(ip):
#     """
#     Associer les alertes avec les techniques MITRE ATT&CK.
#     """
#     # Exemple fictif de techniques MITRE ATT&CK associées à des alertes
#     mitre_attack_data = []
    
#     # Exemple d'attaque brute force
#     if ip == "89.44.9.186":
#         mitre_attack_data = ["T1110.001"]  # Brute force
#     # Ici, tu peux ajouter plus de conditions selon ton analyse
#     return mitre_attack_data

# def process_alerts(input_csv, api_key_virustotal):
#     """
#     Traiter les alertes et ajouter MITRE ATT&CK, DNS et gravité
#     """
#     df = pd.read_csv(input_csv)
#     alerts = []

#     for index, row in df.iterrows():
#         ip = row['IP']
#         print(f"Analyse de l'IP {ip}...")
        
#         # Vérification avec VirusTotal
#         virustotal_info = get_virustotal_info(ip, api_key_virustotal)
        
#         # Récupérer MITRE ATT&CK pour cette IP
#         mitre_attack_data = get_mitre_attack(ip)
        
#         # Récupérer la géolocalisation et DNS
#         geolocation = get_geolocation(ip)
#         dns_info = get_dns_info(ip)
        
#         # Générer l'alerte
#         alert = {
#             "IP": ip,
#             "Pays": geolocation["Pays"],
#             "Ville": geolocation["Ville"],
#             "Région": geolocation["Région"],
#             "VirusTotal": virustotal_info["malicious"],
#             "Suspicious": virustotal_info["suspicious"],
#             "Harmless": virustotal_info["harmless"],
#             "Undetected": virustotal_info["undetected"],
#             "Gravité": calculate_severity(virustotal_info),
#             "DNS": dns_info,
#             "MITRE ATT&CK": [mitre_attack_dict.get(code, "Technique inconnue") for code in mitre_attack_data]
#         }
#         alerts.append(alert)

#     # Sauvegarder les alertes en JSON
#     with open("alertes.json", "w") as json_file:
#         json.dump(alerts, json_file, indent=4)

#     # Sauvegarder les alertes en CSV
#     df_alerts = pd.DataFrame(alerts)
#     df_alerts.to_csv("alertes.csv", index=False)

#     print(f"Les alertes ont été enregistrées dans 'alertes.json' et 'alertes.csv'.")

# # Exemple d'appel de la fonction
# input_csv = "ex4_analyse_top_ips_info.csv"  # Remplacer par ton fichier
# api_key_virustotal = "ed83782b93965ac6499edd2e3326af028326048fd48654c5145b0eda113f7866"
# process_alerts(input_csv, api_key_virustotal)

import pandas as pd
import requests
import json
import socket
import concurrent.futures

# Dictionnaire des techniques MITRE ATT&CK
mitre_attack_dict = {
    "T1110.001": "Brute Force - Password Guessing",
    "T1071.001": "Application Layer Protocol - Web Shell",
    "T1041.001": "Exfiltration Over Command and Control Channel",
    "T1499.001": "Impact - Data Destruction",
    "T1059.001": "PowerShell",
    "T1003.001": "LSASS Memory",
    "T1021.001": "Remote Desktop Protocol",
    "T1075.001": "Pass-the-Hash",
    "T1056.001": "Input Capture",
    "T1076.001": "Input Capture: Keystrokes",
    "T1486.001": "Data Encrypted for Impact",
    "T1086.001": "PowerShell",
    "T1190.001": "Exploit Public-Facing Application",
    "T1027.002": "Obfuscated Files or Information",
    "T1078.001": "Valid Accounts",
    "T1070.001": "Indicator Removal on Host",
    "T1069.002": "Permission Groups Discovery",
}

# Fonction pour obtenir la géolocalisation d'une IP
def get_geolocation(ip):
    try:
        url = f"https://ipinfo.io/{ip}/json"
        response = requests.get(url)
        data = response.json()
        return {
            "Pays": data.get("country", "Inconnu"),
            "Ville": data.get("city", "Inconnue"),
            "Région": data.get("region", "Inconnue"),
            "Localisation":data.get("loc", "0, 0")
        }
    except Exception:
        return {"Pays": "Erreur", "Ville": "Erreur", "Région": "Erreur"}

# Fonction pour obtenir les infos DNS d'une IP
def get_dns_info(ip):
    try:
        host = socket.gethostbyaddr(ip)
        return host[0]  # Retourne le nom de domaine
    except (socket.error, socket.herror, socket.gaierror):
        return "Inconnu"

# Fonction pour obtenir les informations de VirusTotal
def get_virustotal_info(ip, api_key):
    url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip}"
    headers = {"x-apikey": api_key}
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        last_analysis_stats = data["data"]["attributes"]["last_analysis_stats"]
        return last_analysis_stats
    else:
        return {"malicious": 0, "suspicious": 0, "harmless": 0, "undetected": 0}

# Calculer la gravité de l'IP basée sur VirusTotal
def calculate_severity(virustotal_info):
    if virustotal_info.get("malicious", 0) > 3:
        return "Haute"
    elif virustotal_info.get("malicious", 0) > 1:
        return "Moyenne"
    return "Faible"

# Fonction MITRE ATT&CK
def get_mitre_attack(ip):
    mitre_attack_data = []
    if ip == "89.44.9.186":
        mitre_attack_data = ["T1110.001"]  # Brute force
    return mitre_attack_data

# Fonction pour traiter chaque alerte et récupérer les informations nécessaires
def process_alert_for_ip(ip, api_key_virustotal):
    # Vérification avec VirusTotal
    virustotal_info = get_virustotal_info(ip, api_key_virustotal)
    
    # Récupérer MITRE ATT&CK pour cette IP
    mitre_attack_data = get_mitre_attack(ip)
    
    # Récupérer la géolocalisation et DNS
    geolocation = get_geolocation(ip)
    dns_info = get_dns_info(ip)
    
    # Générer l'alerte
    alert = {
        "IP": ip,
        "Pays": geolocation["Pays"],
        "Ville": geolocation["Ville"],
        "Région": geolocation["Région"],
        "Localisation": geolocation["Localisation"],
        "VirusTotal": virustotal_info["malicious"],
        "Suspicious": virustotal_info["suspicious"],
        "Harmless": virustotal_info["harmless"],
        "Undetected": virustotal_info["undetected"],
        "Gravité": calculate_severity(virustotal_info),
        "DNS": dns_info,
        "MITRE ATT&CK": [mitre_attack_dict.get(code, "Technique inconnue") for code in mitre_attack_data]
    }
    return alert

# Traiter les alertes pour chaque IP dans le fichier CSV
def process_alerts(input_csv, api_key_virustotal):
    df = pd.read_csv(input_csv)
    alerts = []
    
    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Utiliser ThreadPoolExecutor pour exécuter les tâches en parallèle
        future_to_ip = {executor.submit(process_alert_for_ip, row['IP'], api_key_virustotal): row['IP'] for _, row in df.iterrows()}
        
        for future in concurrent.futures.as_completed(future_to_ip):
            ip = future_to_ip[future]
            try:
                alert = future.result()
                alerts.append(alert)
            except Exception as e:
                print(f"Erreur lors du traitement de l'IP {ip}: {e}")
    
    # Sauvegarder les alertes en JSON
    with open("alertes.json", "w") as json_file:
        json.dump(alerts, json_file, indent=4)

    # Sauvegarder les alertes en CSV
    df_alerts = pd.DataFrame(alerts)
    df_alerts.to_csv("/usr/src/csv/alertes.csv", index=False)

    print(f"Les alertes ont été enregistrées dans 'alertes.json' et 'alertes.csv'.")

# Exemple d'appel de la fonction
input_csv = "/usr/src/csv/chall_wshark6_analyse_top_ips_info.csv"  # Remplacer par ton fichier CSV d'entrée
# api_key_virustotal = "ed83782b93965ac6499edd2e3326af028326048fd48654c5145b0eda113f7866"  
api_key_virustotal = "9896edffe19fb69138b00792d7435b83e9bb177cd53a5e2396a64ba72fa8e6e3"  
process_alerts(input_csv, api_key_virustotal)
