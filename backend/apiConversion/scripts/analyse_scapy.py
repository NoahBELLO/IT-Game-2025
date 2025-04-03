from scapy.all import rdpcap, IP, TCP, UDP
from datetime import datetime
import pandas as pd
from loguru import logger

# Fonction pour identifier le rôle du port
def get_role(dport):
    try:
        # Déterminer le rôle en fonction des ports
        return "Serveur" if int(dport) in [22, 53, 80, 137, 445, 3389] else "Client"
    except:
        return "Inconnu"

# Fonction principale pour transformer le PCAP en CSV
def pcap_to_csv(pcap_file):
    # Lire le fichier PCAP
    packets = rdpcap(pcap_file)

    # Liste pour stocker les données extraites
    data = []

    # Parcourir chaque paquet
    for pkt in packets:
        if IP in pkt:  # Vérifier si le paquet contient une couche IP
            ip_src = pkt[IP].src
            ip_dst = pkt[IP].dst
            sport = dport = proto_name = ""

            # Détecter le protocole et extraire les ports
            if TCP in pkt:
                proto_name = "TCP"
                sport = pkt[TCP].sport
                dport = pkt[TCP].dport
            elif UDP in pkt:
                proto_name = "UDP"
                sport = pkt[UDP].sport
                dport = pkt[UDP].dport
            else:
                proto_name = str(pkt[IP].proto)

            # Convertir le timestamp
            timestamp = datetime.fromtimestamp(float(pkt.time)).strftime('%Y-%m-%d %H:%M:%S')
            role = get_role(dport)

            # Ajouter les données à la liste
            data.append({
                "Date et heure": timestamp,
                "IP source": ip_src,
                "IP destination": ip_dst,
                "Protocole": proto_name,
                "Port source": sport,
                "Port destination": dport,
                "Rôle": role
            })

    # Convertir les données en DataFrame
    df = pd.DataFrame(data)

    # Sauvegarder les données dans un fichier CSV
    output_file = '/usr/src/csv/' + pcap_file.split('/')[-1].split('.')[0] + '_analyse.csv'
    logger.critical(f"Fichier CSV sauvegardé sous {output_file}")
    df.to_csv(output_file, index=False)

    print(f"Analyse terminée. Fichier CSV sauvegardé sous {output_file}")
    return df

# Exemple d'utilisation
pcap_file = "/usr/src/data/logs.pcap"  # Remplacez ce chemin par votre fichier PCAP
df = pcap_to_csv(pcap_file)