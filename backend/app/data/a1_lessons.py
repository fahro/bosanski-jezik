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
            {"bosnian": "Zovem se", "english": "My name is", "pronunciation": "ZOH-vehm seh", "example": "Zovem se Amina.", "example_translation": "My name is Amina.", "image_emoji": "📛"},
            {"bosnian": "Drago mi je", "english": "Nice to meet you", "pronunciation": "DRAH-goh mee yeh", "example": "Drago mi je što sam te upoznao.", "example_translation": "Nice to meet you.", "image_emoji": "🤝"},
            {"bosnian": "Kako si?", "english": "How are you?", "pronunciation": "KAH-koh see", "example": "Zdravo! Kako si danas?", "example_translation": "Hello! How are you today?", "image_emoji": "💬"}
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
        "grammar_explanation_en": """
## Personal Pronouns

In Bosnian, we have the following personal pronouns:

| Bosnian | English |
|---------|---------|
| Ja | I |
| Ti | You (informal) |
| On | He |
| Ona | She |
| Ono | It |
| Mi | We |
| Vi | You (formal/plural) |
| Oni/One/Ona | They |

## Verb "biti" (To be) - Present Tense

| Person | Verb |
|--------|------|
| Ja (I) | sam |
| Ti (You) | si |
| On/Ona/Ono (He/She/It) | je |
| Mi (We) | smo |
| Vi (You) | ste |
| Oni/One/Ona (They) | su |

### Examples:
- **Ja sam** učenik. (I am a student.)
- **Ti si** dobar. (You are good.)
- **On je** visok. (He is tall.)
- **Mi smo** prijatelji. (We are friends.)
""",
        "cultural_note": "U Bosni i Hercegovini, ljudi se često pozdravljaju sa 'Merhaba' (iz turskog) ili 'Selam' u neformalnim situacijama. 'Vi' forma se koristi za starije osobe i u formalnim situacijama kao znak poštovanja.",
        "cultural_note_en": "In Bosnia and Herzegovina, people often greet each other with 'Merhaba' (from Turkish) or 'Selam' in informal situations. The 'Vi' form is used for older people and in formal situations as a sign of respect.",
        "cultural_comic": {
            "title": "Kod Sebilj fontane u Baščaršiji",
            "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d3/a8/13/bascarsija.jpg?w=1200",
            "panels": [
                {"character": "🧔🏻", "name": "Ahmed", "text": "Selam, brate! Ja sam Ahmed.", "translation": "Hi brother! I am Ahmed.", "position": "left", "avatar": "https://i.pravatar.cc/100?img=33"},
                {"character": "👨🏻", "name": "Emir", "text": "Selam! Ja sam Emir. Drago mi je!", "translation": "Hi! I am Emir. Nice to meet you!", "position": "right", "avatar": "https://i.pravatar.cc/100?img=12"},
                {"character": "🧔🏻", "name": "Ahmed", "text": "Odakle si ti?", "translation": "Where are you from?", "position": "left", "avatar": "https://i.pravatar.cc/100?img=33"},
                {"character": "👨🏻", "name": "Emir", "text": "Ja sam iz Mostara. A ti si iz Sarajeva?", "translation": "I am from Mostar. And you are from Sarajevo?", "position": "right", "avatar": "https://i.pravatar.cc/100?img=12"},
                {"character": "🧔🏻", "name": "Ahmed", "text": "Da, ja sam Sarajlija. Mi smo sada prijatelji!", "translation": "Yes, I am from Sarajevo. We are now friends!", "position": "left", "avatar": "https://i.pravatar.cc/100?img=33"}
            ]
        },
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
            {"id": 5, "question": "Koja zamjenica se koristi za formalnu formu 'you'?", "options": ["Ti", "On", "Vi", "Mi"], "correct_answer": 2, "explanation": "'Vi' se koristi za formalno obraćanje i za množinu.", "question_type": "grammar"},
            {"id": 6, "question": "Kako se kaže 'Good morning'?", "options": ["Dobro veče", "Dobar dan", "Dobro jutro", "Laku noć"], "correct_answer": 2, "explanation": "'Dobro jutro' se koristi ujutro kao pozdrav.", "question_type": "vocabulary"},
            {"id": 7, "question": "Šta znači 'Hvala'?", "options": ["Hello", "Please", "Thank you", "Sorry"], "correct_answer": 2, "explanation": "'Hvala' znači 'Thank you' - izraz zahvalnosti.", "question_type": "vocabulary"},
            {"id": 8, "question": "Koja je pravilna forma: 'Ti ___ student'?", "options": ["sam", "si", "je", "smo"], "correct_answer": 1, "explanation": "'Ti si' - 'si' je druga osoba jednine glagola 'biti'.", "question_type": "grammar"},
            {"id": 9, "question": "Kako pitamo nekoga odakle je?", "options": ["Kako se zoveš?", "Odakle si?", "Koliko imaš godina?", "Šta radiš?"], "correct_answer": 1, "explanation": "'Odakle si?' znači 'Where are you from?'", "question_type": "usage"},
            {"id": 10, "question": "Šta znači 'Drago mi je'?", "options": ["I'm sorry", "Nice to meet you", "I'm tired", "I'm hungry"], "correct_answer": 1, "explanation": "'Drago mi je' znači 'Drago mi je što smo se upoznali' - koristi se kad upoznajete nekoga.", "question_type": "vocabulary"},
            {"id": 11, "question": "Koja je pravilna forma: 'On ___ visok'?", "options": ["sam", "si", "je", "su"], "correct_answer": 2, "explanation": "'On je' - 'je' je treća osoba jednine glagola 'biti'.", "question_type": "grammar"},
            {"id": 12, "question": "Kako se kaže 'Good night'?", "options": ["Dobro jutro", "Dobar dan", "Dobro veče", "Laku noć"], "correct_answer": 3, "explanation": "'Laku noć' se koristi kad idete spavati.", "question_type": "vocabulary"},
            {"id": 13, "question": "Šta znači 'Molim'?", "options": ["Thank you", "Please / You're welcome", "Hello", "Goodbye"], "correct_answer": 1, "explanation": "'Molim' može značiti 'Please' ili 'You're welcome'.", "question_type": "vocabulary"},
            {"id": 14, "question": "Koja je pravilna forma: 'Mi ___ prijatelji'?", "options": ["sam", "ste", "smo", "su"], "correct_answer": 2, "explanation": "'Mi smo' - 'smo' je prva osoba množine glagola 'biti'.", "question_type": "grammar"},
            {"id": 15, "question": "Kako kažemo 'I am from Sarajevo'?", "options": ["Idem u Sarajevo", "Ja sam iz Sarajeva", "Volim Sarajevo", "Živim u Sarajevu"], "correct_answer": 1, "explanation": "'Ja sam iz Sarajeva' - koristimo 'iz' + genitiv za porijeklo.", "question_type": "usage"},
            {"id": 16, "question": "Napiši na bosanskom: 'Hello'", "question_type": "writing", "correct_answer_text": "Zdravo", "explanation": "'Zdravo' je neformalni pozdrav na bosanskom."},
            {"id": 17, "question": "Napiši na bosanskom: 'Thank you'", "question_type": "writing", "correct_answer_text": "Hvala", "explanation": "'Hvala' je izraz zahvalnosti."},
            {"id": 18, "question": "Napiši na bosanskom: 'Good morning'", "question_type": "writing", "correct_answer_text": "Dobro jutro", "explanation": "'Dobro jutro' se koristi kao jutarnji pozdrav."}
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
            {"bosnian": "dva", "english": "two", "pronunciation": "dvah", "example": "Dvije kafe, molim.", "example_translation": "Two coffees, please.", "image_emoji": "2️⃣"},
            {"bosnian": "tri", "english": "three", "pronunciation": "tree", "example": "Tri jabuke.", "example_translation": "Three apples.", "image_emoji": "3️⃣"},
            {"bosnian": "četiri", "english": "four", "pronunciation": "CHEH-tee-ree", "example": "Četiri osobe.", "example_translation": "Four people.", "image_emoji": "4️⃣"},
            {"bosnian": "pet", "english": "five", "pronunciation": "peht", "example": "Pet minuta.", "example_translation": "Five minutes.", "image_emoji": "5️⃣"},
            {"bosnian": "šest", "english": "six", "pronunciation": "shehst", "example": "Šest dana.", "example_translation": "Six days.", "image_emoji": "6️⃣"},
            {"bosnian": "sedam", "english": "seven", "pronunciation": "SEH-dahm", "example": "Sedam sati.", "example_translation": "Seven hours.", "image_emoji": "7️⃣"},
            {"bosnian": "osam", "english": "eight", "pronunciation": "OH-sahm", "example": "Osam knjiga.", "example_translation": "Eight books.", "image_emoji": "8️⃣"},
            {"bosnian": "devet", "english": "nine", "pronunciation": "DEH-veht", "example": "Devet eura.", "example_translation": "Nine euros.", "image_emoji": "9️⃣"},
            {"bosnian": "deset", "english": "ten", "pronunciation": "DEH-seht", "example": "Deset godina.", "example_translation": "Ten years.", "image_emoji": "🔟"},
            {"bosnian": "jedanaest", "english": "eleven", "pronunciation": "yeh-DAH-nah-ehst", "example": "Jedanaest učenika.", "example_translation": "Eleven students.", "image_emoji": "1️⃣1️⃣"},
            {"bosnian": "dvanaest", "english": "twelve", "pronunciation": "DVAH-nah-ehst", "example": "Dvanaest mjeseci.", "example_translation": "Twelve months.", "image_emoji": "1️⃣2️⃣"},
            {"bosnian": "trinaest", "english": "thirteen", "pronunciation": "TREE-nah-ehst", "example": "Trinaest ljudi.", "example_translation": "Thirteen people.", "image_emoji": "1️⃣3️⃣"},
            {"bosnian": "četrnaest", "english": "fourteen", "pronunciation": "cheh-TR-nah-ehst", "example": "Četrnaest dana.", "example_translation": "Fourteen days.", "image_emoji": "1️⃣4️⃣"},
            {"bosnian": "petnaest", "english": "fifteen", "pronunciation": "PEHT-nah-ehst", "example": "Petnaest minuta.", "example_translation": "Fifteen minutes.", "image_emoji": "1️⃣5️⃣"},
            {"bosnian": "šesnaest", "english": "sixteen", "pronunciation": "SHEHST-nah-ehst", "example": "Šesnaest godina.", "example_translation": "Sixteen years.", "image_emoji": "1️⃣6️⃣"},
            {"bosnian": "sedamnaest", "english": "seventeen", "pronunciation": "SEH-dahm-nah-ehst", "example": "Sedamnaest knjiga.", "example_translation": "Seventeen books.", "image_emoji": "1️⃣7️⃣"},
            {"bosnian": "osamnaest", "english": "eighteen", "pronunciation": "OH-sahm-nah-ehst", "example": "Osamnaest eura.", "example_translation": "Eighteen euros.", "image_emoji": "1️⃣8️⃣"},
            {"bosnian": "devetnaest", "english": "nineteen", "pronunciation": "DEH-veht-nah-ehst", "example": "Devetnaest sati.", "example_translation": "Nineteen hours.", "image_emoji": "1️⃣9️⃣"},
            {"bosnian": "dvadeset", "english": "twenty", "pronunciation": "DVAH-deh-seht", "example": "Dvadeset maraka.", "example_translation": "Twenty marks.", "image_emoji": "2️⃣0️⃣"}
        ],
        "grammar_explanation": """
## Osnovni brojevi 1-20

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
| 12 | dvanaest | DVAH-nah-ehst |
| 13 | trinaest | TREE-nah-ehst |
| 14 | četrnaest | cheh-TR-nah-ehst |
| 15 | petnaest | PEHT-nah-ehst |
| 16 | šesnaest | SHEHST-nah-ehst |
| 17 | sedamnaest | SEH-dahm-nah-ehst |
| 18 | osamnaest | OH-sahm-nah-ehst |
| 19 | devetnaest | DEH-veht-nah-ehst |
| 20 | dvadeset | DVAH-deh-seht |

## Redni brojevi (Ordinal Numbers)

| Broj | Muški | Ženski | Srednji |
|------|-------|--------|---------|
| 1. | prvi | prva | prvo |
| 2. | drugi | druga | drugo |
| 3. | treći | treća | treće |
| 4. | četvrti | četvrta | četvrto |
| 5. | peti | peta | peto |

### Primjeri:
- **prvi** dan (m) - first day
- **druga** lekcija (f) - second lesson  
- **treće** dijete (n) - third child

## Slaganje brojeva sa imenicama

### Broj 1 - slaže se po rodu:
- **jedan** čovjek (m) - one man
- **jedna** žena (f) - one woman
- **jedno** dijete (n) - one child

### Brojevi 2, 3, 4 - imenica u jednini (poseban oblik):
- **dva/dvije** čovjeka - two men
- **tri** žene - three women
- **četiri** djeteta - four children

### Brojevi 5-20 - imenica u genitivu množine:
- **pet** ljudi - five people
- **šest** žena - six women
- **deset** djece - ten children

## Primjeri u rečenicama:
- Imam **jednu** sestru i **dva** brata.
- Ovo je moj **prvi** dan u školi.
- Kupila sam **tri** jabuke.
""",
        "grammar_explanation_en": """
## Basic Numbers 1-20

| Number | Bosnian | Pronunciation |
|--------|---------|---------------|
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
| 12 | dvanaest | DVAH-nah-ehst |
| 13 | trinaest | TREE-nah-ehst |
| 14 | četrnaest | cheh-TR-nah-ehst |
| 15 | petnaest | PEHT-nah-ehst |
| 16 | šesnaest | SHEHST-nah-ehst |
| 17 | sedamnaest | SEH-dahm-nah-ehst |
| 18 | osamnaest | OH-sahm-nah-ehst |
| 19 | devetnaest | DEH-veht-nah-ehst |
| 20 | dvadeset | DVAH-deh-seht |

## Ordinal Numbers

| Number | Masculine | Feminine | Neuter |
|--------|-----------|----------|--------|
| 1st | prvi | prva | prvo |
| 2nd | drugi | druga | drugo |
| 3rd | treći | treća | treće |
| 4th | četvrti | četvrta | četvrto |
| 5th | peti | peta | peto |

### Examples:
- **prvi** dan (m) - first day
- **druga** lekcija (f) - second lesson  
- **treće** dijete (n) - third child

## Number Agreement with Nouns

### Number 1 - agrees in gender:
- **jedan** čovjek (m) - one man
- **jedna** žena (f) - one woman
- **jedno** dijete (n) - one child

### Numbers 2, 3, 4 - noun in singular (special form):
- **dva/dvije** čovjeka - two men
- **tri** žene - three women
- **četiri** djeteta - four children

### Numbers 5-20 - noun in genitive plural:
- **pet** ljudi - five people
- **šest** žena - six women
- **deset** djece - ten children

## Examples in Sentences:
- Imam **jednu** sestru i **dva** brata. (I have one sister and two brothers.)
- Ovo je moj **prvi** dan u školi. (This is my first day at school.)
- Kupila sam **tri** jabuke. (I bought three apples.)
""",
        "cultural_note": "U Bosni i Hercegovini koristi se konvertibilna marka (KM) kao valuta. Kada kupujete na pijaci, često ćete čuti cijene u markama. Pregovaranje o cijeni je uobičajeno na tradicionalnim pijacama.",
        "cultural_note_en": "In Bosnia and Herzegovina, the convertible mark (KM) is used as currency. When shopping at the market, you will often hear prices in marks. Bargaining is common at traditional markets.",
        "cultural_comic": {
            "title": "Na Baščaršiji - kupovina u dućanu",
            "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/9a/e4/1c/bascarsija.jpg?w=1200",
            "panels": [
                {"character": "👩", "name": "Amra", "text": "Dobar dan! Ovo je moja prva posjeta Baščaršiji.", "translation": "Good day! This is my first visit to Baščaršija.", "position": "left", "avatar": "https://i.pravatar.cc/100?img=47"},
                {"character": "👨‍🌾", "name": "Dućandžija", "text": "Dobrodošli! Imam lijepe ćilime. Ovaj je prvi put na prodaju.", "translation": "Welcome! I have nice carpets. This one is for sale for the first time.", "position": "right", "avatar": "https://i.pravatar.cc/100?img=59"},
                {"character": "👩", "name": "Amra", "text": "Koliko košta? Imam dvadeset maraka.", "translation": "How much? I have twenty marks.", "position": "left", "avatar": "https://i.pravatar.cc/100?img=47"},
                {"character": "👨‍🌾", "name": "Dućandžija", "text": "Petnaest maraka. To je druga cijena danas!", "translation": "Fifteen marks. That's the second price today!", "position": "right", "avatar": "https://i.pravatar.cc/100?img=59"},
                {"character": "👩", "name": "Amra", "text": "Odlično! Kupujem tri komada za moje tri sestre.", "translation": "Excellent! I'm buying three pieces for my three sisters.", "position": "left", "avatar": "https://i.pravatar.cc/100?img=47"}
            ]
        },
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
            {"id": 1, "question": "Kako se kaže 'first' na bosanskom?", "options": ["jedan", "prvi", "druga", "treći"], "correct_answer": 1, "explanation": "'Prvi' je redni broj za 'first'.", "question_type": "ordinal"},
            {"id": 2, "question": "Koja je pravilna forma: '___ žena'?", "options": ["jedan", "jedna", "jedno", "jednog"], "correct_answer": 1, "explanation": "'Jedna žena' - žena je ženskog roda, pa koristimo 'jedna'.", "question_type": "grammar"},
            {"id": 3, "question": "Kako kažemo 'two sisters'?", "options": ["dva sestre", "dvije sestre", "dva sestara", "jedne sestre"], "correct_answer": 1, "explanation": "'Dvije sestre' - za ženski rod koristimo 'dvije'.", "question_type": "grammar"},
            {"id": 4, "question": "Koji je redni broj za 'second'?", "options": ["prvi", "drugi", "treći", "četvrti"], "correct_answer": 1, "explanation": "'Drugi/druga/drugo' je redni broj za 'second'.", "question_type": "ordinal"},
            {"id": 5, "question": "Pravilna forma: 'Imam ___ brata'?", "options": ["jedan", "jedna", "jednog", "jedno"], "correct_answer": 2, "explanation": "'Jednog brata' - akuzativ muškog roda.", "question_type": "grammar"},
            {"id": 6, "question": "Kako se kaže 'third lesson' (ž.r.)?", "options": ["treći lekcija", "treća lekcija", "treće lekcija", "trećeg lekcija"], "correct_answer": 1, "explanation": "'Treća lekcija' - lekcija je ženskog roda.", "question_type": "ordinal"},
            {"id": 7, "question": "Koliko je 'dvadeset'?", "options": ["12", "15", "20", "22"], "correct_answer": 2, "explanation": "'Dvadeset' = dva + deset = 20", "question_type": "numbers"},
            {"id": 8, "question": "Pravilna forma: '___ djece' (5)?", "options": ["pet", "peta", "peto", "petero"], "correct_answer": 0, "explanation": "'Pet djece' - s brojevima 5+ imenica ide u genitiv množine.", "question_type": "grammar"},
            {"id": 9, "question": "Kako se kaže 'first day' (m.r.)?", "options": ["prva dan", "prvi dan", "prvo dan", "prve dan"], "correct_answer": 1, "explanation": "'Prvi dan' - dan je muškog roda.", "question_type": "ordinal"},
            {"id": 10, "question": "Koja forma je tačna: '___ čovjeka' (2)?", "options": ["dva", "dvije", "dvoje", "dvojica"], "correct_answer": 0, "explanation": "'Dva čovjeka' - za muški rod koristimo 'dva'.", "question_type": "grammar"},
            {"id": 11, "question": "Koji broj dolazi prije 'pet'?", "options": ["tri", "četiri", "šest", "dva"], "correct_answer": 1, "explanation": "Prije pet (5) dolazi četiri (4).", "question_type": "sequence"},
            {"id": 12, "question": "Kako se kaže 'fourth' (m.r.)?", "options": ["četiri", "četvrti", "četvrta", "četvrto"], "correct_answer": 1, "explanation": "'Četvrti' je muški rod rednog broja za 4.", "question_type": "ordinal"},
            {"id": 13, "question": "Pravilna forma: 'Tri ___'?", "options": ["jabuka", "jabuke", "jabuku", "jabukama"], "correct_answer": 1, "explanation": "'Tri jabuke' - s brojevima 2-4 imenica ide u poseban oblik.", "question_type": "grammar"},
            {"id": 14, "question": "Koji je redni broj za 'fifth'?", "options": ["pet", "peti", "peta", "petog"], "correct_answer": 1, "explanation": "'Peti' je muški rod rednog broja za 5.", "question_type": "ordinal"},
            {"id": 15, "question": "Kako kažemo 'one child' (n.r.)?", "options": ["jedan dijete", "jedna dijete", "jedno dijete", "jednog dijete"], "correct_answer": 2, "explanation": "'Jedno dijete' - dijete je srednjeg roda.", "question_type": "grammar"},
            {"id": 16, "question": "Kako se kaže 'eleven' na bosanskom?", "options": ["deset", "jedanaest", "dvanaest", "dvaeset"], "correct_answer": 1, "explanation": "'Jedanaest' = jedan + na + est (11).", "question_type": "numbers"},
            {"id": 17, "question": "Koliko je 'petnaest'?", "options": ["5", "50", "15", "25"], "correct_answer": 2, "explanation": "'Petnaest' = pet + na + est = 15.", "question_type": "numbers"},
            {"id": 18, "question": "Koji broj dolazi poslije 'trinaest'?", "options": ["dvanaest", "trinaest", "četrnaest", "petnaest"], "correct_answer": 2, "explanation": "Poslije trinaest (13) dolazi četrnaest (14).", "question_type": "sequence"},
            {"id": 19, "question": "Kako se kaže 'eighteen' na bosanskom?", "options": ["osam", "osamnaest", "sedamnaest", "devetnaest"], "correct_answer": 1, "explanation": "'Osamnaest' = osam + na + est = 18.", "question_type": "numbers"},
            {"id": 20, "question": "Koliko je 'dvanaest'?", "options": ["2", "12", "20", "22"], "correct_answer": 1, "explanation": "'Dvanaest' = dva + na + est = 12.", "question_type": "numbers"},
            {"id": 21, "question": "Pravilna forma: '___ učenika' (16)?", "options": ["šesnaest", "šesnaesta", "šesnaesto", "šesnaesti"], "correct_answer": 0, "explanation": "'Šesnaest učenika' - s brojevima 5+ imenica ide u genitiv množine.", "question_type": "grammar"},
            {"id": 22, "question": "Koji broj je između 'sedamnaest' i 'devetnaest'?", "options": ["šesnaest", "osamnaest", "dvadeset", "petnaest"], "correct_answer": 1, "explanation": "Između 17 i 19 je 18 (osamnaest).", "question_type": "sequence"},
            {"id": 23, "question": "Kako se kaže 'nineteen' na bosanskom?", "options": ["devet", "devetnaest", "dvadeset", "osamnaest"], "correct_answer": 1, "explanation": "'Devetnaest' = devet + na + est = 19.", "question_type": "numbers"},
            {"id": 24, "question": "5 + 8 = ?", "options": ["dvanaest", "trinaest", "četrnaest", "petnaest"], "correct_answer": 1, "explanation": "Pet plus osam jednako trinaest (5 + 8 = 13).", "question_type": "math"},
            {"id": 25, "question": "10 + 10 = ?", "options": ["deset", "petnaest", "dvadeset", "jedanaest"], "correct_answer": 2, "explanation": "Deset plus deset jednako dvadeset (10 + 10 = 20).", "question_type": "math"},
            {"id": 26, "question": "Napiši broj 7 na bosanskom:", "question_type": "writing", "correct_answer_text": "sedam", "explanation": "'Sedam' je broj 7."},
            {"id": 27, "question": "Napiši broj 15 na bosanskom:", "question_type": "writing", "correct_answer_text": "petnaest", "explanation": "'Petnaest' = pet + na + est = 15."},
            {"id": 28, "question": "Napiši na bosanskom: 'I have three apples'", "question_type": "writing", "correct_answer_text": "Imam tri jabuke", "explanation": "S brojevima 2-4 imenica ide u poseban oblik."}
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
            {"bosnian": "siva", "english": "gray", "pronunciation": "SEE-vah", "example": "Sivi oblak.", "example_translation": "A gray cloud.", "image_emoji": "🩶"},
            {"bosnian": "roza", "english": "pink", "pronunciation": "ROH-zah", "example": "Roza ruža.", "example_translation": "A pink rose.", "image_emoji": "🩷"},
            {"bosnian": "zlatna", "english": "golden", "pronunciation": "ZLAHT-nah", "example": "Zlatni prsten.", "example_translation": "A golden ring.", "image_emoji": "🏆"}
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
        "grammar_explanation_en": """
## Color Adjectives - Gender Agreement

Color adjectives change according to the gender of the noun:

| Color | Masculine | Feminine | Neuter |
|-------|-----------|----------|--------|
| red | crven | crvena | crveno |
| blue | plav | plava | plavo |
| green | zelen | zelena | zeleno |
| yellow | žut | žuta | žuto |
| black | crn | crna | crno |
| white | bijel | bijela | bijelo |

### Examples:
- **crven** auto (m) - a red car
- **crvena** haljina (f) - a red dress
- **crveno** vino (n) - red wine

## Asking About Colors
- **Koje boje je...?** - What color is...?
- Koje boje je tvoja kuća? - What color is your house?
""",
        "cultural_note": "Bosna i Hercegovina ima zastavu sa plavom bojom i žutim trokutom sa bijelim zvijezdama. Plava i žuta su nacionalne boje. Tradicionalna bosanska ćilimska umjetnost koristi živopisne crvene, plave i zelene boje.",
        "cultural_note_en": "Bosnia and Herzegovina has a flag with blue color and a yellow triangle with white stars. Blue and yellow are the national colors. Traditional Bosnian carpet art uses vivid red, blue, and green colors.",
        "cultural_comic": {
            "title": "Kod Starog Mosta u Mostaru",
            "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/e9/c5/83/stari-most.jpg?w=1200",
            "panels": [
                {"character": "👩‍🦰", "name": "Sara", "text": "Pogledaj! Stari Most je bijel i prekrasan!", "translation": "Look! The Old Bridge is white and beautiful!", "position": "left", "avatar": "https://i.pravatar.cc/100?img=44"},
                {"character": "👨🏻", "name": "Kenan", "text": "Da! A rijeka Neretva je zelena i plava.", "translation": "Yes! And the Neretva river is green and blue.", "position": "right", "avatar": "https://i.pravatar.cc/100?img=68"},
                {"character": "👩‍🦰", "name": "Sara", "text": "Volim bosansku zastavu - plava i žuta!", "translation": "I love the Bosnian flag - blue and yellow!", "position": "left", "avatar": "https://i.pravatar.cc/100?img=44"},
                {"character": "👨🏻", "name": "Kenan", "text": "A ja volim crnu bosansku kafu!", "translation": "And I love black Bosnian coffee!", "position": "right", "avatar": "https://i.pravatar.cc/100?img=68"},
                {"character": "👩‍🦰", "name": "Sara", "text": "Pogledaj one crvene ćilime u dućanu!", "translation": "Look at those red carpets in the shop!", "position": "left", "avatar": "https://i.pravatar.cc/100?img=44"}
            ]
        },
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
            {"id": 5, "question": "Koja boja se koristi za 'brown bear' na bosanskom?", "options": ["crni medvjed", "bijeli medvjed", "smeđi medvjed", "sivi medvjed"], "correct_answer": 2, "explanation": "'Smeđi medvjed' znači 'brown bear'.", "question_type": "vocabulary"},
            {"id": 6, "question": "Kako se kaže 'red' na bosanskom?", "options": ["plava", "crvena", "zelena", "žuta"], "correct_answer": 1, "explanation": "'Crvena' znači 'red'. Crvena jabuka.", "question_type": "vocabulary"},
            {"id": 7, "question": "Koja je pravilna forma: '_____ kuća' (bijel)?", "options": ["bijel", "bijela", "bijelo", "bijeli"], "correct_answer": 1, "explanation": "'Kuća' je ženskog roda, pa koristimo 'bijela'.", "question_type": "grammar"},
            {"id": 8, "question": "Šta znači 'crna'?", "options": ["white", "black", "gray", "brown"], "correct_answer": 1, "explanation": "'Crna' znači 'black'. Crna mačka.", "question_type": "vocabulary"},
            {"id": 9, "question": "Koje boje je trava?", "options": ["crvena", "zelena", "plava", "žuta"], "correct_answer": 1, "explanation": "Trava je zelena. 'Zelena trava' - green grass.", "question_type": "context"},
            {"id": 10, "question": "Koja je pravilna forma: '_____ auto' (crven)?", "options": ["crvena", "crveno", "crven", "crveni"], "correct_answer": 2, "explanation": "'Auto' je muškog roda, pa koristimo 'crven'.", "question_type": "grammar"},
            {"id": 11, "question": "Kako se kaže 'yellow' na bosanskom?", "options": ["plava", "crvena", "zelena", "žuta"], "correct_answer": 3, "explanation": "'Žuta' znači 'yellow'. Žuto sunce.", "question_type": "vocabulary"},
            {"id": 12, "question": "Šta znači 'siva'?", "options": ["white", "black", "gray", "brown"], "correct_answer": 2, "explanation": "'Siva' znači 'gray'. Sivi oblak.", "question_type": "vocabulary"},
            {"id": 13, "question": "Koje boje je sunce?", "options": ["crveno", "zeleno", "plavo", "žuto"], "correct_answer": 3, "explanation": "Sunce je žuto. 'Žuto sunce' - yellow sun.", "question_type": "context"},
            {"id": 14, "question": "Kako se kaže 'blue' na bosanskom?", "options": ["plava", "crvena", "zelena", "žuta"], "correct_answer": 0, "explanation": "'Plava' znači 'blue'. Plavo nebo.", "question_type": "vocabulary"},
            {"id": 15, "question": "Koja je pravilna forma: '_____ vino' (crven)?", "options": ["crven", "crvena", "crveno", "crveni"], "correct_answer": 2, "explanation": "'Vino' je srednjeg roda, pa koristimo 'crveno'.", "question_type": "grammar"},
            {"id": 16, "question": "Napiši na bosanskom: 'red'", "question_type": "writing", "correct_answer_text": "crvena", "explanation": "'Crvena' znači 'red'."},
            {"id": 17, "question": "Napiši na bosanskom: 'The sky is blue'", "question_type": "writing", "correct_answer_text": "Nebo je plavo", "explanation": "'Nebo' je srednjeg roda, pa koristimo 'plavo'."},
            {"id": 18, "question": "Napiši na bosanskom: 'white house'", "question_type": "writing", "correct_answer_text": "bijela kuća", "explanation": "'Kuća' je ženskog roda, pa koristimo 'bijela'."}
        ]
    }
]

A1_LESSONS = A1_LESSONS_BASE + A1_LESSONS_PART2 + A1_LESSONS_PART3 + A1_LESSONS_PART4
