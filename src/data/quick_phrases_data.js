export const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Phrases', icon: 'sparkles' },
  { id: 'greetings', label: 'Greetings & Cultural', icon: 'hand-wave' },
  { id: 'medical', label: 'Hospital & Health', icon: 'heart-pulse' },
  { id: 'banking', label: 'Banking & Money', icon: 'landmark' },
  { id: 'transport', label: 'Transport & Places', icon: 'navigation' },
  { id: 'emergency', label: 'Emergency & Police', icon: 'shield-alert' },
  { id: 'daily', label: 'Daily Life', icon: 'coffee' }
];

export const QUICK_PHRASES = [
  // Greetings & Cultural (Nigerian context)
  {
    id: 'p-1',
    category: 'greetings',
    text: 'Good afternoon. How are you today?',
    signGloss: 'GOOD AFTERNOON HOW YOU TODAY',
    dialect: 'NSL / ASL',
    culturalNote: 'Common polite greeting in Nigerian Sign Language, paired with an open warm palm nod.',
    tags: ['greeting', 'daily', 'polite']
  },
  {
    id: 'p-2',
    category: 'greetings',
    text: 'Hello, my name is...',
    signGloss: 'HELLO MY NAME',
    dialect: 'NSL',
    culturalNote: 'Followed by fingerspelling your initial or name sign.',
    tags: ['intro', 'name']
  },
  {
    id: 'p-3',
    category: 'greetings',
    text: 'Thank you very much',
    signGloss: 'THANK-YOU MUCH',
    dialect: 'NSL / ASL',
    culturalNote: 'Hand touches chin/lips and extends outwards toward listener with slight head bow.',
    tags: ['courtesy', 'polite']
  },
  {
    id: 'p-4',
    category: 'greetings',
    text: 'Please excuse me',
    signGloss: 'PLEASE EXCUSE ME',
    dialect: 'NSL',
    culturalNote: 'Circular rub over the chest for "please", followed by brushing palm for "excuse".',
    tags: ['courtesy']
  },
  {
    id: 'p-5',
    category: 'greetings',
    text: 'Nice to meet you',
    signGloss: 'NICE MEET YOU',
    dialect: 'NSL / ASL',
    culturalNote: 'Flat palms slide across each other, then index fingers meet.',
    tags: ['social']
  },
  {
    id: 'p-6',
    category: 'greetings',
    text: 'Bawo ni / Kedu / Sannu (How are things?)',
    signGloss: 'HOW THINGS YOU',
    dialect: 'NSL Cultural',
    culturalNote: 'Recognized informal Nigerian greeting sign sequence with double hand flick.',
    tags: ['cultural', 'greeting']
  },

  // Hospital & Health
  {
    id: 'p-7',
    category: 'medical',
    text: 'I feel pain here',
    signGloss: 'PAIN HERE I FEEL',
    dialect: 'NSL / ASL',
    culturalNote: 'Twisting index fingers towards each other near the point of discomfort.',
    tags: ['hospital', 'pain', 'urgent']
  },
  {
    id: 'p-8',
    category: 'medical',
    text: 'I need to see a doctor',
    signGloss: 'I NEED DOCTOR SEE',
    dialect: 'NSL',
    culturalNote: 'Tapping wrist with fingertips indicating pulse check ("doctor").',
    tags: ['hospital', 'doctor']
  },
  {
    id: 'p-9',
    category: 'medical',
    text: 'I am allergic to this medication',
    signGloss: 'MEDICINE THIS ALLERGY ME',
    dialect: 'NSL',
    culturalNote: 'Pill ingestion motion followed by nose recoil sign.',
    tags: ['medical', 'safety']
  },
  {
    id: 'p-10',
    category: 'medical',
    text: 'Can you write down the diagnosis?',
    signGloss: 'YOU WRITE SICKNESS PAPER PLEASE',
    dialect: 'NSL',
    culturalNote: 'Hand mimicking writing on open left palm.',
    tags: ['hospital', 'clarity']
  },

  // Banking & Finance
  {
    id: 'p-11',
    category: 'banking',
    text: 'I want to open a bank account',
    signGloss: 'I WANT BANK ACCOUNT OPEN',
    dialect: 'NSL',
    culturalNote: 'Money flick gesture followed by opening book motion.',
    tags: ['bank', 'finance']
  },
  {
    id: 'p-12',
    category: 'banking',
    text: 'Where is the ATM / cash machine?',
    signGloss: 'ATM MONEY MACHINE WHERE',
    dialect: 'NSL',
    culturalNote: 'Card insertion motion + question expression.',
    tags: ['bank', 'atm']
  },
  {
    id: 'p-13',
    category: 'banking',
    text: 'I need to withdraw cash',
    signGloss: 'MONEY WITHDRAW I NEED',
    dialect: 'NSL',
    culturalNote: 'Pulling motion from flat non-dominant palm.',
    tags: ['bank', 'cash']
  },
  {
    id: 'p-14',
    category: 'banking',
    text: 'Please show me where to sign',
    signGloss: 'SIGN PAPER WHERE SHOW PLEASE',
    dialect: 'NSL',
    culturalNote: 'Right H-hand or index signs upon flat left palm.',
    tags: ['bank', 'signature']
  },

  // Transport & Places
  {
    id: 'p-15',
    category: 'transport',
    text: 'Where is the nearest restroom / toilet?',
    signGloss: 'RESTROOM TOILET WHERE',
    dialect: 'NSL / ASL',
    culturalNote: 'Shaking "T" handshape gently side-to-side with questioning eyebrows.',
    tags: ['restroom', 'urgent', 'places']
  },
  {
    id: 'p-16',
    category: 'transport',
    text: 'How much is the fare to the market?',
    signGloss: 'MARKET FARE HOW-MUCH',
    dialect: 'NSL',
    culturalNote: 'Fingers flick upwards from thumb indicating price/naira.',
    tags: ['transport', 'market', 'money']
  },
  {
    id: 'p-17',
    category: 'transport',
    text: 'Where is the bus stop or station?',
    signGloss: 'BUS STOP WHERE',
    dialect: 'NSL',
    culturalNote: 'Steering wheel gesture + flat hand cutting motion for "stop".',
    tags: ['transport', 'travel']
  },

  // Emergency & Police
  {
    id: 'p-18',
    category: 'emergency',
    text: 'I need help immediately!',
    signGloss: 'HELP ME NOW QUICK',
    dialect: 'NSL / ASL',
    culturalNote: 'Dominant fist on open palm lifts upward with urgent facial expression.',
    tags: ['emergency', 'urgent', 'danger']
  },
  {
    id: 'p-19',
    category: 'emergency',
    text: 'I am deaf. Please look at my phone.',
    signGloss: 'I DEAF PHONE LOOK PLEASE',
    dialect: 'NSL / ASL',
    culturalNote: 'Index finger touches ear then mouth ("Deaf"), points to phone screen.',
    tags: ['emergency', 'identity', 'essential']
  },
  {
    id: 'p-20',
    category: 'emergency',
    text: 'Please call the emergency ambulance',
    signGloss: 'AMBULANCE CALL EMERGENCY PLEASE',
    dialect: 'NSL',
    culturalNote: 'Flashing siren light hand rotation over head.',
    tags: ['emergency', 'police']
  },

  // Daily Life
  {
    id: 'p-21',
    category: 'daily',
    text: 'Can you repeat that slowly?',
    signGloss: 'REPEAT SLOW PLEASE',
    dialect: 'NSL / ASL',
    culturalNote: 'Curved right hand flips into open left palm, followed by slow downward slide.',
    tags: ['daily', 'understanding']
  },
  {
    id: 'p-22',
    category: 'daily',
    text: 'I understand / I do not understand',
    signGloss: 'UNDERSTAND / NOT UNDERSTAND',
    dialect: 'NSL / ASL',
    culturalNote: 'Index finger flicks open next to temple; head shakes for negative.',
    tags: ['daily', 'clarity']
  },
  {
    id: 'p-23',
    category: 'daily',
    text: 'I need drinking water',
    signGloss: 'WATER DRINK I NEED',
    dialect: 'NSL / ASL',
    culturalNote: '"W" handshape taps bottom lip twice.',
    tags: ['daily', 'food']
  }
];
