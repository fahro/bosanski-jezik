"""
A1 Završni Test - 120 novih pitanja (10 po lekciji)
Tipovi pitanja: vocabulary, grammar, translation, audio, image, dialogue, find_error, fill_blank, true_false
"""

A1_FINAL_TEST_QUESTIONS = [
    # ─────────────────────────────────────────────
    # LEKCIJA 1: Pozdravi i Upoznavanje
    # ─────────────────────────────────────────────
    {
        "lesson_id": 1,
        "lesson_title": "Pozdravi i Upoznavanje",
        "questions": [
            {
                "id": 1,
                "question_type": "vocabulary",
                "question": "Šta znači 'Dobar dan'?",
                "options": ["Good morning", "Good night", "Good day / Good afternoon", "Goodbye"],
                "correct_answer": 2,
                "explanation": "'Dobar dan' je formalni pozdrav koji koristimo tokom dana."
            },
            {
                "id": 2,
                "question_type": "audio",
                "audio_text": "Kako se zoveš?",
                "question": "Slušajte i izaberite šta ste čuli:",
                "options": ["Kako si?", "Kako se zoveš?", "Odakle si?", "Koliko imaš godina?"],
                "correct_answer": 1,
                "explanation": "'Kako se zoveš?' znači 'What is your name?' (neformalno)."
            },
            {
                "id": 3,
                "question_type": "image",
                "image_emoji": "👋",
                "question": "Koji pozdrav odgovara ovoj slici?",
                "options": ["Doviđenja", "Zdravo", "Laku noć", "Hvala"],
                "correct_answer": 1,
                "explanation": "'Zdravo' je neformalni pozdrav koji koristimo pri susretu."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Kako se kaže 'My name is Amra' na bosanskom?",
                "options": ["Amra zovem.", "Zovem se Amra.", "Ja zovem Amra.", "Ime je Amra moje."],
                "correct_answer": 1,
                "explanation": "'Zovem se...' je standardna forma za uvođenje svog imena."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Koja je FORMALNA forma pozdrava u Bosni?",
                "options": ["Zdravo, kako si?", "Ćao!", "Hej!", "Dobar dan, kako ste?"],
                "correct_answer": 3,
                "explanation": "'Kako ste?' koristi formalnu formu zamjenice 'vi', za nepoznate osobe i starije."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "Marko", "text": "Zdravo! Ja sam Marko. Kako se ti zoveš?", "translation": "Hi! I am Marko. What is your name?"},
                    {"speaker": "Lamija", "text": "Zdravo! Zovem se Lamija. Odakle si ti?", "translation": "Hi! My name is Lamija. Where are you from?"},
                    {"speaker": "Marko", "text": "Ja sam iz Sarajeva. A ti?", "translation": "I am from Sarajevo. And you?"},
                    {"speaker": "Lamija", "text": "Ja sam iz Mostara.", "translation": "I am from Mostar."}
                ],
                "question": "Odakle je Lamija?",
                "options": ["Iz Sarajeva", "Iz Mostara", "Iz Tuzle", "Iz Zenice"],
                "correct_answer": 1,
                "explanation": "Lamija kaže: 'Ja sam iz Mostara.'"
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "Ja zovem se Haris.",
                    "Zovem se Haris.",
                    "Me zovem Haris.",
                    "Zvati se Haris."
                ],
                "correct_answer": 1,
                "explanation": "Ispravna forma je 'Zovem se Haris.' - povratni glagol ide bez 'ja' ili dolazi na kraj: 'Ja se zovem Haris.'"
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "Gdje _____ iz?",
                "question": "Popunite prazninu: 'Gdje _____ iz?'",
                "options": ["je", "si", "sam", "su"],
                "correct_answer": 1,
                "explanation": "'Gdje si iz?' = Where are you from? (neformalno, 2. lice jednine)."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Laku noć' je pozdrav koji koristimo ujutro.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 1,
                "explanation": "'Laku noć' znači 'Good night' i koristimo ga uveče pri rastanku."
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Šta znači 'Drago mi je'?",
                "options": ["Goodbye", "Please", "Nice to meet you", "Thank you"],
                "correct_answer": 2,
                "explanation": "'Drago mi je' = 'Nice to meet you' - govorimo pri upoznavanju."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 2: Brojevi
    # ─────────────────────────────────────────────
    {
        "lesson_id": 2,
        "lesson_title": "Brojevi od 1 do 20",
        "questions": [
            {
                "id": 1,
                "question_type": "vocabulary",
                "question": "Koji broj znači 'petnaest'?",
                "options": ["13", "14", "15", "16"],
                "correct_answer": 2,
                "explanation": "'Petnaest' je bosanska riječ za broj 15."
            },
            {
                "id": 2,
                "question_type": "audio",
                "audio_text": "Imam dvadeset godina.",
                "question": "Slušajte i izaberite šta ste čuli:",
                "options": [
                    "Imam dvanaest godina.",
                    "Imam petnaest godina.",
                    "Imam dvadeset godina.",
                    "Imam sedamnaest godina."
                ],
                "correct_answer": 2,
                "explanation": "'Imam dvadeset godina' = I am twenty years old."
            },
            {
                "id": 3,
                "question_type": "image",
                "image_emoji": "🖐️",
                "question": "Koji broj prikazuje ova slika?",
                "options": ["četiri", "pet", "šest", "sedam"],
                "correct_answer": 1,
                "explanation": "Otvorena šaka sa 5 prstiju prikazuje broj pet (5)."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Kako se kaže 'twenty' na bosanskom?",
                "options": ["deset", "dvanaest", "dvadeset", "devetnaest"],
                "correct_answer": 2,
                "explanation": "'Dvadeset' = twenty. Nastaje od 'dva' + 'deset'."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Koji broj dolazi IZMEĐU 'jedanaest' i 'trinaest'?",
                "options": ["deset", "dvanaest", "četrnaest", "petnaest"],
                "correct_answer": 1,
                "explanation": "Redoslijed: jedanaest (11) → dvanaest (12) → trinaest (13)."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "Kupac", "text": "Koliko košta hljeb?", "translation": "How much does bread cost?"},
                    {"speaker": "Prodavač", "text": "Hljeb košta dvije marke.", "translation": "Bread costs two marks."},
                    {"speaker": "Kupac", "text": "A koliko košta mlijeko?", "translation": "And how much does milk cost?"},
                    {"speaker": "Prodavač", "text": "Mlijeko košta tri marke.", "translation": "Milk costs three marks."}
                ],
                "question": "Koliko ukupno košta hljeb i mlijeko?",
                "options": ["3 marke", "4 marke", "5 marke", "6 marke"],
                "correct_answer": 2,
                "explanation": "2 marke (hljeb) + 3 marke (mlijeko) = 5 marki ukupno."
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "Imam dvadeset i jedna godina.",
                    "Imam dvadeset jedna godina.",
                    "Imam dvadeset i jednu godinu.",
                    "Imam dvadesetjedna godine."
                ],
                "correct_answer": 2,
                "explanation": "'Imam' zahtijeva akuzativ: 'jednu godinu'. Ispravno: 'dvadeset i jednu godinu'."
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "Ima _____ dana u sedmici.",
                "question": "Popunite prazninu: 'Ima _____ dana u sedmici.'",
                "options": ["pet", "šest", "sedam", "osam"],
                "correct_answer": 2,
                "explanation": "U sedmici ima sedam (7) dana."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Dvanaest' je isti broj kao 'twelve' na engleskom.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 0,
                "explanation": "'Dvanaest' = twelve = 12. Tačno!"
            },
            {
                "id": 10,
                "question_type": "translation",
                "question": "Koji je tačan prijevod: 'Imam deset knjiga'?",
                "options": [
                    "I have five books.",
                    "I have ten pens.",
                    "I have ten books.",
                    "Ten books are here."
                ],
                "correct_answer": 2,
                "explanation": "'Imam' = I have, 'deset' = ten, 'knjiga' = books (genitive plural)."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 3: Boje
    # ─────────────────────────────────────────────
    {
        "lesson_id": 3,
        "lesson_title": "Boje",
        "questions": [
            {
                "id": 1,
                "question_type": "audio",
                "audio_text": "Moja omiljena boja je plava.",
                "question": "Slušajte i izaberite šta ste čuli:",
                "options": [
                    "Moja omiljena boja je crvena.",
                    "Moja omiljena boja je zelena.",
                    "Moja omiljena boja je plava.",
                    "Moja omiljena boja je žuta."
                ],
                "correct_answer": 2,
                "explanation": "'Plava' = blue. 'Omiljena' = favourite."
            },
            {
                "id": 2,
                "question_type": "image",
                "image_emoji": "🔵",
                "question": "Koja je ovo boja na bosanskom?",
                "options": ["crvena", "zelena", "plava", "žuta"],
                "correct_answer": 2,
                "explanation": "Plavi krug → 'plava' boja = blue."
            },
            {
                "id": 3,
                "question_type": "grammar",
                "question": "Koja je pravilna forma: '_____ haljina' (blue)?",
                "options": ["plav", "plavi", "plava", "plavo"],
                "correct_answer": 2,
                "explanation": "'Haljina' je ženskog roda → pridjev mora biti u ženskom rodu: 'plava haljina'."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Šta znači 'žuta zvijezda'?",
                "options": ["red star", "blue star", "green star", "yellow star"],
                "correct_answer": 3,
                "explanation": "'Žuta' = yellow, 'zvijezda' = star."
            },
            {
                "id": 5,
                "question_type": "fill_blank",
                "sentence": "Trava je _____ boje.",
                "question": "Popunite prazninu: 'Trava je _____ boje.'",
                "options": ["crvene", "zelene", "plave", "bijele"],
                "correct_answer": 1,
                "explanation": "Trava (grass) je zelena. Genitiv: 'zelene boje'."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "Amir", "text": "Koja ti je omiljena boja?", "translation": "What is your favourite colour?"},
                    {"speaker": "Nina", "text": "Volim plavu boju. A tebi?", "translation": "I like blue. And you?"},
                    {"speaker": "Amir", "text": "Moja omiljena boja je zelena.", "translation": "My favourite colour is green."}
                ],
                "question": "Koja je Nimina omiljena boja?",
                "options": ["zelena", "crvena", "plava", "žuta"],
                "correct_answer": 2,
                "explanation": "Nina kaže: 'Volim plavu boju.'"
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "Nebo je plavi.",
                    "Nebo je plava.",
                    "Nebo je plavo.",
                    "Nebo je plave."
                ],
                "correct_answer": 2,
                "explanation": "'Nebo' je srednjeg roda → pridjev mora biti u srednjem rodu: 'plavo nebo'."
            },
            {
                "id": 8,
                "question_type": "image",
                "image_emoji": "🍎",
                "question": "Koja boja odgovara ovoj slici?",
                "options": ["zelena", "plava", "crvena", "žuta"],
                "correct_answer": 2,
                "explanation": "Jabuka (apple) je crvena = red."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Bijela' i 'crna' su boje na bosanskom.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 0,
                "explanation": "'Bijela' = white, 'crna' = black. Obje su boje."
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Koja boja se NE nalazi u zastavi Bosne i Hercegovine?",
                "options": ["plava", "žuta", "bijela", "crvena"],
                "correct_answer": 3,
                "explanation": "Zastava BiH ima plavu, žutu i bijelu boju. Crvena NIJE na zastavi."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 4: Porodica
    # ─────────────────────────────────────────────
    {
        "lesson_id": 4,
        "lesson_title": "Porodica",
        "questions": [
            {
                "id": 1,
                "question_type": "vocabulary",
                "question": "Kako se zove majka vašeg oca ili majke?",
                "options": ["teta", "sestra", "nana/baka", "kći"],
                "correct_answer": 2,
                "explanation": "'Nana' ili 'baka' = grandmother - majka vašeg roditelja."
            },
            {
                "id": 2,
                "question_type": "audio",
                "audio_text": "Moja majka je doktor.",
                "question": "Slušajte i izaberite šta ste čuli:",
                "options": [
                    "Moja sestra je doktor.",
                    "Moj otac je doktor.",
                    "Moja majka je doktor.",
                    "Moja teta je doktor."
                ],
                "correct_answer": 2,
                "explanation": "'Moja majka je doktor' = My mother is a doctor."
            },
            {
                "id": 3,
                "question_type": "image",
                "image_emoji": "👨‍👩‍👧‍👦",
                "question": "Šta prikazuje ova slika?",
                "options": ["brat", "porodica", "škola", "komšija"],
                "correct_answer": 1,
                "explanation": "Slika prikazuje porodicu (family) - roditelje i djecu."
            },
            {
                "id": 4,
                "question_type": "grammar",
                "question": "Koja je pravilna forma: '_____ auto' (my, masculine)?",
                "options": ["moji", "moja", "moje", "moj"],
                "correct_answer": 3,
                "explanation": "'Auto' je muškog roda → posesivni pridjev: 'moj auto'."
            },
            {
                "id": 5,
                "question_type": "translation",
                "question": "Šta znači 'njegov stariji brat'?",
                "options": [
                    "her younger sister",
                    "his older sister",
                    "his older brother",
                    "her younger brother"
                ],
                "correct_answer": 2,
                "explanation": "'Njegov' = his, 'stariji' = older, 'brat' = brother."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "A", "text": "Imaš li braće ili sestara?", "translation": "Do you have brothers or sisters?"},
                    {"speaker": "B", "text": "Imam jednog brata i dvije sestre.", "translation": "I have one brother and two sisters."},
                    {"speaker": "A", "text": "Koliko imaš godina?", "translation": "How old are you?"},
                    {"speaker": "B", "text": "Imam osamnaest godina.", "translation": "I am eighteen years old."}
                ],
                "question": "Koliko sestara ima osoba B?",
                "options": ["jednu", "dvije", "tri", "nema sestara"],
                "correct_answer": 1,
                "explanation": "Osoba B kaže: 'Imam jednog brata i dvije sestre.'"
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "Moja brat je star.",
                    "Moje brat je star.",
                    "Moj brat je star.",
                    "Mojih brat je star."
                ],
                "correct_answer": 2,
                "explanation": "'Brat' je muškog roda → posesivni: 'moj brat'."
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "Moja _____ se zove Amira.",
                "question": "Popunite prazninu: 'Moja _____ se zove Amira.' (female family member)",
                "options": ["brat", "otac", "djed", "sestra"],
                "correct_answer": 3,
                "explanation": "'Moja sestra' - sestra je ženskog roda, odgovara zamjenici 'moja'."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Ujak' je brat vašeg OCA.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 1,
                "explanation": "'Ujak' je brat vaše MAJKE, ne oca. Brat oca se zove 'stric' ili 'amidža'."
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Koji bosanski izraz znači 'grandmother'?",
                "options": ["teta", "majka", "nana", "kći"],
                "correct_answer": 2,
                "explanation": "'Nana' (ili 'baka') = grandmother - majka vašeg oca ili majke."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 5: Dani u Sedmici
    # ─────────────────────────────────────────────
    {
        "lesson_id": 5,
        "lesson_title": "Dani u Sedmici",
        "questions": [
            {
                "id": 1,
                "question_type": "vocabulary",
                "question": "Koji dan dolazi POSLIJE četvrtka?",
                "options": ["srijeda", "petak", "subota", "utorak"],
                "correct_answer": 1,
                "explanation": "Redoslijed: ponedjeljak, utorak, srijeda, četvrtak → petak."
            },
            {
                "id": 2,
                "question_type": "audio",
                "audio_text": "U ponedjeljak idem u školu.",
                "question": "Slušajte i izaberite šta ste čuli:",
                "options": [
                    "U utorak idem u posao.",
                    "U ponedjeljak idem u školu.",
                    "U srijedu idem kući.",
                    "U petak idem na odmor."
                ],
                "correct_answer": 1,
                "explanation": "'U ponedjeljak idem u školu' = On Monday I go to school."
            },
            {
                "id": 3,
                "question_type": "image",
                "image_emoji": "📅",
                "question": "Šta prikazuje ova slika u kontekstu lekcije o danima?",
                "options": ["godišnje doba", "kalendar / dan u tjednu", "sat / vrijeme", "broj"],
                "correct_answer": 1,
                "explanation": "Kalendar (📅) simbolizira dane u sedmici."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Kako se kaže 'on Friday' (specific) na bosanskom?",
                "options": ["od petka", "petkom", "u petak", "za petak"],
                "correct_answer": 2,
                "explanation": "'U petak' = on (this specific) Friday. 'Petkom' = on Fridays (habitual)."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Koji prijedlog koristimo za dane: 'Radim _____ ponedjeljak'?",
                "options": ["na", "u", "od", "za"],
                "correct_answer": 1,
                "explanation": "Koristimo prijedlog 'u' za dane sedmice: 'u ponedjeljak', 'u utorak', itd."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "Selma", "text": "Kada imaš slobodno?", "translation": "When are you free?"},
                    {"speaker": "Hasan", "text": "Slobodan sam u subotu i nedjelju.", "translation": "I am free on Saturday and Sunday."},
                    {"speaker": "Selma", "text": "Odlično! Idemo u kino u subotu?", "translation": "Great! Shall we go to the cinema on Saturday?"},
                    {"speaker": "Hasan", "text": "Zvuči super!", "translation": "Sounds great!"}
                ],
                "question": "Koji dan Selma predlaže za kino?",
                "options": ["ponedjeljak", "petak", "subotu", "nedjelju"],
                "correct_answer": 2,
                "explanation": "Selma pita: 'Idemo u kino u subotu?'"
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "Ja radim u ponedjeljak do petak.",
                    "Ja radim od ponedjeljak do petak.",
                    "Ja radim od ponedjeljka do petka.",
                    "Ja radim ponedjeljak do petak."
                ],
                "correct_answer": 2,
                "explanation": "'Od...do' zahtijeva genitiv: 'od ponedjeljka do petka'."
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "_____ je prvi dan radne sedmice u Bosni.",
                "question": "Popunite prazninu: '_____ je prvi dan radne sedmice u Bosni.'",
                "options": ["Nedjelja", "Subota", "Ponedjeljak", "Utorak"],
                "correct_answer": 2,
                "explanation": "Radna sedmica počinje u ponedjeljak (Monday)."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: Vikend u Bosni su petak i subota.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 1,
                "explanation": "Vikend u Bosni su SUBOTA i NEDJELJA, ne petak i subota."
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Šta znači 'jučer'?",
                "options": ["today", "tomorrow", "yesterday", "next week"],
                "correct_answer": 2,
                "explanation": "'Jučer' = yesterday. 'Danas' = today. 'Sutra' = tomorrow."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 6: Mjeseci i Godišnja Doba
    # ─────────────────────────────────────────────
    {
        "lesson_id": 6,
        "lesson_title": "Mjeseci i Godišnja Doba",
        "questions": [
            {
                "id": 1,
                "question_type": "vocabulary",
                "question": "Koji je TREĆI mjesec u godini?",
                "options": ["januar", "februar", "mart", "april"],
                "correct_answer": 2,
                "explanation": "Januar (1), Februar (2), Mart (3)."
            },
            {
                "id": 2,
                "question_type": "audio",
                "audio_text": "U julu je vrelo ljeto.",
                "question": "Slušajte i izaberite šta ste čuli:",
                "options": [
                    "U junu počinje proljeće.",
                    "U julu je vrelo ljeto.",
                    "U augustu je svježe.",
                    "U septembru je jesen."
                ],
                "correct_answer": 1,
                "explanation": "'U julu je vrelo ljeto' = In July it is hot summer."
            },
            {
                "id": 3,
                "question_type": "image",
                "image_emoji": "🍂",
                "question": "Koje godišnje doba prikazuje ova slika?",
                "options": ["proljeće", "ljeto", "jesen", "zima"],
                "correct_answer": 2,
                "explanation": "Lišće (🍂) simbolizira jesen (autumn)."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "U kojim je mjesecima zima?",
                "options": [
                    "mart, april, maj",
                    "juni, juli, august",
                    "septembar, oktobar, novembar",
                    "decembar, januar, februar"
                ],
                "correct_answer": 3,
                "explanation": "Zima = winter = decembar, januar, februar."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Koji prijedlog koristimo: 'Rodio sam se _____ martu'?",
                "options": ["na", "za", "od", "u"],
                "correct_answer": 3,
                "explanation": "Koristimo 'u' za mjesece: 'u januaru', 'u martu', 'u decembru'."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "A", "text": "Kada je tvoj rođendan?", "translation": "When is your birthday?"},
                    {"speaker": "B", "text": "Moj rođendan je u augustu. Tada je ljeto!", "translation": "My birthday is in August. It's summer then!"},
                    {"speaker": "A", "text": "Moj je u januaru - tada je hladno i pada snijeg.", "translation": "Mine is in January - it's cold and it snows then."}
                ],
                "question": "Koje godišnje doba je kada je Aov rođendan?",
                "options": ["proljeće", "ljeto", "jesen", "zima"],
                "correct_answer": 3,
                "explanation": "A kaže: 'Moj je u januaru - tada je hladno.' Januar je zima."
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "U proljeće cvjetaju cvijeće.",
                    "U proljeće cvijeta cvijeće.",
                    "U proljeće cvjetati cvijeće.",
                    "U proljeće cvjetaće cvijeće."
                ],
                "correct_answer": 1,
                "explanation": "'Cvijeće' je zbirna imenica (jednina) → glagol mora biti u jednini: 'cvijeta'."
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "Ljeto uključuje juni, _____ i august.",
                "question": "Popunite prazninu: 'Ljeto uključuje juni, _____ i august.'",
                "options": ["april", "maj", "juli", "septembar"],
                "correct_answer": 2,
                "explanation": "Ljeto = juni, JULI, august."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: Decembar je posljednji mjesec u godini.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 0,
                "explanation": "Decembar (December) je 12. i posljednji mjesec u godini. Tačno!"
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Koja DVA godišnja doba su topla?",
                "options": [
                    "proljeće i jesen",
                    "zima i proljeće",
                    "ljeto i proljeće",
                    "zima i jesen"
                ],
                "correct_answer": 2,
                "explanation": "Ljeto (summer) je najtoplije, a proljeće (spring) je toplo i ugodno."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 7: Hrana i Piće
    # ─────────────────────────────────────────────
    {
        "lesson_id": 7,
        "lesson_title": "Hrana i Piće",
        "questions": [
            {
                "id": 1,
                "question_type": "audio",
                "audio_text": "Šta biste željeli naručiti?",
                "question": "Slušajte i izaberite prijevod:",
                "options": [
                    "What is the total bill?",
                    "What do you have today?",
                    "What would you like to order?",
                    "How much does it cost?"
                ],
                "correct_answer": 2,
                "explanation": "'Šta biste željeli naručiti?' = What would you like to order?"
            },
            {
                "id": 2,
                "question_type": "image",
                "image_emoji": "☕",
                "question": "Šta prikazuje ova slika?",
                "options": ["čaj", "kafa", "voda", "mlijeko"],
                "correct_answer": 1,
                "explanation": "Šalica tople crne kafe (☕) = kafa/kahva."
            },
            {
                "id": 3,
                "question_type": "vocabulary",
                "question": "Koji napitak je tradicionalno jutarnji u Bosni?",
                "options": ["sok od jabuke", "pivo", "kafa / kahva", "lemonade"],
                "correct_answer": 2,
                "explanation": "Kafa (bosanska kafa) je sastavni dio jutarnje tradicije u Bosni."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Kako se kaže 'apple' na bosanskom?",
                "options": ["kruška", "banana", "jabuka", "šljiva"],
                "correct_answer": 2,
                "explanation": "'Jabuka' = apple. 'Kruška' = pear. 'Šljiva' = plum."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Koja je pravilna forma: 'Volim _____ kafu' (black)?",
                "options": ["crni", "crna", "crnu", "crne"],
                "correct_answer": 2,
                "explanation": "'Kafu' je akuzativ od 'kafa' (ženski rod) → pridjev u akuzativu ženskog roda: 'crnu'."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "Konobar", "text": "Dobar dan! Šta biste željeli naručiti?", "translation": "Good day! What would you like to order?"},
                    {"speaker": "Gost", "text": "Jednu kafu i jedan sok, molim.", "translation": "One coffee and one juice, please."},
                    {"speaker": "Konobar", "text": "Koji sok? Imamo jabuku, naranču i grožđe.", "translation": "Which juice? We have apple, orange and grape."},
                    {"speaker": "Gost", "text": "Sok od jabuke, hvala.", "translation": "Apple juice, thank you."}
                ],
                "question": "Šta gost naručuje?",
                "options": [
                    "dvije kafe",
                    "kafu i sok od naranče",
                    "kafu i sok od jabuke",
                    "sok i vodu"
                ],
                "correct_answer": 2,
                "explanation": "Gost naručuje: kafu i sok od jabuke."
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "On jedu ručak sada.",
                    "On jedete ručak sada.",
                    "On jedemo ručak sada.",
                    "On jede ručak sada."
                ],
                "correct_answer": 3,
                "explanation": "'On' (he) + glagol 3. lica jednine = 'jede'. 'On jede ručak sada.'"
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "Za doručak volim _____ i kafu.",
                "question": "Popunite prazninu: 'Za doručak volim _____ i kafu.'",
                "options": ["večeru", "ručak", "hljeb", "obrok"],
                "correct_answer": 2,
                "explanation": "'Hljeb i kafa' je klasičan bosanski doručak."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Burek' je vrsta bosanskog kolača (sweet cake).",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 1,
                "explanation": "Burek je slana pita od mesa (savory meat pastry), ne slatki kolač."
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Koji obrok se jede UJUTRO?",
                "options": ["ručak", "večera", "doručak", "užina"],
                "correct_answer": 2,
                "explanation": "'Doručak' = breakfast (jutarnji obrok). 'Ručak' = lunch. 'Večera' = dinner."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 8: Kuća i Stan
    # ─────────────────────────────────────────────
    {
        "lesson_id": 8,
        "lesson_title": "Kuća i Stan",
        "questions": [
            {
                "id": 1,
                "question_type": "vocabulary",
                "question": "Gdje SPAVAMO?",
                "options": ["dnevna soba", "kuhinja", "spavaća soba", "kupatilo"],
                "correct_answer": 2,
                "explanation": "'Spavaća soba' = bedroom - mjesto gdje spavamo."
            },
            {
                "id": 2,
                "question_type": "audio",
                "audio_text": "Sto je u dnevnoj sobi.",
                "question": "Slušajte i izaberite šta ste čuli:",
                "options": [
                    "Krevet je u spavaćoj sobi.",
                    "Sto je u dnevnoj sobi.",
                    "Šporet je u kuhinji.",
                    "Tuš je u kupatilu."
                ],
                "correct_answer": 1,
                "explanation": "'Sto je u dnevnoj sobi' = The table is in the living room."
            },
            {
                "id": 3,
                "question_type": "image",
                "image_emoji": "🛁",
                "question": "Koji dio kuće prikazuje ova slika?",
                "options": ["kuhinja", "spavaća soba", "dnevna soba", "kupatilo"],
                "correct_answer": 3,
                "explanation": "Kada (🛁) se nalazi u kupatilu (bathroom)."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Šta znači 'The kitchen is big'?",
                "options": [
                    "Kuhinja je mala.",
                    "Kuhinja je moderna.",
                    "Kuhinja je nova.",
                    "Kuhinja je velika."
                ],
                "correct_answer": 3,
                "explanation": "'Big' = 'velika' (ženski rod, jer je 'kuhinja' ženskog roda)."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Koji prijedlog koristimo: 'Knjiga je _____ stolu'?",
                "options": ["u", "iza", "ispod", "na"],
                "correct_answer": 3,
                "explanation": "'Na stolu' = on the table. 'Na' koristimo za površinu."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "A", "text": "Gdje živiš?", "translation": "Where do you live?"},
                    {"speaker": "B", "text": "Živim u stanu na trećem spratu.", "translation": "I live in a flat on the third floor."},
                    {"speaker": "A", "text": "Imaš li veliku kuhinju?", "translation": "Do you have a big kitchen?"},
                    {"speaker": "B", "text": "Ne, kuhinja je mala, ali dnevna soba je prostrana.", "translation": "No, the kitchen is small, but the living room is spacious."}
                ],
                "question": "Kakva je Bova kuhinja?",
                "options": ["velika", "moderna", "mala", "nova"],
                "correct_answer": 2,
                "explanation": "B kaže: 'kuhinja je mala'."
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "Knjiga je ispod od stol.",
                    "Knjiga je pod od sto.",
                    "Knjiga je ispod stolu.",
                    "Knjiga je ispod stola."
                ],
                "correct_answer": 3,
                "explanation": "'Ispod' zahtijeva genitiv: 'ispod stola' (not 'stolu' or 'stol')."
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "Kuhamo hranu u _____.",
                "question": "Popunite prazninu: 'Kuhamo hranu u _____.'",
                "options": ["kupatilu", "spavaćoj sobi", "garaži", "kuhinji"],
                "correct_answer": 3,
                "explanation": "Hrana se kuha u kuhinji (kitchen)."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Avlija' je bosanski izraz za dvorište/courtyard.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 0,
                "explanation": "'Avlija' je tradicionalni bosanski izraz za dvorište. Tačno!"
            },
            {
                "id": 10,
                "question_type": "image",
                "image_emoji": "🛏️",
                "question": "Šta prikazuje ova slika?",
                "options": ["sto", "stolica", "ormar", "krevet"],
                "correct_answer": 3,
                "explanation": "Krevet (🛏️) = bed - namještaj u spavaćoj sobi."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 9: Tijelo i Zdravlje
    # ─────────────────────────────────────────────
    {
        "lesson_id": 9,
        "lesson_title": "Tijelo i Zdravlje",
        "questions": [
            {
                "id": 1,
                "question_type": "audio",
                "audio_text": "Boli me glava.",
                "question": "Slušajte i izaberite tačan prijevod:",
                "options": [
                    "My leg hurts.",
                    "My back hurts.",
                    "My head hurts.",
                    "My hand hurts."
                ],
                "correct_answer": 2,
                "explanation": "'Boli me glava' = My head hurts. 'Glava' = head."
            },
            {
                "id": 2,
                "question_type": "image",
                "image_emoji": "👁️",
                "question": "Koji dio tijela prikazuje ova slika?",
                "options": ["uho", "nos", "usta", "oko"],
                "correct_answer": 3,
                "explanation": "Oko (👁️) = eye. Plural: oči."
            },
            {
                "id": 3,
                "question_type": "vocabulary",
                "question": "Šta znači 'ruka'?",
                "options": ["leg", "hand / arm", "head", "back"],
                "correct_answer": 1,
                "explanation": "'Ruka' = arm/hand. 'Noga' = leg. 'Glava' = head. 'Leđa' = back."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Kako se kaže 'I have a stomachache' na bosanskom?",
                "options": [
                    "Boli me stomak.",
                    "Boli mene stomaku.",
                    "Stomak boli mi.",
                    "Bol je stomak."
                ],
                "correct_answer": 0,
                "explanation": "'Boli me stomak' = My stomach hurts (literally: stomach hurts me)."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Šta znači konstrukcija 'Boli me...' na engleskom?",
                "options": [
                    "I see...",
                    "I have...",
                    "My ... hurts",
                    "I feel..."
                ],
                "correct_answer": 2,
                "explanation": "'Boli me glava' = My head hurts. 'Boli' = hurts, 'me' = me (dative)."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "Doktor", "text": "Dobar dan. Šta vas boli?", "translation": "Good day. What is hurting you?"},
                    {"speaker": "Pacijent", "text": "Boli me grlo i imam temperaturu.", "translation": "My throat hurts and I have a temperature."},
                    {"speaker": "Doktor", "text": "Koliko imate temperature?", "translation": "What is your temperature?"},
                    {"speaker": "Pacijent", "text": "Imam 38 stupnjeva.", "translation": "I have 38 degrees."}
                ],
                "question": "Šta pacijenta boli?",
                "options": ["Stomak i leđa", "Noga i ruka", "Grlo i ima temperaturu", "Uho i nos"],
                "correct_answer": 2,
                "explanation": "Pacijent kaže: 'Boli me grlo i imam temperaturu.'"
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "Boli mi glava.",
                    "Glava me bolim.",
                    "Me glava boli ti.",
                    "Boli me glava."
                ],
                "correct_answer": 3,
                "explanation": "Ispravna konstrukcija: 'Boli ME glava' - 'me' je enklitika dativa (not 'mi' for this verb)."
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "Imam 10 _____ na rukama.",
                "question": "Popunite prazninu: 'Imam 10 _____ na rukama.'",
                "options": ["noge", "uha", "prsta", "oka"],
                "correct_answer": 2,
                "explanation": "Na rukama imamo 10 prstiju (fingers). 'Prsta' = genitiv plural od 'prst'."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Koljeno' je dio noge (leg).",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 0,
                "explanation": "'Koljeno' = knee - zglobni dio noge. Tačno!"
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Koji dio tijela koristimo za SLUŠANJE?",
                "options": ["oko", "nos", "usta", "uho"],
                "correct_answer": 3,
                "explanation": "'Uho' = ear - organ sluha. Plural: 'uši'."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 10: Zanimanja i Posao
    # ─────────────────────────────────────────────
    {
        "lesson_id": 10,
        "lesson_title": "Zanimanja i Posao",
        "questions": [
            {
                "id": 1,
                "question_type": "vocabulary",
                "question": "Koji stručnjak radi u bolnici i liječi pacijente?",
                "options": ["učitelj", "policajac", "kuhar", "doktor"],
                "correct_answer": 3,
                "explanation": "'Doktor' = doctor - radi u bolnici i liječi pacijente."
            },
            {
                "id": 2,
                "question_type": "audio",
                "audio_text": "Radim kao inženjer u IT firmi.",
                "question": "Slušajte i izaberite šta ste čuli:",
                "options": [
                    "Radim kao advokat u firmi.",
                    "Studiram inženjering.",
                    "Radim kao inženjer u IT firmi.",
                    "Radim u bolnici kao doktor."
                ],
                "correct_answer": 2,
                "explanation": "'Radim kao inženjer u IT firmi' = I work as an engineer in an IT company."
            },
            {
                "id": 3,
                "question_type": "image",
                "image_emoji": "⚖️",
                "question": "Koje zanimanje simbolizira ova slika?",
                "options": ["doktor", "učitelj", "advokat", "kuhar"],
                "correct_answer": 2,
                "explanation": "Vaga pravde (⚖️) simbolizira advokata (lawyer / attorney)."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Šta znači 'She is a police officer'?",
                "options": [
                    "Ona je policajka.",
                    "Ona je prodavačica.",
                    "Ona je vozačica.",
                    "Ona je kuharica."
                ],
                "correct_answer": 0,
                "explanation": "'Policajka' = female police officer. Muški oblik: 'policajac'."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Koji je ŽENSKI oblik od 'student'?",
                "options": ["studentka", "studenta", "studenti", "studentica"],
                "correct_answer": 3,
                "explanation": "Ženski oblik se gradi dodavanjem nastavka '-ica': student → studentica."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "A", "text": "Gdje radiš?", "translation": "Where do you work?"},
                    {"speaker": "B", "text": "Radim u školi kao učiteljica.", "translation": "I work in a school as a teacher."},
                    {"speaker": "A", "text": "Sviđa li ti se posao?", "translation": "Do you like the job?"},
                    {"speaker": "B", "text": "Da, jako volim raditi s djecom.", "translation": "Yes, I really love working with children."}
                ],
                "question": "Gdje radi osoba B?",
                "options": ["U bolnici", "U restoranu", "U banci", "U školi"],
                "correct_answer": 3,
                "explanation": "Osoba B kaže: 'Radim u školi kao učiteljica.'"
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "On radim u banci svaki dan.",
                    "On radimo u banci svaki dan.",
                    "On radi u banci svaki dan.",
                    "On rade u banci svaki dan."
                ],
                "correct_answer": 2,
                "explanation": "'On' (he) + glagol 3. lica jednine = 'radi'. 'On radi svaki dan.'"
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "Kuhar radi u _____.",
                "question": "Popunite prazninu: 'Kuhar radi u _____.'",
                "options": ["bolnici", "školi", "policijskoj stanici", "restoranu"],
                "correct_answer": 3,
                "explanation": "Kuhar (chef/cook) radi u restoranu."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Advokat' znači isto što i 'lawyer' na engleskom.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 0,
                "explanation": "'Advokat' = lawyer/attorney. Tačno!"
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Gdje radi učitelj?",
                "options": ["U bolnici", "U restoranu", "U banci", "U školi"],
                "correct_answer": 3,
                "explanation": "Učitelj (teacher) radi u školi."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 11: Vrijeme i Sat
    # ─────────────────────────────────────────────
    {
        "lesson_id": 11,
        "lesson_title": "Vrijeme i Sat",
        "questions": [
            {
                "id": 1,
                "question_type": "vocabulary",
                "question": "Šta znači 'pola pet' u bosanskom sistemu vremena?",
                "options": ["5:30", "4:00", "4:30", "5:00"],
                "correct_answer": 2,
                "explanation": "'Pola pet' = half (way) to five = 4:30. Bosanski sistem broji prema sljedećem satu."
            },
            {
                "id": 2,
                "question_type": "audio",
                "audio_text": "Koliko je sati?",
                "question": "Slušajte i izaberite prijevod:",
                "options": [
                    "How many hours?",
                    "What time is it?",
                    "What day is it?",
                    "How long does it take?"
                ],
                "correct_answer": 1,
                "explanation": "'Koliko je sati?' = What time is it? Standardno pitanje za sat."
            },
            {
                "id": 3,
                "question_type": "image",
                "image_emoji": "🕙",
                "question": "Ovaj sat pokazuje deset sati. Kako to kažemo na bosanskom?",
                "options": ["Deset i pol", "Devet sati", "Deset sati", "Jedanaest sati"],
                "correct_answer": 2,
                "explanation": "🕙 = 10:00 = deset sati."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Kako se kaže 'at 8 in the morning' na bosanskom?",
                "options": [
                    "u osam sati uvečer",
                    "u osam sati ujutro",
                    "u osam popodne",
                    "u osam noću"
                ],
                "correct_answer": 1,
                "explanation": "'Ujutro' = in the morning. 'U osam sati ujutro' = at 8 in the morning."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Koji prijedlog koristimo: 'Sastanak je _____ pet sati'?",
                "options": ["na", "za", "od", "u"],
                "correct_answer": 3,
                "explanation": "'U pet sati' = at five o'clock. Prijedlog 'u' koristimo za sat."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "A", "text": "Oprostite, koliko je sati?", "translation": "Excuse me, what time is it?"},
                    {"speaker": "B", "text": "Četvrt do deset.", "translation": "Quarter to ten."},
                    {"speaker": "A", "text": "Hvala lijepa!", "translation": "Thank you very much!"},
                    {"speaker": "B", "text": "Nema na čemu.", "translation": "You're welcome."}
                ],
                "question": "Koliko je sati prema osobi B?",
                "options": ["9:15", "9:45", "10:15", "10:45"],
                "correct_answer": 1,
                "explanation": "'Četvrt do deset' = quarter to ten = 9:45."
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "Autobus dolaze svaki sat.",
                    "Autobusi dolazi svaki sat.",
                    "Autobus dolazi svaki sat.",
                    "Autobusom dolaze svaki sat."
                ],
                "correct_answer": 2,
                "explanation": "'Autobus' (singular) + 'dolazi' (3. lice jednine) = 'Autobus dolazi svaki sat.'"
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "Deset sati ujutro se piše _____ u 24-satnom sistemu.",
                "question": "Popunite prazninu: 'Deset sati ujutro = _____ u 24h sistemu.'",
                "options": ["22:00", "12:00", "10:00", "02:00"],
                "correct_answer": 2,
                "explanation": "10 sati ujutro = 10:00 u 24-satnom sistemu."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Pola šest' znači 6:30 na bosanskom.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 1,
                "explanation": "'Pola šest' = half (way) to six = 5:30, NE 6:30. Netačno!"
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Šta znači 'Kasnim'?",
                "options": ["I am early", "I am on time", "I am ready", "I am late"],
                "correct_answer": 3,
                "explanation": "'Kasnim' = I am late. 'Kasniti' = to be late."
            }
        ]
    },

    # ─────────────────────────────────────────────
    # LEKCIJA 12: Svakodnevne Fraze
    # ─────────────────────────────────────────────
    {
        "lesson_id": 12,
        "lesson_title": "Svakodnevne Fraze",
        "questions": [
            {
                "id": 1,
                "question_type": "audio",
                "audio_text": "Možete li mi pomoći?",
                "question": "Slušajte i izaberite prijevod:",
                "options": [
                    "Can you speak Bosnian?",
                    "Where is the bus station?",
                    "Can you help me?",
                    "How much does it cost?"
                ],
                "correct_answer": 2,
                "explanation": "'Možete li mi pomoći?' = Can you help me? (formalno)"
            },
            {
                "id": 2,
                "question_type": "image",
                "image_emoji": "🚌",
                "question": "Kako biste pitali za ovu vrstu prevoza?",
                "options": [
                    "Gdje je aerodrom?",
                    "Gdje je autobusna stanica?",
                    "Gdje je taksi?",
                    "Gdje je voz?"
                ],
                "correct_answer": 1,
                "explanation": "Autobus (🚌) → 'autobusna stanica' = bus station."
            },
            {
                "id": 3,
                "question_type": "vocabulary",
                "question": "Šta znači fraza 'Govori li ko engleski ovdje?'",
                "options": [
                    "Do you speak Bosnian here?",
                    "Can you translate for me?",
                    "Does anyone here speak English?",
                    "Do you understand me?"
                ],
                "correct_answer": 2,
                "explanation": "'Govori li ko' = Does anyone speak. 'Ko' = anyone/someone."
            },
            {
                "id": 4,
                "question_type": "translation",
                "question": "Kako se kaže 'How much does this cost?' na bosanskom?",
                "options": [
                    "Šta ovo znači?",
                    "Imate li ovo?",
                    "Gdje mogu kupiti ovo?",
                    "Koliko ovo košta?"
                ],
                "correct_answer": 3,
                "explanation": "'Koliko košta?' = How much does it cost? 'Koliko' = how much."
            },
            {
                "id": 5,
                "question_type": "grammar",
                "question": "Koja je pravilna forma molbe: 'Give me water, please'?",
                "options": [
                    "Daj mi voda, molim.",
                    "Daj mene vodu, molim.",
                    "Daj mi vodu, molim.",
                    "Dajem mi vodu, molim."
                ],
                "correct_answer": 2,
                "explanation": "'Daj mi vodu' - 'vodu' je akuzativ od 'voda'. 'Mi' = indirect object (dative)."
            },
            {
                "id": 6,
                "question_type": "dialogue",
                "dialogue": [
                    {"speaker": "Turista", "text": "Oprostite, govorite li engleski?", "translation": "Excuse me, do you speak English?"},
                    {"speaker": "Prolaznik", "text": "Da, malo. Kako mogu pomoći?", "translation": "Yes, a little. How can I help?"},
                    {"speaker": "Turista", "text": "Gdje je najbliža banka?", "translation": "Where is the nearest bank?"},
                    {"speaker": "Prolaznik", "text": "Idite ravno, zatim skrenite lijevo. Banka je na uglu.", "translation": "Go straight, then turn left. The bank is on the corner."}
                ],
                "question": "Šta turista traži?",
                "options": ["Restoran", "Hotel", "Autobusku stanicu", "Banku"],
                "correct_answer": 3,
                "explanation": "Turista pita: 'Gdje je najbliža banka?'"
            },
            {
                "id": 7,
                "question_type": "find_error",
                "question": "Koja rečenica je GRAMATIČKI TAČNA?",
                "options": [
                    "Ne razumijeti vas.",
                    "Ne razumijem vas.",
                    "Vas ne razumije.",
                    "Ne razumijemo vam."
                ],
                "correct_answer": 1,
                "explanation": "'Ne razumijem vas' = I don't understand you. 1. lice jednine + akuzativ 'vas'."
            },
            {
                "id": 8,
                "question_type": "fill_blank",
                "sentence": "_____, ne razumijem. Možete li ponoviti?",
                "question": "Popunite prazninu: '_____, ne razumijem. Možete li ponoviti?'",
                "options": ["Hvala", "Molim", "Dobar dan", "Žao mi je"],
                "correct_answer": 1,
                "explanation": "'Molim?' = Sorry? / Pardon? - koristimo kada nešto nismo razumjeli."
            },
            {
                "id": 9,
                "question_type": "true_false",
                "question": "Tačno ili netačno: 'Nema na čemu' je odgovor na 'Hvala'.",
                "options": ["Tačno", "Netačno"],
                "correct_answer": 0,
                "explanation": "'Nema na čemu' = You're welcome / Don't mention it. Odgovor na 'Hvala'. Tačno!"
            },
            {
                "id": 10,
                "question_type": "vocabulary",
                "question": "Šta znači 'Dobro jutro'?",
                "options": ["Good evening", "Good afternoon", "Good night", "Good morning"],
                "correct_answer": 3,
                "explanation": "'Dobro jutro' = Good morning. 'Jutro' = morning."
            }
        ]
    }
]
