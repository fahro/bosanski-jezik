# Writing exercise sentences for audio generation
# Each lesson has 10 Bosnian sentences for the "Piši" (Writing) exercise

WRITING_EXERCISES = {
    1: [  # Greetings
        "Zdravo, kako si?",
        "Ja sam dobro, hvala.",
        "Drago mi je.",
        "Kako se zoveš?",
        "Ja se zovem Ahmed.",
        "Odakle si?",
        "Ja sam iz Bosne.",
        "Dobro jutro!",
        "Doviđenja!",
        "Vidimo se sutra."
    ],
    2: [  # Numbers
        "Imam jednog brata.",
        "Ona ima dvije sestre.",
        "Ovo je moj prvi dan.",
        "Kupio sam tri jabuke.",
        "Ima pet učenika.",
        "Ovo je druga lekcija.",
        "Imam dvadeset godina.",
        "Jednu kafu, molim.",
        "Imam četvero djece.",
        "Ovo je treći put."
    ],
    3: [  # Colors
        "Zastava je plava i žuta.",
        "Bijela džamija je lijepa.",
        "Bosanska kafa je crna.",
        "Crveni ćilim je tradicionalan.",
        "Nebo je plavo.",
        "Volim zelenu boju.",
        "Stari Most je bijel.",
        "Ona ima crnu kosu.",
        "Žuto sunce sija.",
        "Zelena rijeka je hladna."
    ],
    4: [  # Family
        "Moja majka pravi pitu.",
        "Gdje je tvoj otac?",
        "Njegova sestra je mlada.",
        "Naša nana živi u Zenici.",
        "Ovo je njeno dijete.",
        "Moj djed čita novine.",
        "Njena kći je studentica.",
        "Naša porodica je velika.",
        "Moj brat je visok.",
        "Njihov sin radi u Sarajevu."
    ],
    5: [  # Days of the Week
        "Koji je danas dan?",
        "Danas je petak.",
        "Sutra je subota.",
        "Jučer sam bio kod nane.",
        "U subotu idem na pijacu.",
        "U ponedjeljak radim.",
        "Nedjelja je dan odmora.",
        "Srijeda dolazi poslije utorka.",
        "Petak je prije subote.",
        "Volim vikende."
    ],
    6: [  # Months and Seasons
        "Kada je tvoj rođendan?",
        "Moj rođendan je u maju.",
        "U januaru pada snijeg.",
        "Ljeto je toplo.",
        "Proljeće počinje u martu.",
        "U julu idemo na more.",
        "Zima je hladna.",
        "U jesen lišće pada.",
        "Decembar je hladan.",
        "Volim proljeće."
    ],
    7: [  # Food and Drink
        "Volim ćevape sa lukom.",
        "Ne volim ribu.",
        "Želim jednu bosansku kafu, molim.",
        "Koliko košta burek?",
        "Račun, molim.",
        "Šta želite piti?",
        "Gladan sam.",
        "Hrana je ukusna.",
        "Mogu li dobiti vodu?",
        "Želim pitu sa sirom."
    ],
    8: [  # House and Apartment
        "Živim u stanu u Sarajevu.",
        "Knjiga je na stolu.",
        "Mačka je ispod kreveta.",
        "Slika je iznad vrata.",
        "Kupatilo je pored spavaće sobe.",
        "Gdje živiš?",
        "Živim u velikoj kući.",
        "Vrt je iza kuće.",
        "Stolica je između stola i zida.",
        "Kuhinja je u mom stanu."
    ],
    9: [  # Body and Health
        "Boli me glava.",
        "Bole me oči.",
        "Bolestan sam danas.",
        "Kako se osjećate?",
        "Umoran sam.",
        "Boli me stomak.",
        "Trebam odmor.",
        "Loše sam.",
        "Boli me grlo.",
        "Osjećam se dobro."
    ],
    10: [  # Jobs and Work
        "Radim kao učitelj.",
        "Ona je doktorica.",
        "Moj otac radi u bolnici.",
        "Čime se baviš?",
        "Radim u školi.",
        "On je inženjer.",
        "Moja majka je kuharica.",
        "Ja sam student.",
        "Gdje radiš?",
        "Ona radi u kancelariji."
    ],
    11: [  # Time
        "Koliko je sati?",
        "Sada je osam sati.",
        "Pola deset je.",
        "Film počinje u pet sati.",
        "Ujutro pijem kafu.",
        "Uveče gledam TV.",
        "Kasno je.",
        "Rano ustajem.",
        "U podne ručam.",
        "Noću spavam."
    ],
    12: [  # Common Phrases
        "Izvinite, ne razumijem.",
        "Polako, molim.",
        "Govorite li engleski?",
        "Nema problema.",
        "Hvala vam puno.",
        "Drago mi je.",
        "Žao mi je.",
        "Naravno.",
        "Možete li mi pomoći?",
        "Gdje je banka?"
    ]
}

# Get all sentences as a flat list
def get_all_writing_sentences():
    """Return all writing exercise sentences as a list."""
    sentences = []
    for lesson_sentences in WRITING_EXERCISES.values():
        sentences.extend(lesson_sentences)
    return sentences
