# Bosanski Jezik - Learn Bosnian 🇧🇦

Interaktivna aplikacija za učenje bosanskog jezika sa podrškom za nivoe A1-C2.

## Tehnologije

- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: FastAPI (Python)
- **Deployment**: Docker + Docker Compose

## Struktura projekta

```
lang-learn/
├── backend/
│   ├── app/
│   │   ├── data/           # Podaci lekcija
│   │   └── main.py         # FastAPI aplikacija
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # React komponente
│   │   ├── pages/          # Stranice aplikacije
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Pokretanje aplikacije

### Sa Dockerom (preporučeno)

```bash
# Pokrenite sve servise
docker-compose up --build

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### Bez Dockera (development)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Nivoi učenja

| Nivo | Naziv | Opis |
|------|-------|------|
| A1 | Početnik | Osnove: pozdravi, brojevi, boje, porodica |
| A2 | Elementarni | Svakodnevne situacije |
| B1 | Srednji | Složenije teme |
| B2 | Viši srednji | Napredne teme |
| C1 | Napredni | Kompleksni izrazi |
| C2 | Profesionalni | Majstorstvo jezika |

## Sadržaj A1 nivoa (12 lekcija)

1. **Pozdravi i Upoznavanje** - Zdravo, Dobar dan, predstavljanje
2. **Brojevi od 1 do 20** - Brojanje, cijene
3. **Boje** - Opisivanje predmeta
4. **Porodica** - Članovi porodice, posvojne zamjenice
5. **Dani u Sedmici** - Vremenski izrazi
6. **Mjeseci i Godišnja Doba** - Kalendar, vrijeme
7. **Hrana i Piće** - Naručivanje, restoran
8. **Kuća i Stan** - Prostorije, namještaj
9. **Tijelo i Zdravlje** - Dijelovi tijela, zdravstveni izrazi
10. **Zanimanja i Posao** - Profesije, radno mjesto
11. **Vrijeme i Sat** - Koliko je sati?
12. **Osnovne Fraze** - Svakodnevna komunikacija

## Funkcionalnosti

- 📚 **Interaktivne kartice vokabulara** - Flip cards sa izgovorom i primjerima
- 📖 **Detaljne gramatičke lekcije** - Tablice, primjeri, objašnjenja
- 💬 **Realistični dijalozi** - Sa prijevodom i kontekstom
- 🇧🇦 **Kulturne bilješke** - Upoznavanje bosanske kulture
- ❓ **Kvizovi** - Testiranje znanja sa objašnjenjima
- 📱 **Responzivan dizajn** - Radi na svim uređajima

## API Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/levels` | Lista svih nivoa |
| GET | `/api/levels/{id}` | Detalji nivoa |
| GET | `/api/levels/{id}/lessons` | Lekcije za nivo |
| GET | `/api/lessons/{id}` | Detalji lekcije |

## Licenca

MIT License
