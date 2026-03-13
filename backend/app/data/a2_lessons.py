from app.data.a2_lessons_2 import A2_LESSONS_PART2
from app.data.a2_lessons_3 import A2_LESSONS_PART3
from app.data.a2_lessons_4 import A2_LESSONS_PART4

A2_LESSONS_BASE = [
    {
        "id": 1,
        "title": "U restoranu",
        "description": "Naučite kako naručiti hranu i piće u restoranu",
        "level": "a2",
        "module": 1,
        "objectives": [
            "Naručiti hranu i piće u restoranu",
            "Pitati za meni i preporuke",
            "Zatražiti račun",
            "Izraziti zadovoljstvo ili nezadovoljstvo hranom"
        ],
        "vocabulary": [
            {"bosnian": "jelovnik", "english": "menu", "pronunciation": "YEH-lov-neek", "example": "Mogu li dobiti jelovnik, molim?", "example_translation": "Can I get the menu, please?", "image_emoji": "📋"},
            {"bosnian": "naručiti", "english": "to order", "pronunciation": "nah-ROO-chee-tee", "example": "Želim naručiti ćevape.", "example_translation": "I want to order ćevapi.", "image_emoji": "📝"},
            {"bosnian": "predjelo", "english": "appetizer", "pronunciation": "PRED-yeh-loh", "example": "Za predjelo ću uzeti supu.", "example_translation": "For appetizer I'll have soup.", "image_emoji": "🥗"},
            {"bosnian": "glavno jelo", "english": "main course", "pronunciation": "GLAHV-noh YEH-loh", "example": "Glavno jelo je bosanski lonac.", "example_translation": "The main course is Bosnian pot.", "image_emoji": "🍲"},
            {"bosnian": "desert", "english": "dessert", "pronunciation": "deh-SERT", "example": "Za desert imam baklavu.", "example_translation": "For dessert I have baklava.", "image_emoji": "🍰"},
            {"bosnian": "piće", "english": "drink", "pronunciation": "PEE-cheh", "example": "Koje piće želite?", "example_translation": "Which drink do you want?", "image_emoji": "🥤"},
            {"bosnian": "račun", "english": "bill", "pronunciation": "RAH-choon", "example": "Račun, molim!", "example_translation": "The bill, please!", "image_emoji": "🧾"},
            {"bosnian": "napojnica", "english": "tip", "pronunciation": "nah-POY-nee-tsah", "example": "Ostavit ću napojnicu.", "example_translation": "I will leave a tip.", "image_emoji": "💵"},
            {"bosnian": "konobar", "english": "waiter", "pronunciation": "KOH-noh-bar", "example": "Konobar je vrlo ljubazan.", "example_translation": "The waiter is very kind.", "image_emoji": "🧑‍🍳"},
            {"bosnian": "rezervacija", "english": "reservation", "pronunciation": "reh-zehr-VAH-tsee-yah", "example": "Imam rezervaciju za dvoje.", "example_translation": "I have a reservation for two.", "image_emoji": "📅"},
            {"bosnian": "specijalitet", "english": "specialty", "pronunciation": "speh-tsee-yah-lee-TEHT", "example": "Koji je specijalitet kuće?", "example_translation": "What is the house specialty?", "image_emoji": "⭐"},
            {"bosnian": "preporučiti", "english": "to recommend", "pronunciation": "preh-poh-ROO-chee-tee", "example": "Šta preporučujete?", "example_translation": "What do you recommend?", "image_emoji": "👍"}
        ],
        "grammar_explanation": """
## Kondicionalni oblik - želio/željela bih (Conditional - I would like)

U restoranu često koristimo kondicionalni oblik za pristojne zahtjeve:

| Osoba | Muški rod | Ženski rod |
|-------|-----------|------------|
| Ja | želio bih | željela bih |
| Ti | želio bi | željela bi |
| On/Ona | želio bi | željela bi |
| Mi | željeli bismo | željele bismo |
| Vi | željeli biste | željele biste |
| Oni | željeli bi | željele bi |

### Primjeri:
- **Želio bih** naručiti. (I would like to order.) - muški
- **Željela bih** kafu. (I would like a coffee.) - ženski
- **Željeli bismo** sto za četvoro. (We would like a table for four.)

## Korisni izrazi u restoranu

| Bosanski | English |
|----------|---------|
| Izvolite? | May I help you? |
| Molim vas... | Please... |
| Hvala lijepo | Thank you very much |
| Prijatno! | Enjoy your meal! |
| Bilo je odlično! | It was excellent! |
""",
        "grammar_explanation_en": """
## Conditional Form - I would like

In restaurants, we often use the conditional form for polite requests:

| Person | Masculine | Feminine |
|--------|-----------|----------|
| I | želio bih | željela bih |
| You | želio bi | željela bi |
| He/She | želio bi | željela bi |
| We | željeli bismo | željele bismo |
| You (pl.) | željeli biste | željele biste |
| They | željeli bi | željele bi |

### Examples:
- **Želio bih** naručiti. (I would like to order.) - masculine
- **Željela bih** kafu. (I would like a coffee.) - feminine
- **Željeli bismo** sto za četvoro. (We would like a table for four.)

## Useful Restaurant Phrases

| Bosnian | English |
|---------|---------|
| Izvolite? | May I help you? |
| Molim vas... | Please... |
| Hvala lijepo | Thank you very much |
| Prijatno! | Enjoy your meal! |
| Bilo je odlično! | It was excellent! |
""",
        "cultural_note": "Bosanska kuhinja je poznata po ćevapima, bureku, bosanskom loncu i baklavi. U tradicionalnim restoranima (aščinicama), hrana se često servira u zemljanim posudama. Bosanska kafa se pije polagano i smatra se društvenim ritualom.",
        "cultural_note_en": "Bosnian cuisine is famous for ćevapi, burek, Bosnian pot, and baklava. In traditional restaurants (aščinice), food is often served in clay pots. Bosnian coffee is drunk slowly and is considered a social ritual.",
        "cultural_comic": {
            "title": "Ručak u aščinici na Baščaršiji",
            "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d3/a8/13/bascarsija.jpg?w=1200",
            "panels": [
                {"character": "👨🏻", "name": "Amer", "text": "Dobar dan! Imamo rezervaciju za dvoje.", "translation": "Good day! We have a reservation for two.", "position": "left", "avatar": "https://i.pravatar.cc/100?img=33"},
                {"character": "🧑‍🍳", "name": "Konobar", "text": "Dobrodošli! Izvolite sjesti. Evo jelovnika.", "translation": "Welcome! Please sit down. Here's the menu.", "position": "right", "avatar": "https://i.pravatar.cc/100?img=59"},
                {"character": "👩", "name": "Lejla", "text": "Šta preporučujete? Koji je specijalitet kuće?", "translation": "What do you recommend? What's the house specialty?", "position": "left", "avatar": "https://i.pravatar.cc/100?img=47"},
                {"character": "🧑‍🍳", "name": "Konobar", "text": "Preporučujem bosanski lonac. Odličan je!", "translation": "I recommend the Bosnian pot. It's excellent!", "position": "right", "avatar": "https://i.pravatar.cc/100?img=59"},
                {"character": "👨🏻", "name": "Amer", "text": "Dobro, željeli bismo dva bosanska lonca i dvije kafe.", "translation": "Good, we would like two Bosnian pots and two coffees.", "position": "left", "avatar": "https://i.pravatar.cc/100?img=33"}
            ]
        },
        "dialogue": [
            {"speaker": "Konobar", "text": "Dobro veče! Izvolite, evo jelovnika.", "translation": "Good evening! Here you go, here's the menu."},
            {"speaker": "Gost", "text": "Hvala. Šta preporučujete za večeru?", "translation": "Thank you. What do you recommend for dinner?"},
            {"speaker": "Konobar", "text": "Naš specijalitet su ćevapi sa kajmakom.", "translation": "Our specialty is ćevapi with kajmak."},
            {"speaker": "Gost", "text": "Odlično! Želio bih porciju ćevapa i jednu mineralnu vodu.", "translation": "Excellent! I would like a portion of ćevapi and one mineral water."},
            {"speaker": "Konobar", "text": "Naravno. Želite li nešto za desert?", "translation": "Of course. Would you like something for dessert?"},
            {"speaker": "Gost", "text": "Da, jednu baklavu, molim. I račun poslije.", "translation": "Yes, one baklava, please. And the bill afterwards."}
        ],
        "exercises": [
            {"id": 1, "type": "fill_blank", "instruction": "Popunite prazninu kondicionalnim oblikom", "content": {"sentence": "_____ bih naručiti ćevape.", "options": ["Želio", "Želim", "Želi", "Želite"]}, "answer": "Želio", "hint": "Kondicionalni oblik za muškarce"},
            {"id": 2, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Mogu li dobiti _____, molim?", "options": ["jelovnik", "konobar", "restoran", "kuhinja"]}, "answer": "jelovnik", "hint": "Šta tražite da vidite jela?"},
            {"id": 3, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Šta _____? Koji je specijalitet kuće?", "options": ["preporučujete", "jedete", "plaćate", "pijete"]}, "answer": "preporučujete", "hint": "Pitanje za savjet"},
            {"id": 4, "type": "fill_blank", "instruction": "Popunite prazninu kondicionalnim oblikom", "content": {"sentence": "_____ bismo sto za četvoro.", "options": ["Željeli", "Želimo", "Željeli bi", "Želio"]}, "answer": "Željeli", "hint": "Kondicionalni oblik za 'mi'"},
            {"id": 5, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "_____, molim!", "options": ["Račun", "Jelovnik", "Konobar", "Sto"]}, "answer": "Račun", "hint": "The bill = ?"},
            {"id": 6, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Želite li nešto za _____?", "options": ["desert", "predjelo", "piće", "račun"]}, "answer": "desert", "hint": "Dessert = ?"},
            {"id": 7, "type": "fill_blank", "instruction": "Popunite prazninu kondicionalnim oblikom (ženski)", "content": {"sentence": "_____ bih jednu bosansku kafu.", "options": ["Željela", "Želio", "Željeli", "Želim"]}, "answer": "Željela", "hint": "Ženski rod kondicionala"},
            {"id": 8, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Evo vašeg _____. Hvala na posjeti!", "options": ["računa", "jela", "pića", "stola"]}, "answer": "računa", "hint": "Genitiv od 'račun'"},
            {"id": 9, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "_____ su ćevapi sa kajmakom.", "options": ["Specijalitet", "Specijaliteti", "Jelo", "Hrana"]}, "answer": "Specijalitet", "hint": "House specialty = ?"},
            {"id": 10, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Koliko iznosi _____?", "options": ["napojnica", "račun", "jelo", "konobar"]}, "answer": "račun", "hint": "Total bill = ?"},
            {"id": 11, "type": "matching", "instruction": "Povežite riječi sa značenjima", "content": {"pairs": [["jelovnik", "menu"], ["račun", "bill"], ["napojnica", "tip"], ["predjelo", "appetizer"], ["konobar", "waiter"]]},"answer": "correct_pairs", "hint": "Razmislite o situaciji u restoranu"},
            {"id": 12, "type": "matching", "instruction": "Povežite bosanske fraze sa engleskim", "content": {"pairs": [["Prijatno!", "Enjoy your meal!"], ["Izvolite", "Here you go"], ["Račun, molim", "The bill, please"], ["Šta preporučujete?", "What do you recommend?"], ["Željeli bismo", "We would like"]]},"answer": "correct_pairs", "hint": "Uobičajene fraze u restoranu"},
            {"id": 13, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "The bill, please!"}, "answer": "Račun, molim!", "hint": "Koristite riječ 'račun'"},
            {"id": 14, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "I would like to order ćevapi."}, "answer": "Želio bih naručiti ćevape.", "hint": "Koristite kondicionalni oblik"},
            {"id": 15, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "What is the house specialty?"}, "answer": "Koji je specijalitet kuće?", "hint": "Specijalitet = specialty"},
            {"id": 16, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "We would like a table for four."}, "answer": "Željeli bismo sto za četvoro.", "hint": "Željeli bismo = We would like"},
            {"id": 17, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "What do you recommend?"}, "answer": "Šta preporučujete?", "hint": "Preporučujete = you recommend"},
            {"id": 18, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["bih", "kafu", "Željela", "bosansku", "jednu", "."]}, "answer": "Željela bih jednu bosansku kafu.", "hint": "Počnite s 'Željela'"},
            {"id": 19, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["molim", "Račun", ",", "!"]}, "answer": "Račun, molim!", "hint": "Traženje računa"},
            {"id": 20, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["preporučujete", "Šta", "?"]}, "answer": "Šta preporučujete?", "hint": "Pitanje za savjet"},
            {"id": 21, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["bismo", "za", "Željeli", "četvoro", "sto", "."]}, "answer": "Željeli bismo sto za četvoro.", "hint": "Rezervacija stola"},
            {"id": 22, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["kuće", "je", "specijalitet", "Koji", "?"]}, "answer": "Koji je specijalitet kuće?", "hint": "Pitanje o specijalitetu"},
            {"id": 23, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["naručiti", "bih", "Želio", "ćevape", "."]}, "answer": "Želio bih naručiti ćevape.", "hint": "Naručivanje hrane"},
            {"id": 24, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["desert", "nešto", "za", "li", "Želite", "?"]}, "answer": "Želite li nešto za desert?", "hint": "Pitanje o desertu"},
            {"id": 25, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["jelovnik", "li", "dobiti", "Mogu", "?"]}, "answer": "Mogu li dobiti jelovnik?", "hint": "Traženje jelovnika"},
            {"id": 26, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["posjeti", "Hvala", "na", "!"]}, "answer": "Hvala na posjeti!", "hint": "Zahvala konobara"},
            {"id": 27, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["baklavu", "jednu", "molim", ",", "."]}, "answer": "Jednu baklavu, molim.", "hint": "Naručivanje deserta"},
            {"id": 28, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "The bill, please"}, "answer": "Račun, molim", "hint": "U restoranu"},
            {"id": 29, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "I would like to order (m.)"}, "answer": "Želio bih naručiti", "hint": "Kondicionalni oblik"},
            {"id": 30, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "What do you recommend?"}, "answer": "Šta preporučujete?", "hint": "Pitanje za savjet"},
            {"id": 31, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "menu"}, "answer": "jelovnik", "hint": "Lista jela"},
            {"id": 32, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "tip"}, "answer": "napojnica", "hint": "Za konobara"},
            {"id": 33, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "waiter"}, "answer": "konobar", "hint": "Osoba koja servira"},
            {"id": 34, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "house specialty"}, "answer": "specijalitet kuće", "hint": "Najbolje jelo"},
            {"id": 35, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "dessert"}, "answer": "desert", "hint": "Slatko nakon jela"},
            {"id": 36, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "We would like a table for four"}, "answer": "Željeli bismo sto za četvoro", "hint": "Rezervacija"},
            {"id": 37, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "Enjoy your meal!"}, "answer": "Prijatno!", "hint": "Želja prije jela"},
            {"id": 38, "type": "find_error_word", "instruction": "Pronađite zanimanje koje ne radi u restoranu", "content": {"words": ["konobar", "kuhar", "menadžer", "vozač"]}, "answer": "vozač", "hint": "'Vozač' vozi vozila i ne radi u restoranu — konobar, kuhar i menadžer su tipična restorantska zanimanja"},
            {"id": 39, "type": "find_error_word", "instruction": "Pronađite pojam koji ne spada u standardne dijelove restoranskog obroka (kurs menija)", "content": {"words": ["predjelo", "jutarnji obrok", "glavno jelo", "desert"]}, "answer": "jutarnji obrok", "hint": "'Jutarnji obrok' je doručak — naziv za cijeli obrok, a ne kurs menija; predjelo, glavno jelo i desert su standardni dijelovi restoranskog menija"},
            {"id": 40, "type": "find_error_word", "instruction": "Pronađite pojam koji nije vrsta restorana ili ugostiteljskog objekta", "content": {"words": ["restoran", "kafana", "aščinica", "banka"]}, "answer": "banka", "hint": "'Banka' je financijska institucija, a ne ugostiteljski objekt — restoran, kafana i aščinica su mjesta za objedovanje"},
            {"id": 41, "type": "find_error_word", "instruction": "Pronađite jelo koje nije tipična bosanska hrana", "content": {"words": ["ćevapi", "burek", "baklava", "sushi"]}, "answer": "sushi", "hint": "'Sushi' je japansko jelo, a ne dio bosanske kuhinje — ćevapi, burek i baklava su tradicionalna bosanska jela"},
            {"id": 42, "type": "find_error_word", "instruction": "Pronađite pojam koji nije vrsta bezalkoholnog pića", "content": {"words": ["vino", "sok", "voda", "čaj"]}, "answer": "vino", "hint": "'Vino' je alkoholno piće — sok, voda i čaj su bezalkoholna pića koja se mogu naručiti u restoranu"},
            {"id": 43, "type": "find_error_word", "instruction": "Pronađite predmet koji nije pribor za jelo koji se stavlja na sto", "content": {"words": ["viljuška", "nož", "kašika", "lonac"]}, "answer": "lonac", "hint": "'Lonac' je posuda za kuhanje, a ne pribor koji se stavlja na trpezarijski sto — viljuška, nož i kašika su pribor za jelo"},
            {"id": 44, "type": "find_error_word", "instruction": "Pronađite pridjev koji ne opisuje okus hrane", "content": {"words": ["sladak", "gorak", "kiseo", "visok"]}, "answer": "visok", "hint": "'Visok' opisuje visinu, a ne okus — sladak, gorak i kiseo su okusi hrane"},
            {"id": 45, "type": "find_error_word", "instruction": "Pronađite pridjev koji ne opisuje temperaturu jela ili pića", "content": {"words": ["hladna", "topla", "vruća", "slatka"]}, "answer": "slatka", "hint": "'Slatka' opisuje okus, a ne temperaturu — hladna, topla i vruća opisuju temperaturu hrane ili pića"},
            {"id": 46, "type": "find_error_word", "instruction": "Pronađite pojam koji nije vrsta tople juhe", "content": {"words": ["čorba", "supa", "juha", "kompot"]}, "answer": "kompot", "hint": "'Kompot' je slatko voćno piće, a ne topla juha — čorba, supa i juha su različiti nazivi za topla tekuća jela"},
            {"id": 47, "type": "find_error_word", "instruction": "Pronađite vrstu ugostiteljskog objekta koji ne služi jelo", "content": {"words": ["aščinica", "kafana", "ćevabdžinica", "supermarket"]}, "answer": "supermarket", "hint": "'Supermarket' je prodavnica prehrambenih artikala, a ne ugostiteljski objekt — aščinica, kafana i ćevabdžinica su mjesta gdje se jede i pije"},
            {"id": 48, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Mogu li dobiti jelovnik?", "Molim vas račun.", "Šta preporučujete?", "Željela bih naruči."]}, "answer": "Željela bih naruči.", "hint": "Iza 'bih' dolazi infinitiv — ispravno je 'Željela bih naručiti'"},
            {"id": 49, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Konobar je ljubazan.", "Hrana je odlična.", "Naručili smo ćevape.", "Restoran su pun."]}, "answer": "Restoran su pun.", "hint": "Restoran je jednina — ispravno je 'Restoran je pun'"},
            {"id": 50, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Imam rezervaciju za četvoro.", "Stol je slobodan.", "Plaćam karticom.", "Napojnica su uključena."]}, "answer": "Napojnica su uključena.", "hint": "Napojnica je jednina — ispravno je 'Napojnica je uključena'"},
            {"id": 51, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Hrana je ukusna.", "Piće su dobro.", "Jelo je toplo.", "Kafa je jaka."]}, "answer": "Piće su dobro.", "hint": "Piće je jednina sredneg roda — ispravno je 'Piće je dobro'"},
            {"id": 52, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Ima li slobodnih mjesta?", "Željeli bismo sto za dvoje.", "Konobar, račun molim!", "Možemo li sjedimo ovdje?"]}, "answer": "Možemo li sjedimo ovdje?", "hint": "Ispravno je 'Možemo li sjesti ovdje?' — infinitiv, ne prezent"},
            {"id": 53, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Za predjelo ću uzeti supu.", "Za glavno jelo naručio sam ćevapi.", "Desert je bio odličan.", "Konobar je bio susretljiv."]}, "answer": "Za glavno jelo naručio sam ćevapi.", "hint": "Glagol 'naručiti' zahtijeva akuzativ — ispravno je 'naručio sam ćevape'"},
            {"id": 54, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Ona je naručila supu.", "On je naručila salatu.", "Mi smo naručili ćevape.", "Vi ste naručili piće."]}, "answer": "On je naručila salatu.", "hint": "Za muški rod koristimo 'naručio' — ispravno je 'On je naručio salatu'"},
            {"id": 55, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Koliko košta ovo jelo?", "Ima li vegetarijanskih opcija?", "Alergičan sam na gluten.", "Donijete mi vode, molim."]}, "answer": "Donijete mi vode, molim.", "hint": "Imperativ od 'donijeti' je 'donesite' — ispravno je 'Donesite mi vode, molim'"},
            {"id": 56, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Hrana je bila prekrasna.", "Obavezno ću se vratiti.", "Preporučit ću ovaj restoran.", "Konobar su bio srdačan."]}, "answer": "Konobar su bio srdačan.", "hint": "Konobar je jednina — ispravno je 'Konobar je bio srdačan'"},
            {"id": 57, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Koji je specijalitet kuće?", "Preporučujete li ćevape?", "Naručio bih ribu.", "Ona bi naručit piletinu."]}, "answer": "Ona bi naručit piletinu.", "hint": "Kondicionalni oblik: ispravno je 'Ona bi naručila piletinu'"}
        ],
        "quiz": [
            {"id": 1, "question": "Kako pristojno naručiti hranu na bosanskom?", "options": ["Daj mi hranu!", "Želio bih naručiti...", "Hoću jesti!", "Daj jelovnik!"], "correct_answer": 1, "explanation": "'Želio bih' je pristojan način za naručivanje.", "question_type": "usage"},
            {"id": 2, "question": "Šta znači 'jelovnik'?", "options": ["Waiter", "Menu", "Bill", "Table"], "correct_answer": 1, "explanation": "'Jelovnik' je lista jela u restoranu.", "question_type": "vocabulary"},
            {"id": 3, "question": "Kako se kaže 'tip' na bosanskom?", "options": ["račun", "napojnica", "konobar", "piće"], "correct_answer": 1, "explanation": "'Napojnica' je novac koji ostavite konobaru.", "question_type": "vocabulary"},
            {"id": 4, "question": "Koja je pravilna forma: 'Mi _____ sto za četvoro'?", "options": ["željeli bih", "željeli bismo", "želio bih", "željela bi"], "correct_answer": 1, "explanation": "'Željeli bismo' je kondicionalni oblik za 'mi'.", "question_type": "grammar"},
            {"id": 5, "question": "Šta znači 'Prijatno!'?", "options": ["Goodbye", "Thank you", "Enjoy your meal", "Please"], "correct_answer": 2, "explanation": "'Prijatno' se kaže prije jela.", "question_type": "vocabulary"},
            {"id": 6, "question": "Kako tražite preporuku od konobara?", "options": ["Šta imate?", "Šta preporučujete?", "Koliko košta?", "Gdje je?"], "correct_answer": 1, "explanation": "'Šta preporučujete?' znači 'What do you recommend?'", "question_type": "usage"},
            {"id": 7, "question": "Šta je 'predjelo'?", "options": ["Main course", "Dessert", "Appetizer", "Drink"], "correct_answer": 2, "explanation": "'Predjelo' je jelo koje se servira prije glavnog jela.", "question_type": "vocabulary"},
            {"id": 8, "question": "Kako žena kaže 'I would like'?", "options": ["Želio bih", "Željela bih", "Željeli bismo", "Želim"], "correct_answer": 1, "explanation": "'Željela bih' je ženski rod kondicionala.", "question_type": "grammar"},
            {"id": 9, "question": "Šta znači 'specijalitet kuće'?", "options": ["House for sale", "House specialty", "Special house", "Big house"], "correct_answer": 1, "explanation": "'Specijalitet kuće' je najbolje jelo restorana.", "question_type": "vocabulary"},
            {"id": 10, "question": "Kako tražite račun?", "options": ["Jelovnik, molim!", "Račun, molim!", "Piće, molim!", "Voda, molim!"], "correct_answer": 1, "explanation": "'Račun, molim!' je način da zatražite račun.", "question_type": "usage"},
            {"id": 11, "question": "Šta je 'bosanski lonac'?", "options": ["A traditional Bosnian pot dish", "A Bosnian pot for cooking", "A restaurant name", "A type of coffee"], "correct_answer": 0, "explanation": "'Bosanski lonac' je tradicionalno jelo sa mesom i povrćem.", "question_type": "cultural"},
            {"id": 12, "question": "Kako kažemo 'reservation' na bosanskom?", "options": ["restoran", "rezervacija", "recepcija", "registracija"], "correct_answer": 1, "explanation": "'Rezervacija' znači 'reservation'.", "question_type": "vocabulary"},
            {"id": 13, "question": "Napiši na bosanskom: 'The bill, please'", "question_type": "writing", "correct_answer_text": "Račun, molim", "explanation": "'Račun' = bill, 'molim' = please."},
            {"id": 14, "question": "Napiši na bosanskom: 'I would like to order' (muški)", "question_type": "writing", "correct_answer_text": "Želio bih naručiti", "explanation": "Kondicionalni oblik za muškarce."},
            {"id": 15, "question": "Napiši na bosanskom: 'What do you recommend?'", "question_type": "writing", "correct_answer_text": "Šta preporučujete", "explanation": "'Preporučujete' je Vi-forma glagola 'preporučiti'."}
        ]
    },
    {
        "id": 2,
        "title": "Kupovina u trgovini",
        "description": "Naučite kako obaviti kupovinu i razgovarati sa prodavačem",
        "level": "a2",
        "module": 1,
        "objectives": [
            "Pitati za cijenu proizvoda",
            "Opisati šta tražite",
            "Razumjeti veličine i količine",
            "Platiti i dobiti kusur"
        ],
        "vocabulary": [
            {"bosnian": "cijena", "english": "price", "pronunciation": "TSEE-yeh-nah", "example": "Koja je cijena ove majice?", "example_translation": "What is the price of this T-shirt?", "image_emoji": "💰"},
            {"bosnian": "popust", "english": "discount", "pronunciation": "POH-poost", "example": "Imate li popust?", "example_translation": "Do you have a discount?", "image_emoji": "🏷️"},
            {"bosnian": "veličina", "english": "size", "pronunciation": "veh-lee-CHEE-nah", "example": "Koja veličina vam treba?", "example_translation": "What size do you need?", "image_emoji": "📏"},
            {"bosnian": "blagajna", "english": "cash register", "pronunciation": "blah-GUY-nah", "example": "Platite na blagajni.", "example_translation": "Pay at the cash register.", "image_emoji": "🧾"},
            {"bosnian": "kusur", "english": "change", "pronunciation": "KOO-soor", "example": "Evo vašeg kusura.", "example_translation": "Here's your change.", "image_emoji": "💵"},
            {"bosnian": "gotovina", "english": "cash", "pronunciation": "goh-toh-VEE-nah", "example": "Plaćate gotovinom ili karticom?", "example_translation": "Are you paying by cash or card?", "image_emoji": "💵"},
            {"bosnian": "kartica", "english": "card", "pronunciation": "KAR-tee-tsah", "example": "Primamo kartice.", "example_translation": "We accept cards.", "image_emoji": "💳"},
            {"bosnian": "prodavnica", "english": "store", "pronunciation": "proh-DAHV-nee-tsah", "example": "Ova prodavnica ima sve.", "example_translation": "This store has everything.", "image_emoji": "🏪"},
            {"bosnian": "probati", "english": "to try on", "pronunciation": "PROH-bah-tee", "example": "Mogu li probati ovu haljinu?", "example_translation": "Can I try on this dress?", "image_emoji": "👗"},
            {"bosnian": "kabina", "english": "fitting room", "pronunciation": "kah-BEE-nah", "example": "Kabina je tamo.", "example_translation": "The fitting room is there.", "image_emoji": "🚪"},
            {"bosnian": "jeftino", "english": "cheap", "pronunciation": "YEHF-tee-noh", "example": "Ovo je vrlo jeftino.", "example_translation": "This is very cheap.", "image_emoji": "👍"},
            {"bosnian": "skupo", "english": "expensive", "pronunciation": "SKOO-poh", "example": "To je preskupo za mene.", "example_translation": "That's too expensive for me.", "image_emoji": "💎"}
        ],
        "grammar_explanation": """
## Komparativ pridjeva (Comparative Adjectives)

Za poređenje koristimo komparativ:

| Pozitiv | Komparativ | Superlativ |
|---------|------------|------------|
| skup (expensive) | skuplji | najskuplji |
| jeftin (cheap) | jeftiniji | najjeftiniji |
| velik (big) | veći | najveći |
| mali (small) | manji | najmanji |
| dobar (good) | bolji | najbolji |
| loš (bad) | gori/lošiji | najgori/najlošiji |

### Primjeri:
- Ova majica je **skuplja** od one. (This T-shirt is more expensive than that one.)
- Ovo je **najjeftinija** opcija. (This is the cheapest option.)
- Imam **veću** veličinu. (I have a bigger size.)

## Korisni izrazi za kupovinu

| Bosanski | English |
|----------|---------|
| Koliko košta? | How much does it cost? |
| Imate li...? | Do you have...? |
| Tražim... | I'm looking for... |
| Previše je skupo. | It's too expensive. |
| Uzeću ovo. | I'll take this. |
""",
        "grammar_explanation_en": """
## Comparative Adjectives

For comparison we use the comparative form:

| Positive | Comparative | Superlative |
|----------|-------------|-------------|
| skup (expensive) | skuplji | najskuplji |
| jeftin (cheap) | jeftiniji | najjeftiniji |
| velik (big) | veći | najveći |
| mali (small) | manji | najmanji |
| dobar (good) | bolji | najbolji |
| loš (bad) | gori/lošiji | najgori/najlošiji |

### Examples:
- Ova majica je **skuplja** od one. (This T-shirt is more expensive than that one.)
- Ovo je **najjeftinija** opcija. (This is the cheapest option.)
- Imam **veću** veličinu. (I have a bigger size.)

## Useful Shopping Phrases

| Bosnian | English |
|---------|---------|
| Koliko košta? | How much does it cost? |
| Imate li...? | Do you have...? |
| Tražim... | I'm looking for... |
| Previše je skupo. | It's too expensive. |
| Uzeću ovo. | I'll take this. |
""",
        "cultural_note": "U Bosni i Hercegovini, tradicionalne pijace su i dalje popularne za kupovinu svježeg voća, povrća i domaćih proizvoda. Pregovaranje o cijeni je uobičajeno na pijacama, ali ne u trgovinama sa fiksnim cijenama.",
        "cultural_note_en": "In Bosnia and Herzegovina, traditional markets are still popular for buying fresh fruits, vegetables, and homemade products. Bargaining is common at markets, but not in stores with fixed prices.",
        "cultural_comic": {
            "title": "Kupovina na Markale pijaci",
            "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/9a/e4/1c/bascarsija.jpg?w=1200",
            "panels": [
                {"character": "👩", "name": "Amina", "text": "Dobar dan! Koliko koštaju ove jabuke?", "translation": "Good day! How much do these apples cost?", "position": "left", "avatar": "https://i.pravatar.cc/100?img=47"},
                {"character": "👨‍🌾", "name": "Prodavač", "text": "Dvije marke kilogram. Najsvježije su!", "translation": "Two marks per kilogram. They're the freshest!", "position": "right", "avatar": "https://i.pravatar.cc/100?img=59"},
                {"character": "👩", "name": "Amina", "text": "Imate li jeftinije? To je malo skupo.", "translation": "Do you have cheaper ones? That's a bit expensive.", "position": "left", "avatar": "https://i.pravatar.cc/100?img=47"},
                {"character": "👨‍🌾", "name": "Prodavač", "text": "Za vas - marka i po. Najbolja cijena!", "translation": "For you - one and a half marks. Best price!", "position": "right", "avatar": "https://i.pravatar.cc/100?img=59"},
                {"character": "👩", "name": "Amina", "text": "Odlično! Uzeću dva kilograma. Evo pet maraka.", "translation": "Excellent! I'll take two kilograms. Here's five marks.", "position": "left", "avatar": "https://i.pravatar.cc/100?img=47"}
            ]
        },
        "dialogue": [
            {"speaker": "Kupac", "text": "Dobar dan! Tražim zimsku jaknu.", "translation": "Good day! I'm looking for a winter jacket."},
            {"speaker": "Prodavač", "text": "Naravno! Koja veličina vam treba?", "translation": "Of course! What size do you need?"},
            {"speaker": "Kupac", "text": "Srednja veličina. Koliko košta ova plava?", "translation": "Medium size. How much does this blue one cost?"},
            {"speaker": "Prodavač", "text": "Stotinu maraka. Ali imamo popust - osamdeset maraka.", "translation": "One hundred marks. But we have a discount - eighty marks."},
            {"speaker": "Kupac", "text": "Mogu li probati? Gdje je kabina?", "translation": "Can I try it on? Where is the fitting room?"},
            {"speaker": "Prodavač", "text": "Kabina je tamo desno. Izvolite!", "translation": "The fitting room is there on the right. Here you go!"}
        ],
        "exercises": [
            {"id": 1, "type": "fill_blank", "instruction": "Popunite prazninu komparativom", "content": {"sentence": "Ova jakna je _____ od one. (skup)", "options": ["skupa", "skuplja", "najskuplja", "skupo"]}, "answer": "skuplja", "hint": "Komparativ pridjeva 'skup'"},
            {"id": 2, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "_____ je cijena ove majice?", "options": ["Koliko", "Koja", "Što", "Gdje"]}, "answer": "Koja", "hint": "Pitanje o cijeni"},
            {"id": 3, "type": "fill_blank", "instruction": "Popunite prazninu komparativom", "content": {"sentence": "Ova veličina je _____ od one. (mali)", "options": ["mali", "manji", "najmanji", "mala"]}, "answer": "manji", "hint": "Komparativ od 'mali'"},
            {"id": 4, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Mogu li _____ ovu haljinu?", "options": ["probati", "kupiti", "platiti", "nositi"]}, "answer": "probati", "hint": "Želite vidjeti kako vam stoji"},
            {"id": 5, "type": "fill_blank", "instruction": "Popunite prazninu superlativom", "content": {"sentence": "Ovo je _____ opcija u prodavnici. (jeftin)", "options": ["jeftina", "jeftinija", "najjeftinija", "jeftino"]}, "answer": "najjeftinija", "hint": "Superlativ od 'jeftin'"},
            {"id": 6, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Plaćate _____ ili karticom?", "options": ["gotovinom", "novcem", "cijenom", "kusurom"]}, "answer": "gotovinom", "hint": "Cash = ?"},
            {"id": 7, "type": "fill_blank", "instruction": "Popunite prazninu komparativom", "content": {"sentence": "Ovo je _____ od onog. (dobar)", "options": ["dobar", "bolji", "najbolji", "dobro"]}, "answer": "bolji", "hint": "Komparativ od 'dobar'"},
            {"id": 8, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Evo vašeg _____.", "options": ["kusura", "cijene", "popusta", "kartice"]}, "answer": "kusura", "hint": "Change = ?"},
            {"id": 9, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Gdje je _____? Želim probati.", "options": ["kabina", "blagajna", "prodavnica", "cijena"]}, "answer": "kabina", "hint": "Fitting room = ?"},
            {"id": 10, "type": "fill_blank", "instruction": "Popunite prazninu superlativom", "content": {"sentence": "Ovo je _____ jakna u prodavnici. (skup)", "options": ["skupa", "skuplja", "najskuplja", "skupo"]}, "answer": "najskuplja", "hint": "Superlativ od 'skup'"},
            {"id": 11, "type": "matching", "instruction": "Povežite suprotne pridjeve", "content": {"pairs": [["skupo", "jeftino"], ["veliko", "malo"], ["dobro", "loše"], ["bolje", "gore"], ["veći", "manji"]]},"answer": "correct_pairs", "hint": "Razmislite o suprotnostima"},
            {"id": 12, "type": "matching", "instruction": "Povežite riječi sa značenjima", "content": {"pairs": [["cijena", "price"], ["popust", "discount"], ["kusur", "change"], ["blagajna", "cash register"], ["kabina", "fitting room"]]},"answer": "correct_pairs", "hint": "Riječi za kupovinu"},
            {"id": 13, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "How much does this cost?"}, "answer": "Koliko ovo košta?", "hint": "Koristite 'koliko' i 'koštati'"},
            {"id": 14, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "Do you have a bigger size?"}, "answer": "Imate li veću veličinu?", "hint": "Veći = bigger"},
            {"id": 15, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "I'll take this one."}, "answer": "Uzeću ovo.", "hint": "Futur od 'uzeti'"},
            {"id": 16, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "This is too expensive."}, "answer": "Ovo je preskupo.", "hint": "Preskupo = too expensive"},
            {"id": 17, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "Do you have a discount?"}, "answer": "Imate li popust?", "hint": "Popust = discount"},
            {"id": 18, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["Imate", "popust", "li", "danas", "?"]}, "answer": "Imate li popust danas?", "hint": "Pitanje o popustu"},
            {"id": 19, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["ovo", "Koliko", "košta", "?"]}, "answer": "Koliko ovo košta?", "hint": "Pitanje o cijeni"},
            {"id": 20, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["veću", "li", "veličinu", "Imate", "?"]}, "answer": "Imate li veću veličinu?", "hint": "Pitanje o veličini"},
            {"id": 21, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["preskupo", "Ovo", "je", "."]}, "answer": "Ovo je preskupo.", "hint": "Previše skupo"},
            {"id": 22, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["ovo", "Uzeću", "."]}, "answer": "Uzeću ovo.", "hint": "Odluka za kupnju"},
            {"id": 23, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["kabina", "je", "Gdje", "?"]}, "answer": "Gdje je kabina?", "hint": "Pitanje za probanje"},
            {"id": 24, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["karticom", "ili", "gotovinom", "Plaćate", "?"]}, "answer": "Plaćate gotovinom ili karticom?", "hint": "Način plaćanja"},
            {"id": 25, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["kusura", "vašeg", "Evo", "."]}, "answer": "Evo vašeg kusura.", "hint": "Vraćanje ostatka"},
            {"id": 26, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["od", "skuplja", "one", "Ova", "jakna", "je", "."]}, "answer": "Ova jakna je skuplja od one.", "hint": "Poređenje cijena"},
            {"id": 27, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["probati", "li", "Mogu", "?"]}, "answer": "Mogu li probati?", "hint": "Pitanje za probanje"},
            {"id": 28, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "How much does this cost?"}, "answer": "Koliko ovo košta?", "hint": "Pitanje o cijeni"},
            {"id": 29, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "price"}, "answer": "cijena", "hint": "Koliko nešto košta"},
            {"id": 30, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "discount"}, "answer": "popust", "hint": "Sniženje"},
            {"id": 31, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "change (money)"}, "answer": "kusur", "hint": "Ostatak novca"},
            {"id": 32, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "fitting room"}, "answer": "kabina", "hint": "Za probanje odjeće"},
            {"id": 33, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "cash"}, "answer": "gotovina", "hint": "Papirni novac"},
            {"id": 34, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "This is too expensive"}, "answer": "Ovo je preskupo", "hint": "Previše skupo"},
            {"id": 35, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "I'll take this"}, "answer": "Uzeću ovo", "hint": "Odluka za kupnju"},
            {"id": 36, "type": "writing", "instruction": "Napišite komparativ od 'skup'", "content": {"text": "comparative of 'skup'"}, "answer": "skuplja", "hint": "Više skupo"},
            {"id": 37, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "Do you have a bigger size?"}, "answer": "Imate li veću veličinu?", "hint": "Pitanje o veličini"},
            {"id": 38, "type": "find_error_word", "instruction": "Pronađite pojam koji ne spada u pojmove pri kupovini odjeće", "content": {"words": ["cijena", "popust", "veličina", "benzin"]}, "answer": "benzin", "hint": "'Benzin' je gorivo za automobile — cijena, popust i veličina su tipični pojmovi pri kupovini odjeće"},
            {"id": 39, "type": "find_error_word", "instruction": "Pronađite predmet koji se ne prodaje u modnoj radnji", "content": {"words": ["haljina", "košulja", "suknja", "tanjir"]}, "answer": "tanjir", "hint": "'Tanjir' je suđe za jelo koje se kupuje u drogeriji ili prodavnici kućanskih potrepština — haljina, košulja i suknja su odjevni predmeti"},
            {"id": 40, "type": "find_error_word", "instruction": "Pronađite pojam koji nije način plaćanja", "content": {"words": ["gotovina", "kartica", "ček", "putovnica"]}, "answer": "putovnica", "hint": "'Putovnica' je dokument za putovanje, a ne način plaćanja — gotovina, kartica i ček su načini plaćanja u radnji"},
            {"id": 41, "type": "find_error_word", "instruction": "Pronađite pojam koji nije odjevni predmet ili modni dodatak", "content": {"words": ["odjeća", "obuća", "nakit", "rječnik"]}, "answer": "rječnik", "hint": "'Rječnik' je knjiga koja se kupuje u knjižari — odjeća, obuća i nakit su artikli koji se kupuju u modnoj radnji"},
            {"id": 42, "type": "find_error_word", "instruction": "Pronađite pogrešno složen par pridjeva i imenice (nepodudaranje u broju)", "content": {"words": ["skupa haljina", "skupi auto", "skupu cipele", "skupo vino"]}, "answer": "skupu cipele", "hint": "'Cipele' je množina — ispravno je 'skupe cipele'; 'skupu' je jedninski akuzativ koji ne odgovara množini"},
            {"id": 43, "type": "find_error_word", "instruction": "Pronađite pojam koji ne spada u prava kupca pri prigovoru", "content": {"words": ["povrat novca", "reklamacija", "zamjena robe", "narudžba"]}, "answer": "narudžba", "hint": "'Narudžba' je čin naručivanja (ordering), a ne pravo pri prigovoru — povrat novca, reklamacija i zamjena robe su prava kupca"},
            {"id": 44, "type": "find_error_word", "instruction": "Pronađite pojam koji ne označava sniženu cijenu ili posebnu ponudu", "content": {"words": ["popust", "rasprodaja", "sniženje", "cijena"]}, "answer": "cijena", "hint": "'Cijena' je neutralni pojam (price) — popust, rasprodaja i sniženje označavaju smanjene cijene ili posebne akcije"},
            {"id": 45, "type": "find_error_word", "instruction": "Pronađite pojam koji nije mjesto za plaćanje u radnji", "content": {"words": ["blagajna", "kasa", "šalter", "garderoba"]}, "answer": "garderoba", "hint": "'Garderoba' je prostor za ostavljanje odjeće i stvari — blagajna, kasa i šalter su mjesta na kojima plaćamo"},
            {"id": 46, "type": "find_error_word", "instruction": "Pronađite glagolsku formu koja nije u prezentu prvog lica jednine", "content": {"words": ["kupujem", "prodajem", "probam", "platiti"]}, "answer": "platiti", "hint": "'Platiti' je infinitiv, a ne prezentska forma — ispravno u prvom licu: kupujem, prodajem, probam, plaćam"},
            {"id": 47, "type": "find_error_word", "instruction": "Pronađite pojam koji ne označava osobu koja kupuje", "content": {"words": ["kupac", "mušterija", "klijent", "prodavač"]}, "answer": "prodavač", "hint": "'Prodavač' je osoba koja prodaje, a ne kupuje — kupac, mušterija i klijent su različiti nazivi za osobu koja kupuje"},
            {"id": 48, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Koliko košta ova haljina?", "Ima li popusta?", "Mogu li probam ovo?", "Imate li veću veličinu?"]}, "answer": "Mogu li probam ovo?", "hint": "Ispravno je 'Mogu li probati ovo?' — infinitiv, ne prezent"},
            {"id": 49, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Kupujem odjeću u centru.", "Plaćam karticom.", "Tražim veličinu četrdeset i dva.", "Ova jakna je preskupo."]}, "answer": "Ova jakna je preskupo.", "hint": "Jakna je ženskog roda — ispravno je 'Ova jakna je preskupa'"},
            {"id": 50, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Ovaj model mi se sviđa.", "Boja je lijepa.", "Mogu li vratiti robu?", "Imate li nešto jeftiniji?"]}, "answer": "Imate li nešto jeftiniji?", "hint": "Ispravno je 'Imate li nešto jeftinije?' — srednji rod pridjeva"},
            {"id": 51, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Tražim bijelu košulju.", "On traži crne cipele.", "Ona traži crvenu suknju.", "Mi tražimo plavi torbice."]}, "answer": "Mi tražimo plavi torbice.", "hint": "Torbice je množina ženskog roda — ispravno je 'Mi tražimo plave torbice'"},
            {"id": 52, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Ova haljina mi odgovara.", "Ove cipele su mi male.", "Ovaj kaput su velik.", "Ova bluza je lijepa."]}, "answer": "Ovaj kaput su velik.", "hint": "Kaput je jednina — ispravno je 'Ovaj kaput je velik'"},
            {"id": 53, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Gdje se nalazi garderoba?", "Mogu li se presvući?", "Probala sam tri haljine.", "On je probio novu jaknu."]}, "answer": "On je probio novu jaknu.", "hint": "Ispravno je 'On je probao novu jaknu' — glagol 'probati' (ne 'probiti')"},
            {"id": 54, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Kupila sam novu odjeću.", "Potrošila sam puno novca.", "Dobila sam popust od deset posto.", "Imaju li novi kolekcija?"]}, "answer": "Imaju li novi kolekcija?", "hint": "Kolekcija je ženskog roda — ispravno je 'Imaju li novu kolekciju?'"},
            {"id": 55, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Vraćam ove cipele.", "Nisu mi odgovarale.", "Tražim povrat novca.", "Prodavač su bio ljubazan."]}, "answer": "Prodavač su bio ljubazan.", "hint": "Prodavač je jednina — ispravno je 'Prodavač je bio ljubazan'"},
            {"id": 56, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Radnja radi do osam sati.", "Rasprodaja traje cijeli tjedan.", "Kupujem na rate.", "Ova roba su jeftina."]}, "answer": "Ova roba su jeftina.", "hint": "Roba je jednina ženskog roda — ispravno je 'Ova roba je jeftina'"},
            {"id": 57, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Treba mi novi par cipela.", "Cipele su mi premalene.", "Probat ću veći broj.", "Platit ću gotovinom."]}, "answer": "Cipele su mi premalene.", "hint": "Ispravno je 'Cipele su mi premale' — 'premalene' nije standardna forma"}
        ],
        "quiz": [
            {"id": 1, "question": "Kako se kaže 'price' na bosanskom?", "options": ["popust", "cijena", "kusur", "gotovina"], "correct_answer": 1, "explanation": "'Cijena' znači 'price'.", "question_type": "vocabulary"},
            {"id": 2, "question": "Koji je komparativ od 'skup'?", "options": ["skupa", "skuplja", "skupiji", "najskuplji"], "correct_answer": 1, "explanation": "'Skuplja' je komparativ od 'skup'.", "question_type": "grammar"},
            {"id": 3, "question": "Šta znači 'kusur'?", "options": ["Price", "Discount", "Change", "Card"], "correct_answer": 2, "explanation": "'Kusur' je novac koji dobijete nazad.", "question_type": "vocabulary"},
            {"id": 4, "question": "Kako pitamo za veličinu?", "options": ["Koliko košta?", "Koja veličina?", "Gdje je?", "Šta je ovo?"], "correct_answer": 1, "explanation": "'Koja veličina?' znači 'What size?'", "question_type": "usage"},
            {"id": 5, "question": "Koji je superlativ od 'dobar'?", "options": ["bolji", "najbolji", "najbolji", "dobri"], "correct_answer": 2, "explanation": "'Najbolji' je superlativ od 'dobar'.", "question_type": "grammar"},
            {"id": 6, "question": "Šta znači 'Tražim...'?", "options": ["I'm buying...", "I'm looking for...", "I'm paying...", "I'm trying..."], "correct_answer": 1, "explanation": "'Tražim' znači 'I'm looking for'.", "question_type": "vocabulary"},
            {"id": 7, "question": "Kako kažemo 'fitting room'?", "options": ["prodavnica", "blagajna", "kabina", "kartica"], "correct_answer": 2, "explanation": "'Kabina' je prostor za probavanje odjeće.", "question_type": "vocabulary"},
            {"id": 8, "question": "Koji je komparativ od 'mali'?", "options": ["manji", "maliji", "najmanji", "malo"], "correct_answer": 0, "explanation": "'Manji' je komparativ od 'mali'.", "question_type": "grammar"},
            {"id": 9, "question": "Šta znači 'popust'?", "options": ["Price", "Discount", "Cash", "Card"], "correct_answer": 1, "explanation": "'Popust' znači sniženje cijene.", "question_type": "vocabulary"},
            {"id": 10, "question": "Kako kažemo 'I'll take this'?", "options": ["Dam ovo", "Uzeću ovo", "Imam ovo", "Vidim ovo"], "correct_answer": 1, "explanation": "'Uzeću ovo' znači da ćete kupiti.", "question_type": "usage"},
            {"id": 11, "question": "Koja riječ znači 'cash'?", "options": ["kartica", "gotovina", "kusur", "cijena"], "correct_answer": 1, "explanation": "'Gotovina' je novac u fizičkom obliku.", "question_type": "vocabulary"},
            {"id": 12, "question": "Napiši na bosanskom: 'How much does it cost?'", "question_type": "writing", "correct_answer_text": "Koliko košta", "explanation": "'Koliko košta?' je osnovno pitanje za cijenu."},
            {"id": 13, "question": "Napiši komparativ od 'jeftin':", "question_type": "writing", "correct_answer_text": "jeftiniji", "explanation": "'Jeftiniji' znači 'cheaper'."},
            {"id": 14, "question": "Napiši na bosanskom: 'Do you have a discount?'", "question_type": "writing", "correct_answer_text": "Imate li popust", "explanation": "'Popust' = discount."}
        ]
    },
    {
        "id": 3,
        "title": "Opis ljudi i karaktera",
        "description": "Naučite kako opisati fizički izgled i osobine ljudi",
        "level": "a2",
        "module": 2,
        "objectives": [
            "Opisati fizički izgled osobe",
            "Opisati karakterne osobine",
            "Koristiti pridjeve za opis",
            "Porediti osobine različitih ljudi"
        ],
        "vocabulary": [
            {"bosnian": "visok", "english": "tall", "pronunciation": "VEE-sok", "example": "On je vrlo visok.", "example_translation": "He is very tall.", "image_emoji": "📏"},
            {"bosnian": "nizak", "english": "short", "pronunciation": "NEE-zahk", "example": "Ona je niska.", "example_translation": "She is short.", "image_emoji": "📐"},
            {"bosnian": "mršav", "english": "thin", "pronunciation": "MR-shahv", "example": "Moj brat je mršav.", "example_translation": "My brother is thin.", "image_emoji": "🧍"},
            {"bosnian": "debeo", "english": "fat/overweight", "pronunciation": "DEH-beh-oh", "example": "Bio sam debeo kao dijete.", "example_translation": "I was overweight as a child.", "image_emoji": "🧸"},
            {"bosnian": "lijep", "english": "handsome/beautiful", "pronunciation": "LEE-yehp", "example": "Ona je vrlo lijepa.", "example_translation": "She is very beautiful.", "image_emoji": "✨"},
            {"bosnian": "pametan", "english": "smart", "pronunciation": "PAH-meh-tahn", "example": "On je vrlo pametan.", "example_translation": "He is very smart.", "image_emoji": "🧠"},
            {"bosnian": "glup", "english": "stupid", "pronunciation": "gloop", "example": "To je bila glupa ideja.", "example_translation": "That was a stupid idea.", "image_emoji": "🤦"},
            {"bosnian": "vrijedan", "english": "hardworking", "pronunciation": "VREE-yeh-dahn", "example": "Moja sestra je vrijedna.", "example_translation": "My sister is hardworking.", "image_emoji": "💪"},
            {"bosnian": "lijen", "english": "lazy", "pronunciation": "LEE-yehn", "example": "On je previše lijen.", "example_translation": "He is too lazy.", "image_emoji": "😴"},
            {"bosnian": "veseo", "english": "cheerful", "pronunciation": "VEH-seh-oh", "example": "Uvijek je vesela.", "example_translation": "She is always cheerful.", "image_emoji": "😊"},
            {"bosnian": "tužan", "english": "sad", "pronunciation": "TOO-zhahn", "example": "Zašto si tužan?", "example_translation": "Why are you sad?", "image_emoji": "😢"},
            {"bosnian": "ljubazan", "english": "kind", "pronunciation": "LYOO-bah-zahn", "example": "On je vrlo ljubazan čovjek.", "example_translation": "He is a very kind person.", "image_emoji": "🤗"}
        ],
        "grammar_explanation": """
## Pridjevi - slaganje sa rodom i brojem

Pridjevi se mijenjaju prema rodu i broju imenice:

| Pridjev | Muški | Ženski | Srednji | Množina (m) |
|---------|-------|--------|---------|-------------|
| visok | visok | visoka | visoko | visoki |
| lijep | lijep | lijepa | lijepo | lijepi |
| pametan | pametan | pametna | pametno | pametni |
| vrijedan | vrijedan | vrijedna | vrijedno | vrijedni |

### Primjeri:
- **Visok** čovjek (tall man)
- **Visoka** žena (tall woman)
- **Visoko** drvo (tall tree)
- **Visoki** ljudi (tall people)

## Intenzifikatori (Intensifiers)

| Bosanski | English | Primjer |
|----------|---------|---------|
| vrlo | very | vrlo pametan |
| jako | very/really | jako lijep |
| previše | too (much) | previše visok |
| malo | a little | malo tužan |
| prilično | quite | prilično dobar |
""",
        "grammar_explanation_en": """
## Adjectives - Agreement with Gender and Number

Adjectives change according to the gender and number of the noun:

| Adjective | Masculine | Feminine | Neuter | Plural (m) |
|-----------|-----------|----------|--------|------------|
| visok | visok | visoka | visoko | visoki |
| lijep | lijep | lijepa | lijepo | lijepi |
| pametan | pametan | pametna | pametno | pametni |
| vrijedan | vrijedan | vrijedna | vrijedno | vrijedni |

### Examples:
- **Visok** čovjek (tall man)
- **Visoka** žena (tall woman)
- **Visoko** drvo (tall tree)
- **Visoki** ljudi (tall people)

## Intensifiers

| Bosnian | English | Example |
|---------|---------|---------|
| vrlo | very | vrlo pametan |
| jako | very/really | jako lijep |
| previše | too (much) | previše visok |
| malo | a little | malo tužan |
| prilično | quite | prilično dobar |
""",
        "cultural_note": "U bosanskoj kulturi, direktan opis fizičkog izgleda može biti osjetljiv. Ljudi češće koriste eufemizme ili pozitivne opise. Karakterne osobine kao što su gostoprimljivost i poštenje visoko se cijene.",
        "cultural_note_en": "In Bosnian culture, direct description of physical appearance can be sensitive. People often use euphemisms or positive descriptions. Character traits like hospitality and honesty are highly valued.",
        "cultural_comic": {
            "title": "Razgovor o prijateljima",
            "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d3/a8/13/bascarsija.jpg?w=1200",
            "panels": [
                {"character": "👩", "name": "Selma", "text": "Kakav je tvoj novi kolega na poslu?", "translation": "What is your new colleague at work like?", "position": "left", "avatar": "https://i.pravatar.cc/100?img=44"},
                {"character": "👨🏻", "name": "Damir", "text": "On je visok i ima smeđu kosu. Vrlo je ljubazan.", "translation": "He is tall and has brown hair. Very kind.", "position": "right", "avatar": "https://i.pravatar.cc/100?img=68"},
                {"character": "👩", "name": "Selma", "text": "Je li pametan? Kako radi?", "translation": "Is he smart? How does he work?", "position": "left", "avatar": "https://i.pravatar.cc/100?img=44"},
                {"character": "👨🏻", "name": "Damir", "text": "Da, jako je pametan i vrijedan. Nikad nije lijen.", "translation": "Yes, he's very smart and hardworking. Never lazy.", "position": "right", "avatar": "https://i.pravatar.cc/100?img=68"},
                {"character": "👩", "name": "Selma", "text": "Odlično! Čini se da je dobar čovjek.", "translation": "Excellent! He seems like a good person.", "position": "left", "avatar": "https://i.pravatar.cc/100?img=44"}
            ]
        },
        "dialogue": [
            {"speaker": "Ana", "text": "Kako izgleda tvoja nova cimerica?", "translation": "What does your new roommate look like?"},
            {"speaker": "Maja", "text": "Ona je visoka i ima dugu plavu kosu.", "translation": "She is tall and has long blonde hair."},
            {"speaker": "Ana", "text": "A kakva je kao osoba?", "translation": "And what is she like as a person?"},
            {"speaker": "Maja", "text": "Vrlo je vesela i ljubazna. Uvijek se smije.", "translation": "She is very cheerful and kind. Always smiling."},
            {"speaker": "Ana", "text": "Super! Je li uredna ili neuredna?", "translation": "Great! Is she tidy or messy?"},
            {"speaker": "Maja", "text": "Prilično je uredna. Bolja je od prošle cimerice!", "translation": "She's quite tidy. Better than my last roommate!"}
        ],
        "exercises": [
            {"id": 1, "type": "fill_blank", "instruction": "Popunite prazninu pravilnim oblikom pridjeva", "content": {"sentence": "On je _____ čovjek. (pametan)", "options": ["pametan", "pametna", "pametno", "pametni"]}, "answer": "pametan", "hint": "Čovjek je muškog roda"},
            {"id": 2, "type": "fill_blank", "instruction": "Popunite prazninu pravilnim oblikom pridjeva", "content": {"sentence": "Ona je vrlo _____ djevojka. (lijep)", "options": ["lijep", "lijepa", "lijepo", "lijepi"]}, "answer": "lijepa", "hint": "Djevojka je ženskog roda"},
            {"id": 3, "type": "fill_blank", "instruction": "Popunite prazninu pravilnim oblikom pridjeva", "content": {"sentence": "To je _____ dijete. (veseo)", "options": ["veseo", "vesela", "veselo", "veseli"]}, "answer": "veselo", "hint": "Dijete je srednjeg roda"},
            {"id": 4, "type": "fill_blank", "instruction": "Popunite prazninu intenzifikatorom", "content": {"sentence": "On je _____ visok za svoj uzrast.", "options": ["vrlo", "previše", "malo", "nikad"]}, "answer": "previše", "hint": "Znači 'too much'"},
            {"id": 5, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Moja sestra je _____ i uvijek uči.", "options": ["lijena", "vrijedna", "tužna", "glupa"]}, "answer": "vrijedna", "hint": "Hardworking = ?"},
            {"id": 6, "type": "fill_blank", "instruction": "Popunite prazninu pravilnim oblikom pridjeva", "content": {"sentence": "Moj brat je _____ i visok. (mršav)", "options": ["mršav", "mršava", "mršavo", "mršavi"]}, "answer": "mršav", "hint": "Brat je muškog roda"},
            {"id": 7, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "On ima _____ kosu i plave oči.", "options": ["crnu", "plavu", "dugu", "kratku"]}, "answer": "crnu", "hint": "Black hair = ?"},
            {"id": 8, "type": "fill_blank", "instruction": "Popunite prazninu pravilnim oblikom pridjeva", "content": {"sentence": "Ona je _____ osoba. (ljubazan)", "options": ["ljubazan", "ljubazna", "ljubazno", "ljubazni"]}, "answer": "ljubazna", "hint": "Osoba je ženskog roda"},
            {"id": 9, "type": "fill_blank", "instruction": "Popunite prazninu suprotnim pridjevom", "content": {"sentence": "Nije lijen, već je vrlo _____.", "options": ["tužan", "vrijedan", "glup", "nizak"]}, "answer": "vrijedan", "hint": "Suprotno od 'lijen'"},
            {"id": 10, "type": "fill_blank", "instruction": "Popunite prazninu", "content": {"sentence": "Ima _____ oči i smeđu kosu.", "options": ["zelene", "plavu", "dugu", "visoku"]}, "answer": "zelene", "hint": "Green eyes = ?"},
            {"id": 11, "type": "matching", "instruction": "Povežite suprotne pridjeve", "content": {"pairs": [["visok", "nizak"], ["pametan", "glup"], ["veseo", "tužan"], ["vrijedan", "lijen"], ["debeo", "mršav"]]},"answer": "correct_pairs", "hint": "Razmislite o suprotnostima"},
            {"id": 12, "type": "matching", "instruction": "Povežite pridjeve sa značenjima", "content": {"pairs": [["ljubazan", "kind"], ["lijep", "beautiful"], ["pametan", "smart"], ["vrijedan", "hardworking"], ["lijen", "lazy"]]},"answer": "correct_pairs", "hint": "Karakterne osobine"},
            {"id": 13, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "She is very beautiful and kind."}, "answer": "Ona je vrlo lijepa i ljubazna.", "hint": "Koristite ženski rod pridjeva"},
            {"id": 14, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "He is tall and thin."}, "answer": "On je visok i mršav.", "hint": "Visok = tall, mršav = thin"},
            {"id": 15, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "My brother is very smart."}, "answer": "Moj brat je vrlo pametan.", "hint": "Pametan = smart"},
            {"id": 16, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "She has long blonde hair."}, "answer": "Ima dugu plavu kosu.", "hint": "Duga plava kosa"},
            {"id": 17, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "He is hardworking and kind."}, "answer": "On je vrijedan i ljubazan.", "hint": "Vrijedan = hardworking"},
            {"id": 18, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["je", "Ona", "i", "vrijedna", "pametna", "."]}, "answer": "Ona je pametna i vrijedna.", "hint": "Počnite s 'Ona'"},
            {"id": 19, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["kosu", "Ima", "dugu", "plavu", "."]}, "answer": "Ima dugu plavu kosu.", "hint": "Opis kose"},
            {"id": 20, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["visok", "On", "je", "mršav", "i", "."]}, "answer": "On je visok i mršav.", "hint": "Opis osobe"},
            {"id": 21, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["ljubazna", "i", "lijepa", "vrlo", "je", "Ona", "."]}, "answer": "Ona je vrlo lijepa i ljubazna.", "hint": "Opis žene"},
            {"id": 22, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["pametan", "vrlo", "brat", "je", "Moj", "."]}, "answer": "Moj brat je vrlo pametan.", "hint": "Opis brata"},
            {"id": 23, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["oči", "plave", "i", "kosu", "crnu", "Ima", "."]}, "answer": "Ima crnu kosu i plave oči.", "hint": "Fizički opis"},
            {"id": 24, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["lijen", "nije", "vrijedan", "On", "već", ",", "."]}, "answer": "On nije lijen, već vrijedan.", "hint": "Suprotnosti"},
            {"id": 25, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["visok", "uzrast", "za", "previše", "je", "On", "svoj", "."]}, "answer": "On je previše visok za svoj uzrast.", "hint": "Opis visine"},
            {"id": 26, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["osoba", "ljubazna", "je", "Ona", "."]}, "answer": "Ona je ljubazna osoba.", "hint": "Karakterna osobina"},
            {"id": 27, "type": "sentence_order", "instruction": "Poredajte riječi u pravilnu rečenicu", "content": {"words": ["oči", "zelene", "Ima", "."]}, "answer": "Ima zelene oči.", "hint": "Boja očiju"},
            {"id": 28, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "tall"}, "answer": "visok", "hint": "Visina"},
            {"id": 29, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "smart"}, "answer": "pametan", "hint": "Inteligentan"},
            {"id": 30, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "beautiful (f.)"}, "answer": "lijepa", "hint": "Ženski rod"},
            {"id": 31, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "lazy"}, "answer": "lijen", "hint": "Ne voli raditi"},
            {"id": 32, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "hardworking"}, "answer": "vrijedan", "hint": "Puno radi"},
            {"id": 33, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "kind"}, "answer": "ljubazan", "hint": "Dobar prema drugima"},
            {"id": 34, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "He is tall and thin"}, "answer": "On je visok i mršav", "hint": "Fizički opis"},
            {"id": 35, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "She has long blonde hair"}, "answer": "Ima dugu plavu kosu", "hint": "Opis kose"},
            {"id": 36, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "very"}, "answer": "vrlo", "hint": "Intenzifikator"},
            {"id": 37, "type": "writing", "instruction": "Napišite na bosanskom", "content": {"text": "too much"}, "answer": "previše", "hint": "Prekomjerno"},
            {"id": 38, "type": "find_error_word", "instruction": "Pronađite pridjev koji ne opisuje fizičku građu tijela", "content": {"words": ["visok", "mršav", "debeo", "sladak"]}, "answer": "sladak", "hint": "'Sladak' opisuje okus ili osobu koja je simpatična ('cute'), a ne fizičku građu — visok, mršav i debeo opisuju tjelesnu konstituciju"},
            {"id": 39, "type": "find_error_word", "instruction": "Pronađite pridjev koji ne opisuje atraktivnost ili ljepotu osobe", "content": {"words": ["lijep", "privlačan", "ružan", "visok"]}, "answer": "visok", "hint": "'Visok' opisuje tjelesnu visinu, a ne atraktivnost — lijep, privlačan i ružan su pridjevi koji ocjenjuju ljepotu osobe"},
            {"id": 40, "type": "find_error_word", "instruction": "Pronađite pridjev koji ne opisuje karakter ili ličnost osobe", "content": {"words": ["ljubazan", "susretljiv", "pažljiv", "dugačak"]}, "answer": "dugačak", "hint": "'Dugačak' opisuje fizičku dužinu, a ne karakter — ljubazan, susretljiv i pažljiv su osobine ličnosti"},
            {"id": 41, "type": "find_error_word", "instruction": "Pronađite pojam koji ne spada u fizička obilježja lica", "content": {"words": ["kosa", "oči", "nos", "karakter"]}, "answer": "karakter", "hint": "'Karakter' je unutarnja osobina ličnosti, a ne fizička crta lica — kosa, oči i nos su vidljivi fizički elementi"},
            {"id": 42, "type": "find_error_word", "instruction": "Pronađite pridjev koji nije prirodna boja kose", "content": {"words": ["plava", "smeđa", "crna", "pahuljasta"]}, "answer": "pahuljasta", "hint": "'Pahuljasta' opisuje teksturu kose (fluffy/voluminous), a ne boju — plava, smeđa i crna su prirodne boje kose"},
            {"id": 43, "type": "find_error_word", "instruction": "Pronađite pojam koji nije standardna bosanska forma za 'personality'", "content": {"words": ["karakter", "ličnost", "temperament", "osobnost"]}, "answer": "osobnost", "hint": "'Osobnost' je hrvatska forma — standardna bosanska forma je 'ličnost'; karakter i temperament su internacionalizmi koji se koriste i u bosanskom"},
            {"id": 44, "type": "find_error_word", "instruction": "Pronađite pridjev koji ima pogrešan nastavak za muški rod", "content": {"words": ["pametan", "mudar", "inteligentan", "inteligenta"]}, "answer": "inteligenta", "hint": "Za muški rod pridjevi završavaju na '-an' — ispravno je 'inteligentan'; 'inteligenta' je pogrešan oblik koji zvuči kao ženski ili talijanski"},
            {"id": 45, "type": "find_error_word", "instruction": "Pronađite osobinu ličnosti koja je suprotna od ostatka grupe", "content": {"words": ["stidljiv", "sramežljiv", "introvertiran", "smion"]}, "answer": "smion", "hint": "'Smion' znači 'hrabar/daring' — suprotno je stidljivosti; stidljiv, sramežljiv i introvertiran su srodne osobine osobe koja se povlači"},
            {"id": 46, "type": "find_error_word", "instruction": "Pronađite pridjev koji ima pogrešan nastavak za muški rod", "content": {"words": ["staromodan", "moderan", "elegantan", "eleganta"]}, "answer": "eleganta", "hint": "Za muški rod pridjevi završavaju na '-an' — ispravno je 'elegantan'; 'eleganta' zvuči kao talijanski ili ženski rod bez nastavka"},
            {"id": 47, "type": "find_error_word", "instruction": "Pronađite pojam koji ne spada u elemente vanjskog izgleda osobe", "content": {"words": ["brada", "brkovi", "frizura", "karakter"]}, "answer": "karakter", "hint": "'Karakter' je unutarnja osobina ličnosti, a ne element vanjskog izgleda — brada, brkovi i frizura su vidljivi elementi izgleda"},
            {"id": 48, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["On je visok i mršav.", "Ona ima smeđu kosu.", "Oni su mladi i lijep.", "Ona je lijepa žena."]}, "answer": "Oni su mladi i lijep.", "hint": "Množina zahtijeva množinu pridjeva — ispravno je 'Oni su mladi i lijepi'"},
            {"id": 49, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Moja sestra je ljubazna.", "Moj brat su vrijedan.", "Moja mama je marljiva.", "Moj tata je strpljiv."]}, "answer": "Moj brat su vrijedan.", "hint": "Brat je jednina — ispravno je 'Moj brat je vrijedan'"},
            {"id": 50, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Ima plave oči.", "Ima kratku kosu.", "Ona ima dugačke nokte.", "On ima brada."]}, "answer": "On ima brada.", "hint": "Brada je imenica ženskog roda — ispravno je 'On ima bradu' (akuzativ)"},
            {"id": 51, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["On izgleda umorno.", "Ona izgleda sretno.", "Oni izgledaju veselo.", "Mi izgledamo lijepoo."]}, "answer": "Mi izgledamo lijepoo.", "hint": "Ispravno je 'lijepo' — jedan 'o' na kraju"},
            {"id": 52, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Opisujem svog prijatelja.", "On je srednje visine.", "Ima tamnu put.", "Njegovo lice su ovalno."]}, "answer": "Njegovo lice su ovalno.", "hint": "Lice je jednina — ispravno je 'Njegovo lice je ovalno'"},
            {"id": 53, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Kakva je ona osoba?", "Ona je veoma simpatična.", "Svi je vole zbog njezina karaktera.", "Ona je poznati u gradu."]}, "answer": "Ona je poznati u gradu.", "hint": "Ženski rod — ispravno je 'Ona je poznata u gradu'"},
            {"id": 54, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Moja prijateljica je visoka.", "Ima dugu plavu kosu.", "Oči su joj zelene.", "Ona su uvijek nasmijana."]}, "answer": "Ona su uvijek nasmijana.", "hint": "Ona je jednina — ispravno je 'Ona je uvijek nasmijana'"},
            {"id": 55, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Ovaj čovjek je prijatan.", "Ona je veoma brižna osoba.", "On se oblači moderno.", "On ima dobre karakter."]}, "answer": "On ima dobre karakter.", "hint": "Karakter je muški rod — ispravno je 'On ima dobar karakter'"},
            {"id": 56, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Ko je ta osoba?", "Opisujem nekoga koga poznajem.", "On je star oko trideset godina.", "Njegova kosa su tamna."]}, "answer": "Njegova kosa su tamna.", "hint": "Kosa je jednina — ispravno je 'Njegova kosa je tamna'"},
            {"id": 57, "type": "find_error_sentence", "instruction": "Koja rečenica sadrži grešku?", "content": {"sentences": ["Ona izgleda kao model.", "On je visok poput košarkaša.", "Oni su lijepa para.", "One su lijep prijatelji."]}, "answer": "One su lijep prijatelji.", "hint": "Množina ženskog roda — ispravno je 'One su lijepe prijateljice'"}
        ],
        "quiz": [
            {"id": 1, "question": "Kako se kaže 'tall' na bosanskom?", "options": ["nizak", "visok", "mršav", "debeo"], "correct_answer": 1, "explanation": "'Visok' opisuje nekoga ko je visokog rasta.", "question_type": "vocabulary"},
            {"id": 2, "question": "Koji je ženski rod od 'pametan'?", "options": ["pametan", "pametna", "pametno", "pametni"], "correct_answer": 1, "explanation": "'Pametna' je ženski rod pridjeva.", "question_type": "grammar"},
            {"id": 3, "question": "Šta znači 'lijen'?", "options": ["Hardworking", "Lazy", "Smart", "Kind"], "correct_answer": 1, "explanation": "'Lijen' znači da neko ne voli raditi.", "question_type": "vocabulary"},
            {"id": 4, "question": "Koji pridjev opisuje sretan karakter?", "options": ["tužan", "lijen", "veseo", "glup"], "correct_answer": 2, "explanation": "'Veseo' znači cheerful/happy.", "question_type": "vocabulary"},
            {"id": 5, "question": "Kako kažemo 'very' na bosanskom?", "options": ["malo", "previše", "vrlo", "nikad"], "correct_answer": 2, "explanation": "'Vrlo' pojačava značenje pridjeva.", "question_type": "vocabulary"},
            {"id": 6, "question": "Koji je srednji rod od 'lijep'?", "options": ["lijep", "lijepa", "lijepo", "lijepi"], "correct_answer": 2, "explanation": "'Lijepo' je srednji rod pridjeva.", "question_type": "grammar"},
            {"id": 7, "question": "Šta znači 'ljubazan'?", "options": ["Angry", "Sad", "Kind", "Lazy"], "correct_answer": 2, "explanation": "'Ljubazan' opisuje dobru i prijateljsku osobu.", "question_type": "vocabulary"},
            {"id": 8, "question": "Koji je suprotan pridjev od 'visok'?", "options": ["mršav", "debeo", "nizak", "lijep"], "correct_answer": 2, "explanation": "'Nizak' je suprotno od 'visok'.", "question_type": "vocabulary"},
            {"id": 9, "question": "Kako kažemo 'too much' na bosanskom?", "options": ["vrlo", "malo", "previše", "jako"], "correct_answer": 2, "explanation": "'Previše' znači 'too much'.", "question_type": "vocabulary"},
            {"id": 10, "question": "Koji pridjev opisuje nekoga ko puno radi?", "options": ["lijen", "vrijedan", "tužan", "glup"], "correct_answer": 1, "explanation": "'Vrijedan' znači hardworking.", "question_type": "vocabulary"},
            {"id": 11, "question": "Napiši na bosanskom: 'He is very tall'", "question_type": "writing", "correct_answer_text": "On je vrlo visok", "explanation": "'Vrlo visok' = very tall."},
            {"id": 12, "question": "Napiši ženski rod od 'vrijedan':", "question_type": "writing", "correct_answer_text": "vrijedna", "explanation": "Ženski rod se tvori dodavanjem -a."},
            {"id": 13, "question": "Napiši na bosanskom: 'She is smart and kind'", "question_type": "writing", "correct_answer_text": "Ona je pametna i ljubazna", "explanation": "Pridjevi su u ženskom rodu jer opisuju 'ona'."}
        ]
    }
]

A2_LESSONS = A2_LESSONS_BASE + A2_LESSONS_PART2 + A2_LESSONS_PART3 + A2_LESSONS_PART4
