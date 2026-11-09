// All portfolio content lives here, so it can be updated without touching layout code.

export const GITHUB = 'https://github.com/Josiah-27';
export const LINKEDIN = 'https://www.linkedin.com/in/josiah-arun-283782385/';

/* ---------- focus areas ---------- */
export const focusAreas = [
  {
    icon: 'robot',
    title: 'Robotics',
    text: 'Machines that sense, decide and move, from sensor fusion to navigating places where GPS cannot reach.',
    c1: '139 92 246',
    c2: '236 72 153',
  },
  {
    icon: 'cpu',
    title: 'Computer Architecture',
    text: 'How instructions become computation: datapaths, memory hierarchies and the trade-offs inside every processor.',
    c1: '59 130 246',
    c2: '139 92 246',
  },
  {
    icon: 'wafer',
    title: 'VLSI',
    text: 'Designing at the transistor level, where logic becomes silicon and every nanometre counts.',
    c1: '20 184 166',
    c2: '59 130 246',
  },
  {
    icon: 'board',
    title: 'Embedded Systems',
    text: 'Hardware and firmware working as one: microcontrollers, sensors and real-time control loops.',
    c1: '245 158 11',
    c2: '239 68 68',
  },
  {
    icon: 'network',
    title: 'Artificial Intelligence',
    text: 'Models that perceive and decide, from on-device motion classifiers to voice-first assistants.',
    c1: '236 72 153',
    c2: '20 184 166',
  },
];

/* ---------- skills ---------- */
export const skillGroups = [
  {
    icon: 'wave',
    title: 'Hardware & Electronics',
    sub: 'Circuits that work',
    c1: '245 158 11',
    c2: '239 68 68',
    items: ['Digital logic design', 'TTL ICs (74LS series)', 'Flip-flops & counters', 'Sensor interfacing', 'Breadboard prototyping', 'Circuit debugging'],
  },
  {
    icon: 'code',
    title: 'Programming',
    sub: 'Languages',
    c1: '139 92 246',
    c2: '59 130 246',
    items: ['Python', 'Kotlin', 'TypeScript', 'JavaScript', 'SQL'],
  },
  {
    icon: 'stack',
    title: 'Mobile & Backend',
    sub: 'Apps & services',
    c1: '20 184 166',
    c2: '59 130 246',
    items: ['Android · Jetpack Compose', 'CameraX', 'React Native · Expo', 'Node.js · Express', 'MySQL', 'REST APIs'],
  },
  {
    icon: 'network',
    title: 'AI & Algorithms',
    sub: 'Perception & automation',
    c1: '236 72 153',
    c2: '139 92 246',
    items: ['Sensor fusion (EKF)', 'Computer vision · optical flow', 'Hidden Markov models', 'Gemini API', 'Sarvam AI', 'n8n automation'],
  },
  {
    icon: 'shield',
    title: 'Security & DevOps',
    sub: 'Ship it safely',
    c1: '59 130 246',
    c2: '20 184 166',
    items: ['AES-256-GCM', 'bcrypt & token hashing', 'Rate limiting', 'Nginx', 'PM2', 'Git & GitHub'],
  },
  {
    icon: 'drum',
    title: 'Beyond Engineering',
    sub: 'Rhythm & languages',
    c1: '244 114 182',
    c2: '245 158 11',
    items: ['Drums · Trinity Grade 3', 'English · Cambridge B1', 'Hindi · Prathamic', 'German · A1'],
  },
];

/* ---------- projects ---------- */
export const projects = [
  {
    id: 'dead-recon',
    featured: true,
    viz: 'radar',
    badge: 'Search & rescue',
    c1: '20 184 166',
    c2: '139 92 246',
    kicker: 'Android · Sensor fusion · Computer vision',
    year: '2026',
    title: 'DEAD RECON',
    tagline: 'GPS-denied navigation and mapping for search-and-rescue teams.',
    summary:
      'A low-cost Android tool that tells rescuers where they are and how to get back out. It works inside collapsed buildings, tunnels and smoke, where GPS fails. There are no beacons and no extra hardware: it uses only the phone’s motion sensors and camera, and it works fully offline.',
    highlights: [
      'A quaternion EKF fuses the gyroscope, accelerometer and magnetometer, and rejects magnetic interference from steel and rebar',
      'Pedestrian dead reckoning combines step detection, Weinberg stride estimation and zero-velocity updates',
      'An on-device hidden Markov model recognises walking, running, crawling, standing still and handling the phone, and adapts the filter to each',
      'Camera visual odometry uses pyramidal Lucas–Kanade optical flow, and breadcrumb guidance leads the rescuer back to the start',
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'CameraX', 'Android sensors', 'Extended Kalman filter', 'HMM', 'Optical flow'],
    links: [{ label: 'View code', href: `${GITHUB}/DEAD_RECON`, kind: 'github' }],
    caseStudy: [
      {
        h: 'The problem',
        p: 'When a building collapses or a tunnel fills with smoke, GPS signals don’t reach the people searching inside. Professional indoor-positioning gear such as UWB beacons, LiDAR rigs and foot-mounted IMUs is expensive and slow to deploy. A rescuer needs three answers at all times: where am I, where have I been, and how do I get back out?',
      },
      {
        h: 'How it works',
        steps: [
          ['Orientation EKF', 'A quaternion Extended Kalman Filter predicts attitude from the bias-corrected gyroscope. It corrects tilt using gravity from the accelerometer, gated during hard motion, and corrects heading with a tilt-compensated compass that down-weights readings disturbed by steel, rebar or machinery.'],
          ['Step-based dead reckoning', 'A peak/valley detector on the filtered acceleration finds each step. Stride length follows the Weinberg model <em>L = K·(a<sub>max</sub> − a<sub>min</sub>)<sup>1/4</sup></em>, with K calibrated by walking a known 10 m.'],
          ['Position EKF', 'A 6-state filter (position, velocity, accelerometer bias) fuses step velocity with visual velocity, and applies zero-velocity updates (ZUPT) whenever the rescuer stops.'],
          ['Motion recognition', 'A hidden Markov model with Gaussian emissions classifies stationary, walking, running, crawling and device-handling from acceleration energy, rotation energy and cadence. The mode decides which measurements the filter trusts.'],
          ['Visual odometry', 'Sparse pyramidal Lucas–Kanade tracking runs on 24 feature windows of the camera feed. A Shi–Tomasi texture test rejects smoke and blank walls, a forward–backward check rejects moving debris, and the visual scale self-calibrates against step-based speed.'],
          ['Return guidance', 'The recorded path becomes a breadcrumb trail. The app points to a waypoint about 2.5 m ahead on the reversed route and cuts out loops automatically.'],
          ['Geographic layer', 'Local east/north metres are converted to latitude and longitude on the WGS-84 ellipsoid, starting from a coordinate the rescuer enters.'],
        ],
      },
      {
        h: 'Engineering notes',
        p: 'The navigation core has no Android dependencies, so it runs and is unit-tested on a plain JVM. A built-in demo walker feeds synthetic steps through the real PDR → EKF pipeline, so the system can be tested without walking around. The Jetpack Compose interface draws the live trajectory, heading, confidence and the distance left to retrace.',
      },
    ],
  },
  {
    id: 'quantum-forge',
    viz: 'voice',
    badge: 'HackSprint 2026',
    c1: '139 92 246',
    c2: '236 72 153',
    kicker: 'Voice AI · Commerce · Automation',
    year: '2026',
    title: 'Quantum Forge',
    tagline: 'Voice-first quick delivery for neighbourhood kirana stores.',
    summary:
      'Quick commerce for the corner shop. Owners build their catalogue by photographing shelves and speaking the prices, and customers order by voice in any Indian language. AI handles translation, stock matching and insights, so the owner only has to confirm and pack.',
    highlights: [
      'Gemini turns shelf photos and spoken prices into a structured catalogue',
      'Customers order by voice in any Indian language, and Sarvam AI translates',
      'Gemini matches each request against live stock before the owner confirms',
      'Paytm handles payments, and n8n workflows automate restocking and daily voice insights',
    ],
    stack: ['Gemini', 'Sarvam AI', 'Paytm', 'n8n', 'Voice interfaces'],
    // The GitHub repo (Quantum_Forge) is still empty; add a link here once the code is pushed.
    links: [],
    context: ['Team Quantum Forge', 'HackSprint 2026 · 24-hour hackathon', 'Commudle × MAHE'],
    caseStudy: [
      {
        h: 'The problem',
        p: 'India’s kirana stores serve millions of households but are being squeezed by quick-commerce apps. Most owners have no time to type up a digital catalogue, and many customers would rather speak in their own language than navigate an English-first app.',
      },
      {
        h: 'How it works',
        steps: [
          ['Catalogue by camera and voice', 'The owner photographs the shelves and says the prices out loud. Gemini turns this into a structured product catalogue.'],
          ['Order in any Indian language', 'Customers place orders by voice, and Sarvam AI translates the request.'],
          ['Smart matching', 'Gemini maps what the customer asked for to the items actually in stock.'],
          ['Owner confirms', 'The shopkeeper reviews the order and confirms it.'],
          ['Pay', 'Paytm handles the payment.'],
          ['Automate', 'n8n workflows trigger restocking and give the owner a daily voice summary of sales and insights.'],
        ],
      },
      {
        h: 'Why voice-first',
        p: 'Voice removes the two biggest barriers for small shops: typing and English. The owner never fills in a form, and the customer never has to learn an app. The AI does the structuring in the background.',
      },
    ],
  },
  {
    id: 'cecureus',
    viz: 'breathe',
    badge: 'Mobile app',
    c1: '20 184 166',
    c2: '59 130 246',
    kicker: 'Mobile · Full-stack · Security',
    year: '2026',
    title: 'CECUREUS',
    tagline: 'A private, secure mental-health and wellbeing app.',
    summary:
      'A wellbeing platform for corporate employees and individuals. Users can find and book counsellors, track their mood, take self-assessments, keep a journal, set goals and practise guided breathing. It is built to keep sensitive data private and to stay correct when the network fails.',
    highlights: [
      'React Native + Expo app (TypeScript, Expo Router) with booking, mood tracking, assessments, journaling and breathing',
      'Self-hosted Node.js/Express + MySQL 8 backend behind Nginx and a PM2 cluster',
      'Security-first: bcrypt, SHA-256-hashed session tokens, timing-safe login, lockouts, tiered rate limits and fully parameterised SQL',
      'Idempotent bookings, an encrypted on-device journal and 140+ automated tests',
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Nginx', 'PM2', 'Jest'],
    links: [
      { label: 'App + server (v1)', href: `${GITHUB}/CECUREUS`, kind: 'github' },
      { label: 'Phase 1 app', href: `${GITHUB}/CECUREUS_DEV`, kind: 'github' },
    ],
    caseStudy: [
      {
        h: 'The idea',
        p: 'Mental-health support works best when it is easy to reach and safe to use. CECUREUS brings counsellors, self-help tools and progress tracking into one app, both for employees through their organisation (B2B) and for individuals directly (B2C).',
      },
      {
        h: 'Inside the app',
        steps: [
          ['Counsellors', 'A searchable directory with expertise filters, detailed profiles and a 14-day booking calendar.'],
          ['Track & reflect', 'Daily mood check-ins, self-assessment questionnaires, progress charts and personal goals.'],
          ['Self-care tools', 'Guided breathing exercises, a private journal, and a library of articles and videos.'],
          ['Support when it matters', 'Ally, the in-app support companion, plus one-tap “Talk to us” access to WhatsApp and a helpline.'],
        ],
      },
      {
        h: 'Backend & security',
        steps: [
          ['Credentials', 'Passwords are hashed with adaptive bcrypt (cost 12). Session tokens are random 96-character strings, and only their SHA-256 hashes are stored, so a database dump can’t be used to hijack sessions.'],
          ['Abuse resistance', 'Login is timing-safe to block user enumeration. Accounts lock after 5 failed attempts, OTPs allow 3 tries, and rate limiting is tiered across global, auth and OTP routes.'],
          ['Data integrity', 'Every query is a parameterised statement, and transactions prevent double-booking under race conditions.'],
          ['Privacy', 'Users can fully delete their account, which revokes sessions and anonymises records. Logs automatically redact passwords, OTPs and tokens.'],
        ],
      },
      {
        h: 'Phase 1 rebuild',
        p: 'The newer app (CECUREUS_DEV) is rebuilt on Expo SDK 57 and React Native 0.86, with a zod-validated API client. Every booking carries an Idempotency-Key, so a retry can never double-book or send a duplicate SMS. Journals, moods and goals stay encrypted on the device. Typechecking, linting and a suite of 140+ tests run before every commit.',
      },
    ],
  },
  {
    id: 'jql-dbms',
    viz: 'db',
    badge: 'Systems',
    c1: '59 130 246',
    c2: '20 184 166',
    kicker: 'Systems · Databases · Security',
    year: '2026',
    title: 'JQL-DBMS',
    tagline: 'A SQL-inspired database engine built from scratch.',
    summary:
      'A database engine written in Python from the ground up, to understand what really happens underneath a SQL query: parsing it, storing data on disk, and keeping that data secure.',
    highlights: [
      'A custom query parser for a SQL-inspired language',
      'A page-based storage engine that organises records the way production databases do',
      'AES-256-GCM authenticated encryption for data written to disk',
      'AI-assisted query automation to make the engine easier to use',
    ],
    stack: ['Python', 'AES-256-GCM', 'Query parsing', 'Storage engines'],
    links: [{ label: 'View repo', href: `${GITHUB}/JQL-DBMS`, kind: 'github' }],
    caseStudy: [
      {
        h: 'Why build a database?',
        p: 'Using a database is easy; understanding one is not. JQL-DBMS was written from scratch to learn the internals that every real DBMS shares, from turning text into an executable query to laying bytes out on disk securely.',
      },
      {
        h: 'Architecture',
        steps: [
          ['Query layer', 'A custom parser turns SQL-inspired statements into operations the engine can execute.'],
          ['Storage layer', 'A page-based storage engine organises records into pages on disk, the core idea behind production databases.'],
          ['Security layer', 'Data is persisted with AES-256-GCM, which gives both confidentiality and tamper detection.'],
          ['Usability layer', 'AI-assisted query automation helps users write and run queries.'],
        ],
      },
    ],
  },
  {
    id: 'smart-room',
    viz: 'photo',
    badge: 'Hardware',
    c1: '245 158 11',
    c2: '239 68 68',
    kicker: 'Hardware · Digital logic · TTL ICs',
    year: '2026',
    title: 'Smart Room Automation',
    tagline: 'A bidirectional people counter built from logic chips, with no microcontroller.',
    summary:
      'Two laser–LDR beams at the doorway detect who is entering and leaving. A flip-flop direction detector drives an up/down counter, the occupancy shows on a seven-segment display, and the light and fan switch on automatically. The fan speeds up as the room fills, and everything switches off when the last person leaves.',
    highlights: [
      'Direction detection with a 74LS74 D flip-flop and 74LS08 AND gates',
      'A 74LS192 up/down BCD counter, 74LS47 decoder and seven-segment display',
      'Zero detection through a 74LS32 OR gate switches the loads off when the room is empty',
      'Fan speed steps up with occupancy through a weighted resistor network',
    ],
    stack: ['74LS74', '74LS08', '74LS32', '74LS192', '74LS47', 'BC547', 'Laser + LDR'],
    links: [{ label: 'Try the live simulation', href: '#hardware', kind: 'internal' }],
  },
];

/* ---------- journey ---------- */
export const timeline = [
  {
    date: 'Oct 2026',
    tag: 'Hackathon',
    title: 'HackSprint 2026, a 24-hour hackathon',
    org: 'Commudle × Manipal Academy of Higher Education',
    text: 'Competed as team Quantum Forge at a 24-hour hackathon, building a voice-first quick-commerce platform for kirana stores.',
  },
  {
    date: 'Sep 2026',
    tag: 'Bootcamp',
    title: 'Sustain Agentic Bootcamp',
    org: 'SRM IST · School of Computing',
    text: 'A two-day bootcamp on designing and building sustainable, intelligent AI agentic systems, run with Smarther Technologies and AMIEE.',
  },
  {
    date: '2026',
    tag: 'Hackathon',
    title: 'Bit N Build ’26 International Hackathon',
    org: 'GDG on Campus · Fr. CRCE, Mumbai',
    text: 'Took part as “Yet Another Team” in the international hackathon organised by Google Developer Groups on Campus at Fr. Conceicao Rodrigues College of Engineering.',
  },
  {
    date: '2026',
    tag: 'Hardware',
    title: 'Smart Room Automation',
    org: 'Devices & Digital IC Lab · SRM IST',
    text: 'Designed and built a microcontroller-free occupancy counter and room controller from TTL logic ICs.',
  },
  {
    date: '2025',
    tag: 'Education',
    title: 'B.Tech in Electronics & Communication Engineering',
    org: 'SRM Institute of Science and Technology, Chennai',
    text: 'Began engineering studies across electronics, digital systems and computing, now in my second year.',
  },
  {
    date: 'Jun 2024',
    tag: 'Course',
    title: 'Certificate Course in Python',
    org: 'CSC Computer Software College',
    text: 'Completed a two-month course covering functions, modules, packages, file I/O, exception handling and inheritance, with an overall grade of A (Excellent).',
  },
  {
    date: 'Jan 2023',
    tag: 'Competition',
    title: 'Open House Competition',
    org: 'Hindustan Institute of Technology & Science · Dept. of EEE',
    text: 'Received a certificate of appreciation for taking part in the EEE department’s open house quiz competition.',
  },
];

/* ---------- certificates (coastal clean-up intentionally excluded) ---------- */
export const certCategories = { tech: 'Tech & Hackathons', lang: 'Languages', music: 'Music' };

export const certificates = [
  {
    slug: 'hacksprint-2026',
    cat: 'tech',
    title: 'HackSprint 2026: 24-Hour Hackathon',
    issuer: 'Commudle × Manipal Academy of Higher Education',
    date: 'Oct 2026',
    note: 'Certificate of participation, team Quantum Forge. Held at MAHE on 17–18 October 2026.',
  },
  {
    slug: 'sustain-agentic-bootcamp',
    cat: 'tech',
    title: 'Sustain Agentic Bootcamp',
    issuer: 'SRM IST · School of Computing',
    date: 'Sep 2026',
    note: 'Designing and building sustainable, intelligent AI agentic systems. With Smarther Technologies and AMIEE, 29–30 September 2026.',
  },
  {
    slug: 'bit-n-build-2026',
    cat: 'tech',
    title: 'Bit N Build ’26 International Hackathon',
    issuer: 'Google Developer Groups on Campus · Fr. CRCE',
    date: '2026',
    note: 'Certificate of participation, “Yet Another Team”.',
  },
  {
    slug: 'csc-python',
    cat: 'tech',
    title: 'Certificate Course in Python',
    issuer: 'CSC Computer Software College',
    date: 'Jun 2024',
    note: 'Overall grade A (Excellent). Covered functions, modules, packages, file I/O, exception handling and inheritance.',
  },
  {
    slug: 'hindustan-open-house',
    cat: 'tech',
    title: 'Open House Competition',
    issuer: 'Hindustan Institute of Technology & Science',
    date: 'Jan 2023',
    note: 'Certificate of appreciation from the Department of EEE, 5–6 January 2023.',
  },
  {
    slug: 'solve-ninja-hackathon',
    cat: 'tech',
    title: 'Sarvalokaa Hackathon',
    issuer: 'Solve Ninja · Reap Benefit × Chettinad Sarvalokaa Education',
    date: '',
    note: 'Recognised as a Level 2 “Hands-On Hippo” on the Solve Ninja Public Problem Solving Index.',
  },
  {
    slug: 'cambridge-b1',
    cat: 'lang',
    title: 'Cambridge English: B1',
    issuer: 'Cambridge Assessment English',
    date: 'Mar 2022',
    note: 'Overall score 153, Council of Europe Level B1 (Entry Level Certificate in ESOL International).',
  },
  {
    slug: 'german-a1',
    cat: 'lang',
    title: 'German A1',
    issuer: 'Let’s Speak Language Training Academy, Chennai',
    date: 'Jul 2023',
    note: 'Completed the A1 German language course.',
  },
  {
    slug: 'hindi-prathamic',
    cat: 'lang',
    title: 'Hindi: Prathamic Examination',
    issuer: 'Dakshina Bharat Hindi Prachar Sabha',
    date: 'Feb 2021',
    note: 'Passed in First Class.',
  },
  {
    slug: 'trinity-drums-grade3',
    cat: 'music',
    title: 'Drum Kit: Grade 3',
    issuer: 'Trinity College London',
    date: 'Jan 2020',
    note: 'Graded examination in music performance.',
  },
  {
    slug: 'trinity-drums-grade2',
    cat: 'music',
    title: 'Drum Kit: Grade 2, with Merit',
    issuer: 'Trinity College London',
    date: 'Jul 2018',
    note: 'Graded examination in music performance, passed with Merit.',
  },
  {
    slug: 'trinity-drums-grade1',
    cat: 'music',
    title: 'Drum Kit: Grade 1, with Merit',
    issuer: 'Trinity College London',
    date: 'Jul 2017',
    note: 'Graded examination in music performance, passed with Merit.',
  },
];
