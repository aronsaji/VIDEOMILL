# VideoMill: Cyber-Industrial Setup Guide 🦾🌑

Dette dokumentet beskriver arkitekturen og stegene som trengs for å kjøre VideoMill-suiten lokalt på din maskin.

## 🛠️ Tjenester og Arkitektur

VideoMill er delt opp i fire hovedkomponenter:

| Tjeneste | Rolle | Teknisk Stabel |
| :--- | :--- | :--- |
| **Command Center** | Dashbord og brukergrensesnitt | Vite + React + Tailwind |
| **Voice Server** | Lokal server for lyd-prosessering | Node.js (Express) |
| **Neural Database** | Lagring av trender, ordre og brukere | Supabase (PostgreSQL + Auth) |
| **Automation Hub** | Selve produksjonslinjen (Video/AI) | n8n (Webhooks) |
| **Tunneling Node** | Sikker "bro" mellom sky og lokal PC | ngrok (HTTP Tunnel) |

---

## 🚀 Step-by-Step Lokal Oppstart

Følg denne sekvensen for å starte systemet i korrekt rekkefølge.

### 1. Klargjør Terminalen
Åpne en terminal (PowerShell eller CMD) og naviger til rot-mappen for dashboardet:
```powershell
cd "c:\VideoMill\NY_VIDEOMILL_V2\videomill\dashboard"
```

### 2. Start Voice Server (Bakgrunnstjeneste)
Denne tjenesten håndterer lyd-syntese og må kjøre for at fabrikken skal fungere optimalt.
```powershell
# Sørg for at du er i mappen der voice-server.cjs ligger
node voice-server.cjs
```
*(La denne terminalen stå åpen. Den skal kjøre på port 5000).*

### 3. Start Command Center (Frontend)
Åpne en **ny** terminal-fane og naviger inn i den indre dashboard-mappen:
```powershell
cd "c:\VideoMill\NY_VIDEOMILL_V2\videomill\dashboard\dashboard"
npm run dev
```
*(Dashbordet starter på http://localhost:5173).*

### 4. Aktiver Tunneling (ngrok)
Dette er det viktigste steget for at Supabase skal kunne sende signaler til din lokale maskin. Uten dette vil ikke "Neural Dispatch" fungere.
```powershell
ngrok http 5678
```
*(Kopier "Forwarding"-adressen du får her og lim den inn i Supabase trigger-innstillingene hvis du har startet ngrok på nytt).*

---

## 🔑 Miljøvariabler (.env.local)

For at dashbordet skal kunne snakke med Supabase og n8n, må filen `c:\VideoMill\NY_VIDEOMILL_V2\videomill\dashboard\dashboard\.env.local` inneholde følgende nøkler. **Disse skal aldri deles eller pushes til GitHub.**

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=din_anon_key_her
VITE_N8N_WEBHOOK_URL=https://n8n.ditt-domene.com/webhook/prod-start
```

---

## 🔍 Systemintegrasjon

1.  **Frontend -> Supabase:** Håndterer autentisering og sanntids-oppdatering av trender.
2.  **Frontend -> n8n:** Sender produksjons-forespørsler (JSON) til n8n webhooks.
3.  **Frontend -> Voice Server:** Brukes for å generere lydfiler lokalt under utvikling.

---

> [!TIP]
> **Vercel Build Tip:** Ved oppsett i Vercel dashboard, sett **Root Directory** til `dashboard/dashboard`. Dette er kritisk for at Vite-bygget skal finne korrekt `index.html`.
