import { KundaliData, MilanData, NumerologyData, PlanetPosition, UserDetails, DoshaReport, Remedy, PalmistryResult, RashifalData, Language, HouseReport } from '../types';

// --- ASTRONOMICAL CALCULATIONS (Mean Longitude) ---
// Epoch: J2000 (Jan 1, 2000, 12:00 PM UTC)
const J2000 = 2451545.0;

const toJulian = (date: Date) => {
  return (date.getTime() / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5;
};

const normalize = (deg: number) => {
  deg = deg % 360;
  if (deg < 0) deg += 360;
  return deg;
};

// Mean daily motion (approximate degrees per day)
const PLANET_DATA = {
  Sun: { L: 280.466, n: 0.9856474 },
  Moon: { L: 218.316, n: 13.176396 },
  Mars: { L: 355.453, n: 0.5240208 },
  Mercury: { L: 252.25, n: 4.0923344 }, // Approximate mean
  Jupiter: { L: 34.404, n: 0.0830853 },
  Venus: { L: 181.979, n: 1.6021305 },
  Saturn: { L: 49.944, n: 0.0336978 },
  Rahu: { L: 291.413, n: -0.0529538 }, // Retrograde
};

// --- PREDICTION DATABASE ---
const PREDICTIONS = {
  Sun: [
    "Health issues, ego conflicts, but strong willpower.",
    "Wealth through government, authority, good eyesight.",
    "Courageous, good for siblings, famous.",
    "Domestic unhappiness, heart trouble, land property.",
    "Intelligence, fame, few children, speculative gains.",
    "Victory over enemies, good health, fierce nature.",
    "Marital discord, ego clashes with partner, travel.",
    "Health issues, sudden events, interest in occult.",
    "Fortunate, religious, father's support, long travel.",
    "Career success, fame, government favor, authority.",
    "Gains, high status, social circle, fulfillment.",
    "Losses, eye trouble, spiritual inclination, isolation."
  ],
  Moon: [
    "Emotional, sensitive, moody, handsome appearance.",
    "Wealthy, musical talent, soft speech, family love.",
    "Courageous, short travels, artistic sisters.",
    "Happiness, vehicles, mother's love, landed property.",
    "Creative, emotional mind, love affairs, female children.",
    "Health issues in childhood, enemies, maternal trouble.",
    "Passionate, beautiful spouse, travel, mood swings.",
    "Short life (if afflicted), hidden diseases, psychological issues.",
    "Fortunate, travel abroad, religious mind, charitable.",
    "Career changes, popularity, success in public life.",
    "Gains, many friends, fulfillment of desires.",
    "Expenditure, spiritual inclination, lazy, dreamy."
  ],
  Mars: [
    "Hot temper, scars on head, energetic, aggressive.",
    "Harsh speech, wealth through struggle, dental issues.",
    "Courageous, younger siblings, leader, adventurous.",
    "Domestic unhappiness, property disputes, chest issues.",
    "Stomach trouble, loss of children/speculation, angry mind.",
    "Victory over enemies, competitive, executive power.",
    "Mangal Dosha, marital conflict, passionate partner.",
    "Accidents, piles, blood disorders, short life (if afflicted).",
    "Disagreement with father, unlucky, aggressive dharma.",
    "Kuladeepak (light of family), career energy, police/army.",
    "Gains through real estate, powerful friends.",
    "Mangal Dosha, losses, eye trouble, jail or hospitalization."
  ],
  // ... (Simplified for brevity, but logically extendable for all planets)
  Generic: "This placement influences the area of life related to this house. It brings a mix of karmic results based on the planet's nature."
};

// --- HELPER FUNCTIONS ---

const getPlanetHousePrediction = (planet: string, house: number) => {
  if ((planet === "Sun" || planet === "Moon" || planet === "Mars") && house >= 1 && house <= 12) {
    // @ts-ignore
    return PREDICTIONS[planet][house - 1];
  }
  return `${planet} in House ${house}: ${PREDICTIONS.Generic}`;
};

export const getArrows = (d: number, m: number, y: number, lang: Language): string[] => {
    const digits = `${d}${m}${y}`;
    const has = (n: number) => digits.includes(n.toString());
    const arrows = [];
    const t = CONTENT[lang].arrows;
  
    // David Phillips Arrows Logic
    if (has(1) && has(5) && has(9)) arrows.push(t[159 as keyof typeof t]); // Determination
    if (has(3) && has(5) && has(7)) arrows.push(t[357 as keyof typeof t]); // Spirituality
    if (has(1) && has(2) && has(3)) arrows.push(t[123 as keyof typeof t]); // Planning
    if (has(4) && has(5) && has(6)) arrows.push(t[456 as keyof typeof t]); // Willpower
    if (has(7) && has(8) && has(9)) arrows.push(t[789 as keyof typeof t]); // Activity
    if (has(1) && has(4) && has(7)) arrows.push(t[147 as keyof typeof t]); // Practicality
    if (has(2) && has(5) && has(8)) arrows.push(t[258 as keyof typeof t]); // Emotional Balance
    if (has(3) && has(6) && has(9)) arrows.push(t[369 as keyof typeof t]); // Intellect
  
    return arrows;
};

// --- MULTILINGUAL KNOWLEDGE BASE ---
const CONTENT = {
    [Language.ENGLISH]: {
      planets: {
        Sun: "The Sun represents the Soul, Ego, Father, and Authority.",
        Moon: "The Moon represents the Mind, Emotions, Mother, and Happiness.",
        Mars: "Mars represents Energy, Courage, Brothers, and Land.",
        Mercury: "Mercury represents Intellect, Speech, and Business.",
        Jupiter: "Jupiter represents Wisdom, Wealth, and Expansion.",
        Venus: "Venus represents Love, Beauty, and Luxury.",
        Saturn: "Saturn represents Discipline, Sorrow, and Longevity.",
        Rahu: "Rahu represents Obsession and Foreign lands.",
        Ketu: "Ketu represents Detachment and Moksha."
      },
      rashifal: {
        good: "Excellent day. The Moon is favorable. Success in undertakings.",
        average: "Mixed results. Work hard and avoid arguments.",
        bad: "Challenging day. Health may suffer. Avoid new ventures.",
        financial: "Financial gains are indicated.",
        health: "Take care of health, especially stomach or head.",
        travel: "Travel is likely today."
      },
      arrows: {
        159: "Arrow of Determination (1-5-9): You are persistent and patient.",
        357: "Arrow of Spirituality (3-5-7): You have deep compassion and calmness.",
        123: "Arrow of Planning (1-2-3): You are excellent at organizing, but may overlook details.",
        456: "Arrow of Willpower (4-5-6): You have tremendous strength and courage.",
        789: "Arrow of Activity (7-8-9): You are physically active and nervous energy.",
        147: "Arrow of Practicality (1-4-7): You are grounded and hardworking.",
        258: "Arrow of Emotional Balance (2-5-8): You are sensitive and intuitive.",
        369: "Arrow of Intellect (3-6-9): You have a superior memory and intellect."
      },
      numerology: {
        1: "Ruling Number 1 (The Ego): Independent, focused, and a natural leader. You struggle with verbalizing feelings.",
        2: "Ruling Number 2 (The Peacemaker): Sensitive, intuitive, and supportive. You need to develop self-confidence.",
        3: "Ruling Number 3 (The Communicator): Mental, alert, and witty. You are the life of the party but can be critical.",
        4: "Ruling Number 4 (The Organiser): Practical, earthy, and hands-on. You value material security.",
        5: "Ruling Number 5 (The Freedom Lover): Emotional, artistic, and restless. You need freedom to thrive.",
        6: "Ruling Number 6 (The Creator): Home-loving, responsible, and creative. You tend to worry too much.",
        7: "Ruling Number 7 (The Philosopher): You learn through personal sacrifice. You seek truth and wisdom.",
        8: "Ruling Number 8 (The Executive): Independent, dependable, and business-minded. You hide your feelings.",
        9: "Ruling Number 9 (The Humanitarian): Idealistic, responsible, and ambitious. You want to save the world.",
        11: "Ruling Number 11 (The Spiritual): Highly intuitive and spiritual. You are here to guide others.",
        22: "Ruling Number 22 (The Master Builder): Powerful and practical. You can achieve impossible goals."
      },
      faces: {
        Wood: "Wood Face (Rectangle): Driven, confident, and ambitious. Prone to anger but a natural leader.",
        Fire: "Fire Face (Oval/Pointed): Passionate, charismatic, and sparkling. Seeks joy and excitement.",
        Earth: "Earth Face (Square/Fleshy): Stable, nurturing, and grounded. Worries about family and security.",
        Metal: "Metal Face (Angular/Defined): Elegant, disciplined, and principled. Can be aloof and perfectionist.",
        Water: "Water Face (Round/Soft): Deep, mysterious, and intuitive. Emotional and adaptable."
      },
      palm: {
        heart: "Line of Heart (Fortune):",
        head: "Line of Head (Liver):",
        life: "Line of Life:",
        fate: "Line of Fate (Saturn):"
      }
    },
    [Language.HINDI]: {
      planets: {
        Sun: "सूर्य आत्मा, अहंकार, पिता और अधिकार का कारक है।",
        Moon: "चंद्रमा मन, भावनाओं, माता और सुख का प्रतिनिधित्व करता है।",
        Mars: "मंगल ऊर्जा, साहस, भाइयों और भूमि का कारक है।",
        Mercury: "बुध बुद्धि, वाणी और व्यापार का प्रतिनिधित्व करता है।",
        Jupiter: "बृहस्पति ज्ञान, धन और विस्तार का कारक है।",
        Venus: "शुक्र प्रेम, सौंदर्य और विलासिता का प्रतिनिधित्व करता है।",
        Saturn: "शनि अनुशासन, दुख और आयु का कारक है।",
        Rahu: "राहु भ्रम और विदेशी भूमि का प्रतिनिधित्व करता है।",
        Ketu: "केतु वैराग्य और मोक्ष का कारक है।"
      },
      rashifal: {
        good: "उत्तम दिन। चंद्रमा अनुकूल है। कार्यों में सफलता मिलेगी।",
        average: "मिश्रित परिणाम। कड़ी मेहनत करें और बहस से बचें।",
        bad: "चुनौतीपूर्ण दिन। स्वास्थ्य बिगड़ सकता है। नए कार्य न करें।",
        financial: "धन लाभ के संकेत हैं।",
        health: "स्वास्थ्य का ध्यान रखें, विशेषकर पेट या सिर का।",
        travel: "आज यात्रा की संभावना है।"
      },
      arrows: {
        159: "दृढ़ संकल्प का तीर (1-5-9): आप हठी और धैर्यवान हैं।",
        357: "आध्यात्मिकता का तीर (3-5-7): आपके पास गहरी करुणा और शांति है।",
        123: "योजना का तीर (1-2-3): आप आयोजन में उत्कृष्ट हैं।",
        456: "इच्छाशक्ति का तीर (4-5-6): आपके पास जबरदस्त ताकत और साहस है।",
        789: "सक्रियता का तीर (7-8-9): आप शारीरिक रूप से सक्रिय हैं।",
        147: "व्यावहारिकता का तीर (1-4-7): आप जमीन से जुड़े और मेहनती हैं।",
        258: "भावनात्मक संतुलन का तीर (2-5-8): आप संवेदनशील और सहज हैं।",
        369: "बुद्धि का तीर (3-6-9): आपके पास श्रेष्ठ स्मृति और बुद्धि है।"
      },
      numerology: {
        1: "मूलांक 1 (अहंकार): स्वतंत्र, एकाग्र और एक स्वाभाविक नेता। आपको भावनाओं को व्यक्त करने में संघर्ष करना पड़ता है।",
        2: "मूलांक 2 (शांतिदूत): संवेदनशील, सहज और सहयोगी। आपको आत्मविश्वास विकसित करने की आवश्यकता है।",
        3: "मूलांक 3 (संचारक): मानसिक रूप से सतर्क और मजाकिया। आप उत्सव की जान हैं लेकिन आलोचनात्मक हो सकते हैं।",
        4: "मूलांक 4 (आयोजक): व्यावहारिक और कर्मठ। आप भौतिक सुरक्षा को महत्व देते हैं।",
        5: "मूलांक 5 (स्वतंत्रता प्रेमी): भावुक, कलात्मक और बेचैन। आपको फलने-फूलने के लिए स्वतंत्रता की आवश्यकता है।",
        6: "मूलांक 6 (निर्माता): गृह-प्रेमी, जिम्मेदार और रचनात्मक। आप बहुत अधिक चिंता करते हैं।",
        7: "मूलांक 7 (दार्शनिक): आप व्यक्तिगत त्याग के माध्यम से सीखते हैं। आप सत्य और ज्ञान की तलाश करते हैं।",
        8: "मूलांक 8 (कार्यकारी): स्वतंत्र, भरोसेमंद और व्यापारिक। आप अपनी भावनाओं को छिपाते हैं।",
        9: "मूलांक 9 (मानवतावादी): आदर्शवादी, जिम्मेदार और महत्वाकांक्षी। आप दुनिया को बचाना चाहते हैं।",
        11: "मूलांक 11 (आध्यात्मिक): अत्यधिक सहज और आध्यात्मिक। आप दूसरों का मार्गदर्शन करने के लिए यहाँ हैं।",
        22: "मूलांक 22 (मास्टर बिल्डर): शक्तिशाली और व्यावहारिक। आप असंभव लक्ष्यों को प्राप्त कर सकते हैं।"
      },
      faces: {
        Wood: "काष्ठ मुख (आयताकार): प्रेरित, आत्मविश्वास और महत्वाकांक्षी। क्रोधित होने की संभावना लेकिन एक स्वाभाविक नेता।",
        Fire: "अग्नि मुख (अंडाकार): भावुक, करिश्माई और चमकदार। खुशी और उत्साह चाहता है।",
        Earth: "पृथ्वी मुख (चौकोर): स्थिर, पोषण करने वाला और जमीन से जुड़ा हुआ। परिवार और सुरक्षा की चिंता करता है।",
        Metal: "धातु मुख (कोणीय): सुरुचिपूर्ण, अनुशासित और सिद्धांतवादी। अलग-थलग और पूर्णतावादी हो सकता है।",
        Water: "जल मुख (गोल): गहरा, रहस्यमय और सहज। भावुक और अनुकूलनीय।"
      },
      palm: {
        heart: "हृदय रेखा:",
        head: "मस्तिष्क रेखा:",
        life: "जीवन रेखा:",
        fate: "भाग्य रेखा:"
      }
    },
    [Language.SANSKRIT]: {
      planets: {
        Sun: "सूर्यः आत्मा, अहंकारः, पिता, अधिकारः च भवति।",
        Moon: "चन्द्रः मनः, भावनाः, माता, सुखं च प्रतिनिधियति।",
        Mars: "मङ्गलः ऊर्जा, धैर्यम्, भ्रातरः, भूमिः च भवति।",
        Mercury: "बुधः बुद्धिः, वाणी, वाणिज्यं च प्रतिनिधियति।",
        Jupiter: "गुरुः ज्ञानम्, धनम्, विस्तारः च भवति।",
        Venus: "शुक्रः प्रेम, सौन्दर्यम्, विलासः च प्रतिनिधियति।",
        Saturn: "शनिः अनुशासनम्, दुःखम्, आयुः च भवति।",
        Rahu: "राहुः मोहः, विदेशः च प्रतिनिधियति।",
        Ketu: "केतुः वैराग्यम्, मोक्षः च भवति।"
      },
      rashifal: {
        good: "उत्तमम् दिनम्। चन्द्रः अनुकूलः अस्ति। कार्यसिद्धिः भविष्यति।",
        average: "मिश्रित फलम्। परिश्रमं कुरु। विवादं मा कुरु।",
        bad: "कष्टकरम् दिनम्। स्वास्थ्यस्य चिन्ता भवति। नूतनकार्यं मा कुरु।",
        financial: "धनलाभः भविष्यति।",
        health: "स्वास्थ्यस्य रक्षणं कुरु।",
        travel: "यात्रा योगः अस्ति।"
      },
      arrows: {
        159: "निश्चय वाणः (१-५-९): त्वं दृढनिश्चयी धैर्यवान् च असि।",
        357: "अध्यात्म वाणः (३-५-७): त्वं करुणायुक्तः शान्तः च असि।",
        123: "योजना वाणः (१-२-३): त्वं आयोजने निपुणः।",
        456: "इच्छाशक्ति वाणः (४-५-६): तव शक्तिः साहसः च अत्यधिकः अस्ति।",
        789: "कर्म वाणः (७-८-९): त्वं सदा कर्मठः।",
        147: "व्यावहारिक वाणः (१-४-७): त्वं सत्यप्रियः परिश्रमी च असि।",
        258: "भावुक वाणः (२-५-८): त्वं संवेदनशीलः ज्ञानी च असि।",
        369: "बुद्धि वाणः (३-६-९): तव स्मृतिः बुद्धिः च श्रेष्ठा अस्ति।"
      },
      numerology: {
        1: "मूलाङ्कः १: स्वतन्त्रः, एकाग्रः, नायकः। भावाभिव्यक्तौ कष्टम् अनुभवति।",
        2: "मूलाङ्कः २: संवेदनशीलः, अन्तर्ज्ञानी, सहायकः। आत्म-विश्वासस्य आवश्यकता वर्तते।",
        3: "मूलाङ्कः ३: बुद्धिमान्, सतर्कः, विनोदप्रियः। कदाचित् आलोचकः भवति।",
        4: "मूलाङ्कः ४: व्यावहारिकः, कर्मठः। भौतिक-सुरक्षां वाञ्छति।",
        5: "मूलाङ्कः ५: स्वतन्त्रता-प्रेमी, भावुकः, कलात्मकः। बन्धनेन दुःखी भवति।",
        6: "मूलाङ्कः ६: गृह-प्रेमी, उत्तरदायी, रचनात्मकः। अति-चिन्ता करोति।",
        7: "मूलाङ्कः ७: दार्शनिकः, त्यागेन ज्ञानी। सत्यस्य अन्वेषकः।",
        8: "मूलाङ्कः ८: स्वतन्त्रः, विश्वसनीयः, व्यावसायिकः। भावनाः गोपयति।",
        9: "मूलाङ्कः ९: मानवतावादी, आदर्शवादी, महत्त्वाकांक्षी। लोक-कल्याणं करोति।",
        11: "मूलाङ्कः ११: आध्यात्मिकः, अन्तर्ज्ञानी। मार्गदर्शकः भवति।",
        22: "मूलाङ्कः २२: महा-निर्माता। असम्भवं कार्यं करोति।"
      },
      faces: {
        Wood: "काष्ठ मुखम्: प्रेरितः, साहसी। क्रोध-प्रवृत्तिः।",
        Fire: "अग्नि मुखम्: तेजस्वी, उत्साहः। आनन्दं अन्वेषयति।",
        Earth: "पृथ्वी मुखम्: स्थिरः, पोषकः। कुटुम्ब-चिन्ता।",
        Metal: "धातु मुखम्: शिष्टः, अनुशासितः। पूर्णतावादी।",
        Water: "जल मुखम्: गभीरः, रहस्यमयः। भावुकः।"
      },
      palm: {
        heart: "हृदय रेखा:",
        head: "मस्तिष्क रेखा:",
        life: "जीवन रेखा:",
        fate: "भाग्य रेखा:"
      }
    }
  };

const reduceToSingle = (n: number): number => {
  let sum = n;
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return sum;
};

export const calculateNumerology = (name: string, d: number, m: number, y: number, lang: Language): NumerologyData => {
  const t = CONTENT[lang];
  const mulank = reduceToSingle(d);
  const bhagyank = reduceToSingle(d + m + y);
  
  // Calculate Name Number (Simplified Chaldean/Pythagorean hybrid for demo)
  const map: Record<string, number> = {
    a:1, b:2, c:3, d:4, e:5, f:8, g:3, h:5, i:1, j:1, k:2, l:3, m:4,
    n:5, o:7, p:8, q:1, r:2, s:3, t:4, u:6, v:6, w:6, x:5, y:1, z:7
  };

  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const vowels = ['a','e','i','o','u'];
  
  let nameSum = 0;
  let vowelSum = 0;
  let consonantSum = 0;

  cleanName.split('').forEach(char => {
    const val = map[char] || 0;
    nameSum += val;
    if (vowels.includes(char)) vowelSum += val;
    else consonantSum += val;
  });

  const namank = reduceToSingle(nameSum);
  const soulUrge = reduceToSingle(vowelSum);
  const personality = reduceToSingle(consonantSum);

  const colors = ["Red", "White", "Yellow", "Blue", "Green", "Pink", "Mixed", "Black", "Gold"];
  const gems = ["Ruby", "Pearl", "Jupiter Stone", "Gomed", "Emerald", "Diamond", "Cat's Eye", "Blue Sapphire", "Coral"];

  const prediction = t.numerology[bhagyank as keyof typeof t.numerology] || t.numerology[1];
  const arrows = getArrows(d, m, y, lang);

  return {
    mulank,
    bhagyank,
    namank,
    soulUrge,
    personality,
    prediction: prediction,
    arrows: arrows,
    luckyColor: colors[(mulank - 1) % 9],
    luckyGem: gems[(mulank - 1) % 9]
  };
};

const getNakshatra = (signIndex: number, degree: number) => {
  const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];
  const totalDegrees = signIndex * 30 + degree;
  const nakshatraIdx = Math.floor(totalDegrees / 13.333333);
  return NAKSHATRAS[nakshatraIdx % 27];
};

export const generateKundali = (details: UserDetails, lang: Language): KundaliData => {
  const t = CONTENT[lang];
  const { day, month, year, hour } = details;
  
  // ASTRONOMICAL CALCULATION (Mean Longitude)
  const julianDay = toJulian(new Date(year, month - 1, day, hour));
  const daysSinceJ2000 = julianDay - J2000;

  const planets: PlanetPosition[] = [];
  const celestialBodies = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  
  // Calculate Ascendant (Approximate based on time and month)
  // Sun is at a specific sign based on month. Ascendant moves 1 sign every 2 hours from Sun position at Sunrise (approx 6 AM).
  // This is a rough estimation for offline mode.
  const sunMeanLong = normalize(PLANET_DATA.Sun.L + PLANET_DATA.Sun.n * daysSinceJ2000);
  const sunSignIndex = Math.floor(sunMeanLong / 30);
  
  // Hours passed since 6 AM
  let hoursSinceSunrise = hour - 6;
  if (hoursSinceSunrise < 0) hoursSinceSunrise += 24;
  
  const signsPassed = Math.floor(hoursSinceSunrise / 2);
  let ascendant = (sunSignIndex + signsPassed) % 12;

  // Calculate positions for all planets
  celestialBodies.forEach((body, idx) => {
    let longitude = 0;
    
    if (PLANET_DATA[body as keyof typeof PLANET_DATA]) {
       const data = PLANET_DATA[body as keyof typeof PLANET_DATA];
       longitude = normalize(data.L + data.n * daysSinceJ2000);
    } else if (body === "Ketu") {
       // Ketu is always 180 degrees from Rahu
       const rahuData = PLANET_DATA.Rahu;
       const rahuLong = normalize(rahuData.L + rahuData.n * daysSinceJ2000);
       longitude = normalize(rahuLong + 180);
    }

    const signIndex = Math.floor(longitude / 30);
    const degree = longitude % 30;

    let house = (signIndex - ascendant + 1);
    if (house <= 0) house += 12;

    planets.push({
      planet: body,
      signIndex,
      degree,
      house,
      isRetrograde: false, // Simulating retrograde is complex without ephemeris
      nakshatra: getNakshatra(signIndex, degree),
    });
  });

  const mars = planets.find(p => p.planet === "Mars");
  const mangalDosha = mars ? [1, 4, 7, 8, 12].includes(mars.house) : false;
  // Kaal Sarp: simplified check if all planets are between Rahu and Ketu
  // (Not fully implemented in simple math, keeping random for demo or simplistic check)
  const kaalSarp = false; 

  // DETAILED HOUSE ANALYSIS GENERATION
  const houseReports: HouseReport[] = [];
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const signLords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

  // Helper to get Hindi/Sanskrit sign names
  const getLocalizedSign = (idx: number) => {
    const hindiSigns = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
    return lang === Language.ENGLISH ? signs[idx] : hindiSigns[idx];
  };
  
  const getLocalizedPlanet = (planet: string) => {
      const pMap: Record<string, string> = { "Sun": "सूर्य", "Moon": "चन्द्र", "Mars": "मङ्गल", "Mercury": "बुध", "Jupiter": "गुरु", "Venus": "शुक्र", "Saturn": "शनि", "Rahu": "राहु", "Ketu": "केतु" };
      return lang === Language.ENGLISH ? planet : pMap[planet];
  };

  for(let i=1; i<=12; i++) {
     const signIndex = (ascendant + i - 1) % 12;
     const signName = getLocalizedSign(signIndex);
     const lord = getLocalizedPlanet(signLords[signIndex]);
     const occupants = planets.filter(p => p.house === i);
     
     let analysis = "";
     if (lang === Language.ENGLISH) {
        analysis = `This house is ruled by ${lord}. `;
        if (occupants.length > 0) {
            analysis += `Planets present: ${occupants.map(p => p.planet).join(", ")}. `;
            occupants.forEach(p => {
                analysis += getPlanetHousePrediction(p.planet, i) + " ";
            });
        } else {
            analysis += "No planets are present in this house. The results will be primarily driven by the position of the house lord.";
        }
     } else {
         // Hindi / Sanskrit simple logic for demo
         analysis = `इस भाव का स्वामी ${lord} है। `;
         if (occupants.length > 0) {
            analysis += `स्थित ग्रह: ${occupants.map(p => getLocalizedPlanet(p.planet)).join(", ")}. `;
            // Note: For full Hindi predictions, a separate huge map is needed. Using placeholder or English fallback if needed.
             occupants.forEach(p => {
                 analysis += getPlanetHousePrediction(p.planet, i) + " "; // Currently returns English
             });
         } else {
             analysis += "इस भाव में कोई ग्रह नहीं है। परिणाम स्वामी ग्रह की स्थिति पर निर्भर करेंगे।";
         }
     }

     houseReports.push({
         houseNumber: i,
         sign: signName,
         lord: lord,
         planets: occupants,
         analysis: analysis
     });
  }

  // Generate Life Prediction String (Summary for PDF)
  let lifeReport = "";
  if (lang === Language.ENGLISH) {
     lifeReport += `LAGNA (ASCENDANT) ANALYSIS:\n`;
     lifeReport += `Your Ascendant is ${getLocalizedSign(ascendant)}. This sign represents your physical body, character, and general path in life.\n\n`;
     lifeReport += `PLANETARY POSITIONS & EFFECTS:\n`;
     planets.forEach(p => {
         lifeReport += `\n${p.planet.toUpperCase()} IN HOUSE ${p.house} (${getLocalizedSign(p.signIndex)}):\n`;
         lifeReport += getPlanetHousePrediction(p.planet, p.house);
         lifeReport += `\n`;
     });
  } else {
     lifeReport += `लग्न विश्लेषण:\n`;
     lifeReport += `आपका लग्न ${getLocalizedSign(ascendant)} है।\n\n`;
     lifeReport += `ग्रह स्थिति:\n`;
     planets.forEach(p => {
         lifeReport += `\n${getLocalizedPlanet(p.planet)} - भाव ${p.house}:\n`;
         lifeReport += getPlanetHousePrediction(p.planet, p.house) + "\n";
     });
  }

  const doshaReport: DoshaReport = {
    hasMangalDosha: mangalDosha,
    hasPitraDosha: false,
    hasKaalSarp: kaalSarp,
    description: mangalDosha 
      ? (lang === Language.ENGLISH ? "Mangal Dosha Detected. Mars is in a sensitive house affecting relationships." : lang === Language.HINDI ? "मंगल दोष पाया गया है।" : "कुज दोषः अस्ति।")
      : (lang === Language.ENGLISH ? "No Mangal Dosha detected." : lang === Language.HINDI ? "मंगल दोष नहीं है।" : "कुज दोषः नास्ति।")
  };

  const remedies: Remedy[] = [];
  const lordMap = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const lagnaLordName = getLocalizedPlanet(lordMap[ascendant]);
  
  remedies.push({
    type: "Gemstone",
    name: "Gem for " + lagnaLordName,
    description: lang === Language.ENGLISH ? `Strengthen ${lagnaLordName} for overall well-being.` : `${lagnaLordName} को मजबूत करें`,
    procedure: lang === Language.ENGLISH ? "Wear on appropriate finger on an auspicious day." : "शुभ दिन पर उचित उंगली पर पहनें।"
  });

  return {
    ascendant,
    planets,
    details,
    doshas: doshaReport,
    remedies,
    lifePrediction: lifeReport,
    houseReports: houseReports
  };
};

export const calculateMilan = (p1: UserDetails, p2: UserDetails, lang: Language): MilanData => {
  const totalScore = 24; 
  const resultText = lang === Language.ENGLISH ? "Good Match. Can proceed." : lang === Language.HINDI ? "उत्तम मिलान। आगे बढ़ सकते हैं।" : "उत्तमम्।";
  
  return {
    p1,
    p2,
    score: totalScore,
    categoryScores: { varna: 1, vashya: 2, tara: 3, yoni: 4, grahaMaitri: 5, gana: 6, bhakoot: 7, nadi: 8 },
    conclusion: resultText,
    manglikStatus: lang === Language.ENGLISH ? "Check individual charts for Mangal Dosha." : "मंगल दोष के लिए व्यक्तिगत चार्ट देखें।"
  };
};

export const calculateDailyRashifal = (rashiIndex: number, lang: Language): RashifalData => {
  const t = CONTENT[lang];
  const today = new Date();
  
  const baseDate = new Date(2000, 0, 1);
  const diffTime = Math.abs(today.getTime() - baseDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  // Accurate Mean Moon Motion
  const moonMeanLong = normalize(PLANET_DATA.Moon.L + PLANET_DATA.Moon.n * diffDays);
  const currentMoonSignIndex = Math.floor(moonMeanLong / 30);

  // Gochar (Transit) calculation
  let transitHouse = (currentMoonSignIndex - rashiIndex + 1);
  if (transitHouse <= 0) transitHouse += 12;

  let prediction = "";
  let luckyNumber = (transitHouse + 5) % 9 || 9;
  
  const colors = ["Red", "White", "Green", "Cream", "Orange", "Emerald", "White", "Red", "Yellow", "Blue", "Black", "Yellow"];
  const luckyColor = colors[rashiIndex];

  if ([1, 3, 6, 7, 10, 11].includes(transitHouse)) {
    prediction = t.rashifal.good + (lang === Language.ENGLISH ? ` Moon is in ${transitHouse}th house from your Rashi.` : ` चंद्रमा आपकी राशि से ${transitHouse}वें भाव में है।`);
  } else if ([4, 8, 12].includes(transitHouse)) {
    prediction = t.rashifal.bad + (lang === Language.ENGLISH ? ` Moon is in ${transitHouse}th house (Kantaka/Randhra/Vyaya).` : ` चंद्रमा ${transitHouse}वें भाव में है। सावधान रहें।`);
  } else {
    prediction = t.rashifal.average + (lang === Language.ENGLISH ? ` Moon is in ${transitHouse}th house.` : ` चंद्रमा ${transitHouse}वें भाव में है।`);
  }

  const rashis = [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", 
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", 
    "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
  ];
  
  const rashiNames = lang === Language.ENGLISH ? rashis : [
    "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
  ];

  return {
    rashi: rashiNames[rashiIndex],
    date: today.toLocaleDateString(),
    prediction: prediction,
    luckyColor: luckyColor,
    luckyNumber: luckyNumber
  };
};

export const analyzeBiometricImage = async (file: File, type: 'palm' | 'face', lang: Language): Promise<PalmistryResult> => {
  await new Promise(r => setTimeout(r, 2000));
  const imageUrl = URL.createObjectURL(file);
  const seed = file.size;
  const t = CONTENT[lang];

  if (type === 'palm') {
    const heartLine = (seed % 100);
    const headLine = (seed % 50) + 50;
    
    const heartDesc = lang === Language.ENGLISH 
      ? (heartLine > 80 ? "Deep & Emotional (Line of Fortune)" : "Practical (Line of Fortune)")
      : (heartLine > 80 ? "गहरी और भावुक" : "व्यावहारिक");
      
    const headDesc = lang === Language.ENGLISH
      ? (headLine > 75 ? "Creative (Line of Liver)" : "Logical (Line of Liver)")
      : (headLine > 75 ? "रचनात्मक" : "तार्किक");

    return {
      type: 'palm',
      imageUrl,
      traits: [
        { label: t.palm.heart, value: heartDesc, score: heartLine },
        { label: t.palm.head, value: headDesc, score: headLine },
        { label: t.palm.life, value: "Vitality", score: 85 + (seed % 15) },
        { label: t.palm.fate, value: "Destiny", score: 70 + (seed % 30) }
      ],
      prediction: lang === Language.ENGLISH 
         ? "Your palm shows a strong Line of Fortune indicating deep emotions. The Line of Liver suggests good mental faculties."
         : lang === Language.HINDI
         ? "आपकी हथेली मजबूत भाग्य रेखा और गहरी भावनाओं को दर्शाती है। मस्तिष्क रेखा अच्छी मानसिक क्षमता का सुझाव देती है।"
         : "भवतः हस्तरेखा उत्तमं भाग्यं सूचयति।",
      personalityKeywords: ["Resilient", "Strategic", "Loyal"]
    };
  } else {
    const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];
    const dominantElement = elements[seed % 5] as keyof typeof t.faces;
    const desc = t.faces[dominantElement];
    
    return {
      type: 'face',
      imageUrl,
      traits: [
        { label: "Element", value: dominantElement, score: 90 },
        { label: "Symmetry", value: "High", score: 85 },
      ],
      prediction: desc,
      personalityKeywords: ["Charismatic", "Observant", "Wise"]
    };
  }
};
