
import subprocess

print("🔁 Étape 1 : Analyse du fichier PCAP avec Scapy...")
subprocess.run(["python3", "/usr/src/app/scripts/analyse_scapy.py"], check=True)

print("\n🔁 Étape 2 : Filtrage des IP avant interrogation VirusTotal...")
subprocess.run(["python3", "/usr/src/app/scripts/filtrer_ip.py"], check=True)

# print("\n🔁 Étape 3 : Vérification des IP via VirusTotal (avec délai entre chaque)...")
# subprocess.run(["python3", "/usr/src/app/scripts/virustotal_check.py"], check=True)

print("\n🔁 Étape 4 : Analyse d'alerts ...")
subprocess.run(["python3", "/usr/src/app/scripts/process_alerts.py"], check=True)

print("\n✅ Pipeline complet terminé !")
