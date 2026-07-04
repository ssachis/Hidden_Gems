export const MOCK_DESTINATIONS = {
  kyoto: {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    coordinates: "35.0116° N, 135.7681° E",
    description: "The historical and cultural heart of Japan, famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.",
    culturalDensity: 94,
    sentimentScore: 92,
    categoryStats: [
      { name: "Temples & Shrines", value: 45 },
      { name: "Traditional Crafts", value: 20 },
      { name: "Teahouses & Culinary", value: 25 },
      { name: "Hidden Gardens", value: 10 }
    ],
    guideProfile: {
      name: "Sayaka",
      title: "Tea Master & Cultural Historian",
      avatar: "🍵",
      greeting: "Konnichiwa! I am Sayaka. I was born in the historic Gion district, and I have dedicated my life to the practice of Chado (The Way of Tea). I can guide you through the subtle etiquette of shrines, the history of Zen gardens, and the best places to find authentic traditional artisans. What would you like to explore?"
    },
    story: {
      title: "Whispers of the Bamboo Grove",
      narration: "As dusk falls over Kyoto, the stone lanterns of Yasaka Shrine flicker to life. Walking down the narrow streets of Higashiyama, the faint scent of sandalwood incense drifts from ancient eaves. Kyoto was spared from destruction during World War II, preserving over a millennium of imperial history. Here, time moves differently. In the quiet gardens of Ryoan-ji, dry sand raked into waves represents the infinite ocean, inviting visitors to look inward. To visit Kyoto is not to check sights off a list, but to learn the art of appreciation, mindfulness, and the beauty of impermanence (Mono no Aware).",
      audioLength: "1m 45s"
    },
    attractions: [
      {
        fsq_id: "kyoto_1",
        name: "Kinkaku-ji (The Golden Pavilion)",
        category: "Culture & Heritage",
        rating: 9.3,
        reviewCount: 1420,
        description: "A Zen Buddhist temple whose top two floors are completely covered in gold leaf. It stands elegantly overlooking a mirroring pond, reflecting centuries of Muromachi period design.",
        address: "1 Kinkakujicho, Kita Ward, Kyoto",
        is_hidden_gem: false
      },
      {
        fsq_id: "kyoto_2",
        name: "Fushimi Inari-taisha",
        category: "Culture & Heritage",
        rating: 9.5,
        reviewCount: 2850,
        description: "The head shrine of the god Inari, famous for its path of over 10,000 vibrant vermilion torii gates winding up Mount Inari.",
        address: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
        is_hidden_gem: false
      },
      {
        fsq_id: "kyoto_3",
        name: "Gio-ji Temple",
        category: "Hidden Gems",
        rating: 8.9,
        reviewCount: 74,
        description: "A tiny, secluded temple known for its lush moss garden and tall bamboo grove. Offering a quiet, meditative space far from the crowds of nearby Arashiyama.",
        address: "32 Sagatoriimoto Kozakacho, Ukyo Ward, Kyoto",
        is_hidden_gem: true
      },
      {
        fsq_id: "kyoto_4",
        name: "Otagi Nenbutsu-ji",
        category: "Hidden Gems",
        rating: 9.0,
        reviewCount: 92,
        description: "An enchanting, off-the-beaten-path temple featuring 1,200 whimsical stone statues of Rakan (disciples of Buddha), each displaying a unique, humorous facial expression.",
        address: "2-5 Sagatoriimoto Fukutanichicho, Ukyo Ward, Kyoto",
        is_hidden_gem: true
      },
      {
        fsq_id: "kyoto_5",
        name: "Nishiki Market",
        category: "Culinary & Dining",
        rating: 9.1,
        reviewCount: 890,
        description: "A narrow five-block shopping street lined by more than a hundred stalls and shops, affectionately known as 'Kyoto's Kitchen'.",
        address: "Nakagyo Ward, Kyoto",
        is_hidden_gem: false
      },
      {
        fsq_id: "kyoto_6",
        name: "Gion Karyo",
        category: "Culinary & Dining",
        rating: 9.2,
        reviewCount: 110,
        description: "An authentic Kaiseki dining experience housed in a renovated historic townhouse in Gion, offering seasonal, multi-course masterpieces.",
        address: "570-235 Gionmachi Minamigawa, Higashiyama Ward, Kyoto",
        is_hidden_gem: true
      }
    ],
    events: [
      {
        id: "kyoto_ev_1",
        title: "Gion Matsuri Festival",
        date: "July 17 (Annual)",
        type: "Traditional Festival",
        description: "One of Japan's most famous festivals, culminating in a spectacular parade of massive wooden floats (Yamaboko) decorated with exquisite textiles."
      },
      {
        id: "kyoto_ev_2",
        title: "Traditional Tea Ceremony Workshop",
        date: "Daily Sessions",
        type: "Cultural Experience",
        description: "Step into a 200-year-old teahouse. Learn the core principles of harmony, respect, purity, and tranquility under a licensed Urasenke instructor."
      },
      {
        id: "kyoto_ev_3",
        title: "Arashiyama Hanatouro (Lantern Festival)",
        date: "December (Seasonal)",
        type: "Light Event",
        description: "Walk through the bamboo forest illuminated by thousands of lanterns, casting an otherworldly, magical glow across the valley."
      }
    ]
  },
  rome: {
    id: "rome",
    name: "Rome",
    country: "Italy",
    coordinates: "41.9028° N, 12.4964° E",
    description: "The Eternal City, boasting nearly 3,000 years of globally influential art, architecture, and culture. Ruins like the Colosseum and the Forum evoke the power of the ancient Roman Empire.",
    culturalDensity: 96,
    sentimentScore: 89,
    categoryStats: [
      { name: "Ancient Ruins", value: 35 },
      { name: "Renaissance Art", value: 30 },
      { name: "Trattorias & Bakeries", value: 20 },
      { name: "Baroque Plazas", value: 15 }
    ],
    guideProfile: {
      name: "Matteo",
      title: "Archaeologist & Culinary Enthusiast",
      avatar: "🏛️",
      greeting: "Ciao! I am Matteo, an archaeologist who loves sharing Rome's layers of history, from the underground pagan temples to the best Roman street food like Suppli. Let me help you find spots tourists walk right past. What are you looking to discover today?"
    },
    story: {
      title: "Layers of the Eternal City",
      narration: "Stand on the cobblestones of the Piazza Navona and you are standing on the outline of Emperor Domitian's ancient athletic stadium. Rome is a living, breathing history book where the ancient, medieval, renaissance, and modern collide on every corner. In the quiet neighborhood of Testaccio, a mountain made entirely of discarded ancient Roman oil amphorae tells the story of an empire's global trade. Rome reminds us that civilizations rise and fall, but the joy of life—enjoying a slow espresso at a corner bar, or watching the sunset paint the Roman Forum in gold—remains eternal.",
      audioLength: "1m 38s"
    },
    attractions: [
      {
        fsq_id: "rome_1",
        name: "The Colosseum",
        category: "Culture & Heritage",
        rating: 9.6,
        reviewCount: 3100,
        description: "The iconic double-theater built in the Roman Empire, which held up to 80,000 spectators for gladiatorial battles and theatrical dramas.",
        address: "Piazza del Colosseo, 1, Rome",
        is_hidden_gem: false
      },
      {
        fsq_id: "rome_2",
        name: "The Pantheon",
        category: "Culture & Heritage",
        rating: 9.7,
        reviewCount: 2450,
        description: "A former Roman temple, now a church, renowned for its massive concrete dome and central open oculus, a masterpiece of ancient engineering.",
        address: "Piazza della Rotonda, Rome",
        is_hidden_gem: false
      },
      {
        fsq_id: "rome_3",
        name: "Basilica of San Clemente",
        category: "Hidden Gems",
        rating: 9.2,
        reviewCount: 180,
        description: "A three-tiered complex where you start in a 12th-century basilica, descend into a 4th-century church, and finally explore a 1st-century pagan Mithraic temple.",
        address: "Via Labicana, 95, Rome",
        is_hidden_gem: true
      },
      {
        fsq_id: "rome_4",
        name: "The Protestant Cemetery & Pyramid",
        category: "Hidden Gems",
        rating: 8.8,
        reviewCount: 65,
        description: "A peaceful sanctuary of cypress trees and marble tombs containing poets Keats and Shelley, set right beside an ancient 36 BC marble pyramid.",
        address: "Via Caio Cestio, 6, Rome",
        is_hidden_gem: true
      },
      {
        fsq_id: "rome_5",
        name: "Bonci Pizzarium",
        category: "Culinary & Dining",
        rating: 9.3,
        reviewCount: 950,
        description: "Gabriele Bonci's legendary pizzeria offering artisanal Pizza al Taglio (pizza by the slice) with innovative, rotating seasonal toppings.",
        address: "Via della Meloria, 43, Rome",
        is_hidden_gem: false
      },
      {
        fsq_id: "rome_6",
        name: "Da Enzo al 29",
        category: "Culinary & Dining",
        rating: 9.1,
        reviewCount: 420,
        description: "A tiny Trastevere trattoria that serves world-class Roman classics: Cacio e Pepe, Carbonara, and artichokes in a humble, lively setting.",
        address: "Via dei Vascellari, 29, Rome",
        is_hidden_gem: true
      }
    ],
    events: [
      {
        id: "rome_ev_1",
        title: "Festa de Noantri",
        date: "Mid-July (Annual)",
        type: "Religious Festival",
        description: "A Trastevere festival celebrating the Madonna of Carmine with street processions, live music, food stalls, and historic costumes."
      },
      {
        id: "rome_ev_2",
        title: "Roman Pasta Making Masterclass",
        date: "Tuesdays & Saturdays",
        type: "Culinary Workshop",
        description: "Learn to source local guanciale and master the emulsion technique behind a perfect Carbonara from a native Roman chef."
      },
      {
        id: "rome_ev_3",
        title: "Romaeuropa Festival",
        date: "September - November",
        type: "Arts Festival",
        description: "A major contemporary arts, dance, theater, and music festival hosted in historic venues across Rome."
      }
    ]
  },
  cairo: {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    coordinates: "30.0444° N, 31.2357° E",
    description: "The Cradle of Civilizations, Cairo is a city where history goes back millennia. Located on the Nile, it features massive Pharaonic structures alongside historic mosques and ancient markets.",
    culturalDensity: 98,
    sentimentScore: 87,
    categoryStats: [
      { name: "Pharaonic Monuments", value: 40 },
      { name: "Islamic Architecture", value: 30 },
      { name: "Bazaars & Souks", value: 18 },
      { name: "Nile Culture", value: 12 }
    ],
    guideProfile: {
      name: "Tarek",
      title: "Egyptologist & Storyteller",
      avatar: "🕌",
      greeting: "Salam! I am Tarek, your companion for navigating Cairo's vast history, from the Great Pyramids to the medieval alleyways of Al-Muizz Street. Let me share stories of sultanates, ancient scribes, and where to find the best Koshary in Cairo! How can I help you?"
    },
    story: {
      title: "Dust and Gold on the Nile",
      narration: "Stand on the citadel hills of Cairo at dusk and listen to the call to prayer echoing from a thousand minarets across the sandy horizon. Cairo is a sensory symphony—a place where Pharaonic grandeur meets Islamic art and Coptic history. The Nile flows through it all, the lifeblood of this desert capital for thousands of years. Inside the chaotic, glittering maze of Khan el-Khalili bazaar, artisans still hammer copper and blend perfume oils using techniques handed down through generations. To understand Cairo is to embrace the warmth of its people, the grandeur of its dust, and the ancient gold that never fades.",
      audioLength: "1m 52s"
    },
    attractions: [
      {
        fsq_id: "cairo_1",
        name: "Great Pyramids of Giza",
        category: "Culture & Heritage",
        rating: 9.8,
        reviewCount: 4200,
        description: "The last remaining wonder of the ancient world, featuring the pyramids of Khufu, Khafre, and Menkaure, guarded by the Great Sphinx.",
        address: "Al Haram, Giza Governorate, Greater Cairo",
        is_hidden_gem: false
      },
      {
        fsq_id: "cairo_2",
        name: "The Egyptian Museum",
        category: "Culture & Heritage",
        rating: 9.4,
        reviewCount: 1950,
        description: "A treasure trove of antiquities in Tahrir Square, containing thousands of ancient Egyptian artifacts, statues, and royal treasures.",
        address: "Tahrir Square, Cairo",
        is_hidden_gem: false
      },
      {
        fsq_id: "cairo_3",
        name: "Mosque-Madrasa of Sultan Hassan",
        category: "Hidden Gems",
        rating: 9.3,
        reviewCount: 180,
        description: "A massive, breathtaking Islamic monument built in 1356, famous for its colossal walls and pioneering Mamluk architecture.",
        address: "El-Darb el-Ahmar, Cairo",
        is_hidden_gem: true
      },
      {
        fsq_id: "cairo_4",
        name: "Coptic Cairo & The Hanging Church",
        category: "Hidden Gems",
        rating: 9.1,
        reviewCount: 140,
        description: "A quiet, historic enclave featuring narrow stone streets and the ancient Hanging Church built over the gatehouse of a Roman fortress.",
        address: "Kom Ghorab, Old Cairo, Cairo",
        is_hidden_gem: true
      },
      {
        fsq_id: "cairo_5",
        name: "Khan el-Khalili Bazaar",
        category: "Culinary & Dining",
        rating: 9.2,
        reviewCount: 1100,
        description: "A vibrant historic market dating back to 1382. Famous for spices, lanterns, perfumes, silver, and traditional coffeehouses.",
        address: "El-Gamaleya, Cairo",
        is_hidden_gem: false
      },
      {
        fsq_id: "cairo_6",
        name: "Koshary Abou Tarek",
        category: "Culinary & Dining",
        rating: 9.0,
        reviewCount: 380,
        description: "A multi-story Cairo institution dedicated to Koshary—Egypt's national dish of pasta, rice, lentils, chickpeas, crispy onions, and tomato sauce.",
        address: "Champollion Road, Downtown Cairo",
        is_hidden_gem: true
      }
    ],
    events: [
      {
        id: "cairo_ev_1",
        title: "Moulid of Sayyida Zeinab",
        date: "Varies (Annual)",
        type: "Traditional Celebration",
        description: "A massive Sufi festival with street lanterns, traditional chanting (Inshad), and distribution of food to pilgrims."
      },
      {
        id: "cairo_ev_2",
        title: "Traditional Tannoura Dance Show",
        date: "Mondays & Wednesdays",
        type: "Performance",
        description: "Watch mystical Sufi whirlers in colorful, heavy skirts perform a rhythmic, hypnotic dance at the historic Wekalet El Ghouri."
      },
      {
        id: "cairo_ev_3",
        title: "Cairo International Film Festival",
        date: "November (Annual)",
        type: "Film Festival",
        description: "The oldest and only internationally accredited annual film festival in the Arab world and Africa."
      }
    ]
  },
  cusco: {
    id: "cusco",
    name: "Cusco",
    country: "Peru",
    coordinates: "13.5319° S, 71.9675° W",
    description: "The historic capital of the Inca Empire. High in the Andes, Cusco is a beautiful blend of colossal dry-stone Inca walls and colonial Spanish mansions.",
    culturalDensity: 92,
    sentimentScore: 94,
    categoryStats: [
      { name: "Inca Ruins", value: 45 },
      { name: "Andean Crafts", value: 25 },
      { name: "Novoandina Culinary", value: 18 },
      { name: "Colonial Heritage", value: 12 }
    ],
    guideProfile: {
      name: "Nesta",
      title: "Quechua Guide & Weaver",
      avatar: "🦙",
      greeting: "Allianllachu! (Hello!) I am Nesta, a descendant of the Quechua-speaking Inca people. I love explaining the cosmic geometry of Inca masonry and the traditional meanings behind our hand-woven textiles. Let's explore the spirits of the mountains (Apus) and Cusco's ancient heart. Ready?"
    },
    story: {
      title: "The Navel of the World",
      narration: "Walking through Cusco, touch the massive stone blocks of Loreto Alley—each stone carved with perfect precision to interlock without mortar, surviving centuries of massive earthquakes. Cusco, which means 'navel' in Quechua, was the center of an empire that stretched across South America. When the Spanish conquered it, they built their churches directly on top of the golden sun temples. Today, the scent of burning Palo Santo wood fills the air, and Quechua women in colorful skirts walk alpacas down historic streets. In Cusco, the spirits of the mountains and the ancient past are not history—they are alive.",
      audioLength: "1m 40s"
    },
    attractions: [
      {
        fsq_id: "cusco_1",
        name: "Saksaywaman",
        category: "Culture & Heritage",
        rating: 9.4,
        reviewCount: 1650,
        description: "An Inca fortress complex overlooking Cusco. Constructed with colossal hand-carved limestone blocks fitting tightly together without mortar.",
        address: "Don Bosco S/N, Cusco",
        is_hidden_gem: false
      },
      {
        fsq_id: "cusco_2",
        name: "Qorikancha (Temple of the Sun)",
        category: "Culture & Heritage",
        rating: 9.3,
        reviewCount: 980,
        description: "The most important temple in the Inca Empire, dedicated to the Sun God Inti. The Spanish Santo Domingo Convent was later built over its ruins.",
        address: "Santo Domingo s/n, Cusco",
        is_hidden_gem: false
      },
      {
        fsq_id: "cusco_3",
        name: "San Pedro Cemetery & Temple of the Moon",
        category: "Hidden Gems",
        rating: 8.9,
        reviewCount: 52,
        description: "A mystical Inca ceremonial cave located in the hills above Cusco, featuring altars carved directly into rock faces for lunar rituals.",
        address: "Hills of Cusco, Cusco",
        is_hidden_gem: true
      },
      {
        fsq_id: "cusco_4",
        name: "San Blas Artisan Quarter",
        category: "Hidden Gems",
        rating: 9.1,
        reviewCount: 190,
        description: "A charming hillside neighborhood of white houses, blue doors, and steep cobblestone alleys lined with local pottery workshops and woodcarvers.",
        address: "Barrio de San Blas, Cusco",
        is_hidden_gem: true
      },
      {
        fsq_id: "cusco_5",
        name: "Cicciolina",
        category: "Culinary & Dining",
        rating: 9.2,
        reviewCount: 510,
        description: "An upscale bistro housed in an old colonial mansion, serving Mediterranean-Andean fusion cuisine using local ingredients like quinoa and alpaca.",
        address: "Calle Triunfo 393, Cusco",
        is_hidden_gem: false
      },
      {
        fsq_id: "cusco_6",
        name: "Chicha by Gastón Acurio",
        category: "Culinary & Dining",
        rating: 9.1,
        reviewCount: 220,
        description: "Renowned chef Gastón Acurio's restaurant celebrating traditional Andean recipes and ingredients with modern culinary techniques.",
        address: "Plaza Regocijo 261, Cusco",
        is_hidden_gem: true
      }
    ],
    events: [
      {
        id: "cusco_ev_1",
        title: "Inti Raymi (Festival of the Sun)",
        date: "June 24 (Annual)",
        type: "Inca Re-enactment",
        description: "A spectacular celebration at Saksaywaman celebrating the winter solstice and the Sun God, with thousands of performers in traditional Inca costume."
      },
      {
        id: "cusco_ev_2",
        title: "Andean Textile Weaving Demonstration",
        date: "Wednesdays & Fridays",
        type: "Cultural Experience",
        description: "Learn how wool is naturally dyed using cactus insects and native leaves, and observe backstrap weaving techniques passed down for generations."
      },
      {
        id: "cusco_ev_3",
        title: "Santurantikuy Fair",
        date: "December 24 (Annual)",
        type: "Artisanal Market",
        description: "A massive, day-long Christmas market in the Plaza de Armas featuring thousands of artisans selling handmade clay figurines and wood crafts."
      }
    ]
  },
  newyork: {
    id: "newyork",
    name: "New York City",
    country: "United States",
    coordinates: "40.7128° N, 74.0060° W",
    description: "A global metropolis composed of five boroughs situated where the Hudson River meets the Atlantic Ocean. Known for art, theater, fashion, finance, and diverse immigrant heritage.",
    culturalDensity: 88,
    sentimentScore: 91,
    categoryStats: [
      { name: "Museums & Galleries", value: 38 },
      { name: "Immigrant Enclaves", value: 32 },
      { name: "Broadway & Music", value: 20 },
      { name: "Historical Landmarks", value: 10 }
    ],
    guideProfile: {
      name: "Marcus",
      title: "Urban Historian & Jazz Musician",
      avatar: "🎷",
      greeting: "Hey! I'm Marcus, a historian and jazz saxophonist. NYC is a mosaic of hundreds of cultures. I can show you where the Harlem Renaissance took shape, the best dim sum in Queens, or the quietest reading room in the Public Library. Let's explore! What's your vibe?"
    },
    story: {
      title: "The Modern Mosaic",
      narration: "Stand under the grand arches of Grand Central Terminal and watch the sea of people rushing beneath the ceiling painted with constellations. New York City is an engine of constant reinvention, built by immigrants who arrived with little more than dreams. From the tenements of the Lower East Side to the jazz clubs of Harlem, every block tells a story of cultural collisions. Here, cultures don't blend into a melting pot; they sit side-by-side like a vibrant mosaic, each retaining its unique flavor, spice, and rhythm. To experience New York is to find your own tempo inside the magnificent, creative roar of the city.",
      audioLength: "1m 35s"
    },
    attractions: [
      {
        fsq_id: "nyc_1",
        name: "The Metropolitan Museum of Art",
        category: "Culture & Heritage",
        rating: 9.6,
        reviewCount: 3500,
        description: "One of the world's greatest art museums, displaying over two million works spanning five thousand years of world culture.",
        address: "1000 5th Ave, New York",
        is_hidden_gem: false
      },
      {
        fsq_id: "nyc_2",
        name: "Tenement Museum",
        category: "Culture & Heritage",
        rating: 9.4,
        reviewCount: 850,
        description: "A restored historic tenement building on the Lower East Side that tells the real stories of immigrant families who lived there in the 19th and 20th centuries.",
        address: "97 Orchard St, New York",
        is_hidden_gem: false
      },
      {
        fsq_id: "nyc_3",
        name: "Green-Wood Cemetery",
        category: "Hidden Gems",
        rating: 9.2,
        reviewCount: 140,
        description: "A stunning 478-acre historic rural cemetery in Brooklyn, featuring gothic gates, rolling hills, catacombs, and beautiful views of the Manhattan skyline.",
        address: "500 25th St, Brooklyn",
        is_hidden_gem: true
      },
      {
        fsq_id: "nyc_4",
        name: "The Morgan Library & Museum",
        category: "Hidden Gems",
        rating: 9.1,
        reviewCount: 110,
        description: "Financier Pierpont Morgan's breathtaking private library, featuring towering triple-height walnut bookshelves, stained glass, and illuminated manuscripts.",
        address: "225 Madison Ave, New York",
        is_hidden_gem: true
      },
      {
        fsq_id: "nyc_5",
        name: "Katz's Delicatessen",
        category: "Culinary & Dining",
        rating: 9.3,
        reviewCount: 2200,
        description: "The iconic, historic Jewish deli operating since 1888, famous for its legendary hand-carved pastrami sandwiches and bustling atmosphere.",
        address: "205 E Houston St, New York",
        is_hidden_gem: false
      },
      {
        fsq_id: "nyc_6",
        name: "Nom Wah Tea Parlor",
        category: "Culinary & Dining",
        rating: 9.0,
        reviewCount: 310,
        description: "Chinatown's oldest operating dim sum parlor, tucked away on curved Doyers Street, serving classic dumplings and tea since 1920.",
        address: "13 Doyers St, New York",
        is_hidden_gem: true
      }
    ],
    events: [
      {
        id: "nyc_ev_1",
        title: "San Gennaro Festival",
        date: "September (Annual)",
        type: "Cultural Street Fair",
        description: "An 11-day salute to the Patron Saint of Naples, filling Little Italy with cannoli eating contests, parades, and street food stalls."
      },
      {
        id: "nyc_ev_2",
        title: "Harlem Jazz History Tour & Jam Session",
        date: "Thursdays",
        type: "Music Experience",
        description: "Walk the historic blocks of 133rd Street (Swing Street) and finish with a live, late-night session at an intimate local club."
      },
      {
        id: "nyc_ev_3",
        title: "Queens Night Market",
        date: "Saturdays (Spring/Summer)",
        type: "Food Event",
        description: "A large, open-air night market in Flushing Meadows featuring over 100 independent vendors selling global foods from over 80 countries."
      }
    ]
  }
};
