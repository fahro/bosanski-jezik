from app.data.a1_lessons_2 import A1_LESSONS_PART2
from app.data.a1_lessons_3 import A1_LESSONS_PART3
from app.data.a1_lessons_4 import A1_LESSONS_PART4

A1_LESSONS_BASE = [
    {
        "id": 1,
        "title": "Pozdravi i Upoznavanje",
        "description": "Naučite osnovne pozdrave i kako se predstaviti na bosanskom jeziku",
        "level": "a1",
        "module": 1,
        "objectives": [
            "Naučiti osnovne pozdrave (Zdravo, Dobar dan, Dobro jutro)",
            "Predstaviti se (Ja sam..., Zovem se...)",
            "Pitati nekoga kako se zove",
            "Reći odakle ste"
        ],
        "vocabulary": [
            {"bosnian": "Zdravo", "english": "Hello", "pronunciation": "ZDRAH-voh", "example": "Zdravo, kako si?", "example_translation": "Hello, how are you?", "image_emoji": "👋"},
            {"bosnian": "Dobar dan", "english": "Good day", "pronunciation": "DOH-bar dahn", "example": "Dobar dan, gospodine.", "example_translation": "Good day, sir.", "image_emoji": "☀️"},
            {"bosnian": "Dobro jutro", "english": "Good morning", "pronunciation": "DOH-broh YOO-troh", "example": "Dobro jutro, kako ste spavali?", "example_translation": "Good morning, how did you sleep?", "image_emoji": "🌅"},
            {"bosnian": "Dobro veče", "english": "Good evening", "pronunciation": "DOH-broh VEH-cheh", "example": "Dobro veče, draga.", "example_translation": "Good evening, dear (female).", "image_emoji": "🌙"},
            {"bosnian": "Laku noć", "english": "Good night", "pronunciation": "LAH-koo nohch", "example": "Laku noć, lijepo sanjaj.", "example_translation": "Good night, sweet dreams.", "image_emoji": "😴"},
            {"bosnian": "Doviđenja", "english": "Goodbye", "pronunciation": "doh-vee-JEH-nyah", "example": "Doviđenja, vidimo se sutra.", "example_translation": "Goodbye, see you tomorrow.", "image_emoji": "👋"},
            {"bosnian": "Hvala", "english": "Thank you", "pronunciation": "HVAH-lah", "example": "Hvala vam puno.", "example_translation": "Thank you very much.", "image_emoji": "🙏"},
            {"bosnian": "Molim", "english": "Please/You're welcome", "pronunciation": "MOH-leem", "example": "Molim vas, sjednite.", "example_translation": "Please, sit down.", "image_emoji": "😊"},
            {"bosnian": "Ja sam", "english": "I am", "pronunciation": "yah sahm", "example": "Ja sam student.", "example_translation": "I am a student.", "image_emoji": "👤"},
            {"bosnian": "Zovem se", "english": "My name is", "pronunciation": "ZOH-vehm seh", "example": "Zovem se Amina.", "example_translation": "My name is Amina.", "image_emoji": "📛"}
        ],
        "grammar_explanation": """
## Lične zamjenice (Personal Pronouns)

U bosanskom jeziku imamo sljedeće lične zamjenice:

| Bosanski | English |
|----------|---------|
| Ja | I |
| Ti | You (informal) |
| On | He |
| Ona | She |
| Ono | It |
| Mi | We |
| Vi | You (formal/plural) |
| Oni/One/Ona | They |

## Glagol "biti" (To be) - Prezent

| Osoba | Glagol |
|-------|--------|
| Ja | sam |
| Ti | si |
| On/Ona/Ono | je |
| Mi | smo |
| Vi | ste |
| Oni/One/Ona | su |

### Primjeri:
- **Ja sam** učenik. (I am a student.)
- **Ti si** dobar. (You are good.)
- **On je** visok. (He is tall.)
- **Mi smo** prijatelji. (We are friends.)
""",
        "cultural_note": "U Bosni i Hercegovini, ljudi se često pozdravljaju sa 'Merhaba' (iz turskog) ili 'Selam' u neformalnim situacijama. 'Vi' forma se koristi za starije osobe i u formalnim situacijama kao znak poštovanja.",
        "dialogue": [
            {"speaker": "Amina", "text": "Zdravo! Ja sam Amina. Kako se ti zoveš?", "translation": "Hello! I am Amina. What is your name?"},
            {"speaker": "Emir", "text": "Zdravo Amina! Zovem se Emir. Drago mi je.", "translation": "Hello Amina! My name is Emir. Nice to meet you."},
            {"speaker": "Amina", "text": "Drago mi je, Emire. Odakle si?", "translation": "Nice to meet you, Emir. Where are you from?"},
            {"speaker": "Emir", "text": "Ja sam iz Sarajeva. A ti?", "translation": "I am from Sarajevo. And you?"},
            {"speaker": "Amina", "text": "Ja sam iz Mostara. Lijepo te upoznati!", "translation": "I am from Mostar. Nice to meet you!"}
        ],
        "exercises": [
            {"id": 1, "type": "fill_blank", "instruction": "Popunite prazninu odgovarajućom riječju", "content": {"sentence": "_____ sam student.", "options": ["Ja", "Ti", "On"]}, "answer": "Ja", "hint": "Koristite prvu osobu jednine"},
            {"id": 2, "type": "matching", "instruction": "Povežite pozdrave sa odgovarajućim dijelom dana", "content": {"pairs": [["Dobro jutro", "Morning"], ["Dobar dan", "Afternoon"], ["Dobro veče", "Evening"]]}, "answer": "correct_pairs", "hint": "Razmislite kada koristite svaki pozdrav"},
            {"id": 3, "type": "translate", "instruction": "Prevedite na bosanski", "content": {"text": "My name is..."}, "answer": "Zovem se...", "hint": "Doslovno: 'Zovem se'"}
        ],
        "quiz": [
            {"id": 1, "question": "Kako se kaže 'Hello' na bosanskom?", "options": ["Doviđenja", "Zdravo", "Hvala", "Molim"], "correct_answer": 1, "explanation": "'Zdravo' je neformalni pozdrav koji se koristi kad nekoga sretnete.", "question_type": "vocabulary"},
            {"id": 2, "question": "Koja je pravilna forma glagola 'biti' za 'ja'?", "options": ["si", "je", "sam", "smo"], "correct_answer": 2, "explanation": "'Ja sam' - 'sam' je prva osoba jednine glagola 'biti'.", "question_type": "grammar"},
            {"id": 3, "question": "Kako se predstavljate na bosanskom?", "options": ["Hvala vam", "Zovem se...", "Dobar dan", "Doviđenja"], "correct_answer": 1, "explanation": "'Zovem se' doslovno znači 'I call myself' i koristi se za predstavljanje.", "question_type": "usage"},
            {"id": 4, "question": "Šta znači 'Doviđenja'?", "options": ["Good morning", "Thank you", "Goodbye", "Please"], "correct_answer": 2, "explanation": "'Doviđenja' dolazi od 'do viđenja' - until we see each other again.", "question_type": "vocabulary"},
            {"id": 5, "question": "Koja zamjenica se koristi za formalnu formu 'you'?", "options": ["Ti", "On", "Vi", "Mi"], "correct_answer": 2, "explanation": "'Vi' se koristi za formalno obraćanje i za množinu.", "question_type": "grammar"}
        ]
    },
    {
        "id": 2,
        "title": "Brojevi od 1 do 20",
        "description": "Naučite brojati na bosanskom jeziku od jedan do dvadeset",
        "level": "a1",
        "module": 1,
        "objectives": [
            "Brojati od 1 do 20",
            "Koristiti brojeve u svakodnevnim situacijama",
            "Pitati i reći koliko nečega ima",
            "Razumjeti cijene i količine"
        ],
        "vocabulary": [
            {"bosnian": "jedan", "english": "one", "pronunciation": "YEH-dahn", "example": "Imam jedan auto.", "example_translation": "I have one car.", "image_emoji": "1️⃣"},
            {"bosnian": "dva", "english": "two", "pronunciation": "dvah", "example": "Dva kafе, molim.", "example_translation": "Two coffees, please.", "image_emoji": "2️⃣"},
            {"bosnian": "tri", "english": "three", "pronunciation": "tree", "example": "Tri jabuke.", "example_translation": "Three apples.", "image_emoji": "3️⃣"},
            {"bosnian": "četiri", "english": "four", "pronunciation": "CHEH-tee-ree", "example": "Četiri osobe.", "example_translation": "Four people.", "image_emoji": "4️⃣"},
            {"bosnian": "pet", "english": "five", "pronunciation": "peht", "example": "Pet minuta.", "example_translation": "Five minutes.", "image_emoji": "5️⃣"},
            {"bosnian": "šest", "english": "six", "pronunciation": "shehst", "example": "Šest dana.", "example_translation": "Six days.", "image_emoji": "6️⃣"},
            {"bosnian": "sedam", "english": "seven", "pronunciation": "SEH-dahm", "example": "Sedam sati.", "example_translation": "Seven hours.", "image_emoji": "7️⃣"},
            {"bosnian": "osam", "english": "eight", "pronunciation": "OH-sahm", "example": "Osam knjiga.", "example_translation": "Eight books.", "image_emoji": "8️⃣"},
            {"bosnian": "devet", "english": "nine", "pronunciation": "DEH-veht", "example": "Devet eura.", "example_translation": "Nine euros.", "image_emoji": "9️⃣"},
            {"bosnian": "deset", "english": "ten", "pronunciation": "DEH-seht", "example": "Deset godina.", "example_translation": "Ten years.", "image_emoji": "🔟"}
        ],
        "grammar_explanation": """
## Brojevi 1-20

| Broj | Bosanski | Izgovor |
|------|----------|---------|
| 1 | jedan | YEH-dahn |
| 2 | dva | dvah |
| 3 | tri | tree |
| 4 | četiri | CHEH-tee-ree |
| 5 | pet | peht |
| 6 | šest | shehst |
| 7 | sedam | SEH-dahm |
| 8 | osam | OH-sahm |
| 9 | devet | DEH-veht |
| 10 | deset | DEH-seht |
| 11 | jedanaest | yeh-DAH-nah-ehst |
| 12 | dvanaest | dvah-NAH-ehst |
| 13 | trinaest | tree-NAH-ehst |
| 14 | četrnaest | cheh-tr-NAH-ehst |
| 15 | petnaest | peht-NAH-ehst |
| 16 | šesnaest | shehst-NAH-ehst |
| 17 | sedamnaest | seh-dahm-NAH-ehst |
| 18 | osamnaest | oh-sahm-NAH-ehst |
| 19 | devetnaest | deh-veht-NAH-ehst |
| 20 | dvadeset | DVAH-deh-seht |

## Rod brojeva
- **jedan/jedna/jedno** - muški/ženski/srednji rod
- Primjer: jedan stol (m), jedna žena (f), jedno dijete (n)
""",
        "cultural_note": "U Bosni i Hercegovini koristi se konvertibilna marka (KM) kao valuta. Kada kupujete na pijaci, često ćete čuti cijene u markama. Pregovaranje o cijeni je uobičajeno na tradicionalnim pijacama.",
        "dialogue": [
            {"speaker": "Prodavač", "text": "Dobar dan! Izvolite?", "translation": "Good day! Can I help you?"},
            {"speaker": "Kupac", "text": "Koliko košta kilogram jabuka?", "translation": "How much is a kilogram of apples?"},
            {"speaker": "Prodavač", "text": "Tri marke.", "translation": "Three marks."},
            {"speaker": "Kupac", "text": "Dajte mi dva kilograma, molim.", "translation": "Give me two kilograms, please."},
            {"speaker": "Prodavač", "text": "To je šest maraka. Hvala!", "translation": "That is six marks. Thank you!"}
        ],
        "exercises": [
            {"id": 1, "type": "fill_blank", "instruction": "Napišite broj riječima", "content": {"sentence": "5 + 3 = _____"}, "answer": "osam", "hint": "Pet plus tri jednako..."},
            {"id": 2, "type": "order", "instruction": "Poredajte brojeve od najmanjeg do najvećeg", "content": {"items": ["pet", "dva", "osam", "jedan"]}, "answer": "jedan, dva, pet, osam", "hint": "Počnite sa najmanijm"},
            {"id": 3, "type": "translate", "instruction": "Prevedite: 'I have seven books'", "content": {"text": "I have seven books"}, "answer": "Imam sedam knjiga", "hint": "Imam = I have"}
        ],
        "quiz": [
            {"id": 1, "question": "Kako se kaže broj 7 na bosanskom?", "options": ["šest", "sedam", "osam", "devet"], "correct_answer": 1, "explanation": "'Sedam' je broj 7 na bosanskom jeziku.", "question_type": "vocabulary"},
            {"id": 2, "question": "Koliko je 'trinaest'?", "options": ["12", "13", "14", "15"], "correct_answer": 1, "explanation": "'Trinaest' = tri + naest = 13", "question_type": "numbers"},
            {"id": 3, "question": "Koji broj dolazi poslije 'devetnaest'?", "options": ["osamnaest", "dvadeset", "deset", "jedanaest"], "correct_answer": 1, "explanation": "Poslije 19 (devetnaest) dolazi 20 (dvadeset).", "question_type": "sequence"},
            {"id": 4, "question": "Kako se kaže '15' na bosanskom?", "options": ["četrnaest", "petnaest", "šesnaest", "trinaest"], "correct_answer": 1, "explanation": "'Petnaest' = pet + naest = 15", "question_type": "vocabulary"},
            {"id": 5, "question": "Šta je 'dva' na engleskom?", "options": ["one", "two", "three", "four"], "correct_answer": 1, "explanation": "'Dva' znači 'two' na engleskom.", "question_type": "translation"}
        ]
    },
    {
        "id": 3,
        "title": "Boje",
        "description": "Naučite nazive boja i kako ih koristiti u rečenicama",
        "level": "a1",
        "module": 1,
        "objectives": [
            "Naučiti osnovne boje na bosanskom",
            "Opisati predmete koristeći boje",
            "Razumjeti rod i slaganje pridjeva",
            "Pitati koja je boja nečega"
        ],
        "vocabulary": [
            {"bosnian": "crvena", "english": "red", "pronunciation": "tsr-VEH-nah", "example": "Crvena jabuka.", "example_translation": "A red apple.", "image_emoji": "🔴"},
            {"bosnian": "plava", "english": "blue", "pronunciation": "PLAH-vah", "example": "Plavo nebo.", "example_translation": "Blue sky.", "image_emoji": "🔵"},
            {"bosnian": "zelena", "english": "green", "pronunciation": "zeh-LEH-nah", "example": "Zelena trava.", "example_translation": "Green grass.", "image_emoji": "🟢"},
            {"bosnian": "žuta", "english": "yellow", "pronunciation": "ZHOO-tah", "example": "Žuto sunce.", "example_translation": "Yellow sun.", "image_emoji": "🟡"},
            {"bosnian": "crna", "english": "black", "pronunciation": "TSR-nah", "example": "Crna mačka.", "example_translation": "A black cat.", "image_emoji": "⚫"},
            {"bosnian": "bijela", "english": "white", "pronunciation": "bee-YEH-lah", "example": "Bijeli snijeg.", "example_translation": "White snow.", "image_emoji": "⚪"},
            {"bosnian": "narandžasta", "english": "orange", "pronunciation": "nah-rahn-JAH-stah", "example": "Narandžasta narandža.", "example_translation": "An orange orange.", "image_emoji": "🟠"},
            {"bosnian": "ljubičasta", "english": "purple", "pronunciation": "lyoo-bee-CHAH-stah", "example": "Ljubičasti cvijet.", "example_translation": "A purple flower.", "image_emoji": "🟣"},
            {"bosnian": "smeđa", "english": "brown", "pronunciation": "SMEH-jah", "example": "Smeđi medvjed.", "example_translation": "A brown bear.", "image_emoji": "🟤"},
            {"bosnian": "siva", "english": "gray", "pronunciation": "SEE-vah", "example": "Sivi oblak.", "example_translation": "A gray cloud.", "image_emoji": "🩶"}
        ],
        "grammar_explanation": """
## Pridjevi za boje - Rod (Gender Agreement)

Pridjevi za boje se mijenjaju prema rodu imenice:

| Boja | Muški rod | Ženski rod | Srednji rod |
|------|-----------|------------|-------------|
| red | crven | crvena | crveno |
| blue | plav | plava | plavo |
| green | zelen | zelena | zeleno |
| yellow | žut | žuta | žuto |
| black | crn | crna | crno |
| white | bijel | bijela | bijelo |

### Primjeri:
- **crven** auto (m) - a red car
- **crvena** haljina (f) - a red dress
- **crveno** vino (n) - red wine

## Pitanje o boji
- **Koje boje je...?** - What color is...?
- Koje boje je tvoja kuća? - What color is your house?
""",
        "cultural_note": "Bosna i Hercegovina ima zastavu sa plavom bojom i žutim trokutom sa bijelim zvijezdama. Plava i žuta su nacionalne boje. Tradicionalna bosanska ćilimska umjetnost koristi živopisne crvene, plave i zelene boje.",
        "dialogue": [
            {"speaker": "Ana", "text": "Volim tvoju novu haljinu! Koje je boje?", "translation": "I love your new dress! What color is it?"},
            {"speaker": "Maja", "text": "Hvala! Ona je plava, moja omiljena boja.", "translation": "Thanks! It's blue, my favorite color."},
            {"speaker": "Ana", "text": "Plava ti odlično stoji. Ja više volim crvenu.", "translation": "Blue suits you well. I prefer red."},
            {"speaker": "Maja", "text": "Da, ti uvijek nosiš crveno. Sviđa mi se!", "translation": "Yes, you always wear red. I like it!"}
        ],
        "exercises": [
            {"id": 1, "type": "matching", "instruction": "Povežite boje sa predmetima", "content": {"pairs": [["zelena", "trava"], ["plavo", "nebo"], ["žuto", "sunce"]]}, "answer": "correct_pairs", "hint": "Razmislite o prirodnim bojama"},
            {"id": 2, "type": "fill_blank", "instruction": "Popunite pravilnim oblikom", "content": {"sentence": "_____ auto (crven, m.r.)"}, "answer": "crven", "hint": "Auto je muškog roda"},
            {"id": 3, "type": "translate", "instruction": "Prevedite: 'The white house'", "content": {"text": "The white house"}, "answer": "Bijela kuća", "hint": "Kuća je ženskog roda"}
        ],
        "quiz": [
            {"id": 1, "question": "Kako se kaže 'green' na bosanskom?", "options": ["plava", "crvena", "zelena", "žuta"], "correct_answer": 2, "explanation": "'Zelena' znači 'green'. Zelena trava, zeleno drvo.", "question_type": "vocabulary"},
            {"id": 2, "question": "Koja je pravilna forma: '_____ sunce' (žut)?", "options": ["žut", "žuta", "žuto", "žuti"], "correct_answer": 2, "explanation": "'Sunce' je srednjeg roda, pa koristimo 'žuto'.", "question_type": "grammar"},
            {"id": 3, "question": "Šta znači 'bijela'?", "options": ["black", "white", "gray", "brown"], "correct_answer": 1, "explanation": "'Bijela' znači 'white'. Bijeli snijeg, bijela kuća.", "question_type": "vocabulary"},
            {"id": 4, "question": "Koje boje je nebo?", "options": ["crveno", "zeleno", "plavo", "žuto"], "correct_answer": 2, "explanation": "Nebo je plavo. 'Plavo nebo' - blue sky.", "question_type": "context"},
            {"id": 5, "question": "Koja boja se koristi za 'brown bear' na bosanskom?", "options": ["crni medvjed", "bijeli medvjed", "smeđi medvjed", "sivi medvjed"], "correct_answer": 2, "explanation": "'Smeđi medvjed' znači 'brown bear'.", "question_type": "vocabulary"}
        ]
    }
]

A1_LESSONS = A1_LESSONS_BASE + A1_LESSONS_PART2 + A1_LESSONS_PART3 + A1_LESSONS_PART4
