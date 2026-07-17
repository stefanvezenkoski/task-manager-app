# dockerfile for fastapi backend

# python image so koristi linux + python 3.11 verzija
FROM python:3.11-slim

# postavuva raboten direktorium vo kntenjerot na /app
WORKDIR /app

# kopira requirements.txt vo rabotniot direktorium (/app)
COPY requirements.txt .
# izvrsuva komanda za instalacija na zavisnosti od requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# kopira site datoteki od lokalniot direktorium vo rabotniot direktorium na kontejnerot
COPY . .

# ekspozira port 8000 za pristap do aplikacijata
EXPOSE 8000

# start komanda za uvicorn serverot so specificirani host i port
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]