FROM python:3.11-slim-buster

WORKDIR /usr/src/app

# Installer tshark
RUN apt-get update && apt-get install -y tshark && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install -r requirements.txt

EXPOSE 5002

ENTRYPOINT ["python", "app.py"]