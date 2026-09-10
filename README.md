# KI-Werkzeugkasten

Ein kleiner, eigenständiger KI-Microservice mit zwei Werkzeugen: Text zusammenfassen und passende Tags vorschlagen.
Läuft komplett lokal über [Ollama](https://ollama.com) – keine Cloud-API, keine Kosten.

![Demo](docs/demo.gif)

## Warum lokal statt Cloud-API?

Bewusste Entscheidung: Ich wollte ein KI-Projekt bauen, ohne dafür eine kostenpflichtige API zu nutzen. Die KI-Anbindung läuft deshalb komplett über ein lokales Modell (llama3.2) via Ollama statt über z. B. die Anthropic- oder OpenAI-API. Das bedeutet auch: kein klickbarer Live-Link, da das Modell nur auf dem eigenen Rechner läuft – daher die Video-Demo oben statt eines Links.

## Endpunkte

### POST /summarize

Fasst einen Text in maximal 2 Sätzen zusammen.

**Request**

```json
{ "text": "ein längerer Text hier..." }
```

**Response**

```json
{ "summary": "die Kurzfassung davon" }
```

### POST /suggest-tags

Schlägt 3–5 passende Schlagwörter für einen Text vor.

**Request**

```json
{ "text": "ein längerer Text hier..." }
```

**Response**

```json
{ "tags": ["tag1", "tag2", "tag3"] }
```

Beide Endpunkte sind auf 10 Anfragen pro Minute begrenzt.

## Tech-Stack

**Backend**: Node.js, Express, TypeScript, Zod, express-rate-limit
**KI**: Ollama (llama3.2), lokal gehostet
**Demo-Frontend**: React, Vite, Tailwind CSS v4

## Lokal starten

### Voraussetzungen

- Node.js
- [Ollama](https://ollama.com) installiert, Modell heruntergeladen: `ollama pull llama3.2`

### Backend

```bash
npm install
cp .env.example .env
npm run dev
```

Läuft auf `localhost:3001`.

### Demo-Frontend

```bash
cd demo-frontend
npm install
npm run dev
```

Läuft auf `localhost:5173`.

Backend, Demo-Frontend und Ollama müssen gleichzeitig laufen, damit die Demo funktioniert.

## Projektstruktur

```
ki-microservice-api/
├── src/                Backend-Code
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   └── routes/
├── demo-frontend/       React-Demo-Oberfläche
└── docs/                Demo-GIF
```
