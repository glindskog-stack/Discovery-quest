// Content bank + config for Discovery Quest.
//
// Every prompt is tagged { domain, topic, style, tier }:
//   - style: "rigorous" (has a correct answer) or "creative" (open response,
//     judged by whether you engaged with it + how you rated it — never by
//     being "right"). All four domains carry both styles so the adaptive
//     engine has something real to switch between everywhere, not just in
//     writing.
//   - tier: 1 (warm-up) / 2 (core) / 3 (deep cut). The engine nudges tier
//     up on a correct/engaged answer and down on a miss/bail, per domain.
//   - topic: a free-form tag (e.g. "algebra", "git", "mythology") — the
//     Focus screen derives its topic chips straight from these, so a new
//     question with a new topic string shows up there automatically.
//   - region (trivia only, optional): "Europe" | "Asia" | "Africa" |
//     "Americas" | "Oceania" | "Global" — lets the Focus screen narrow
//     trivia by geography. Omit it (or use "Global") for anything that
//     isn't tied to a place.
//   - source / verifiedAt (rigorous facts only): a named reference and the
//     month it was last checked against that reference. No fabricated deep
//     links — a plain, searchable source name, so a claim can always be
//     re-checked instead of just trusted. See docs/CONTENT_REFRESH.md for
//     the process that keeps these current.
//
// Add more prompts by pushing onto QUESTIONS[domain] with the same shape —
// nothing else needs to change; the Focus screen and engine both read the
// bank directly rather than a hand-maintained duplicate list.

// Accent hexes are validated as a categorical set against the app's near-
// black surface (dataviz skill: OKLCH lightness band + CVD separation) —
// see tools/palette-check.sh. DOMAIN_ORDER is the one fixed order they're
// ever shown adjacent in (dashboard bars, legends); it's what keeps the
// green/amber pair from colliding under deuteranopia. Don't reorder without
// re-running the validator.
const DOMAIN_ORDER = ["math", "coding", "writing", "trivia"];

const DOMAINS = {
  math: {
    id: "math",
    label: "Math & Science",
    shortLabel: "Math/Sci",
    icon: "🧪",
    tagline: "Break things down until they make sense.",
    accent: "#0098c7", // azure
    levels: ["Static", "Signal", "Charged", "Singularity", "Unstable Genius"],
  },
  writing: {
    id: "writing",
    label: "Creative Writing",
    shortLabel: "Writing",
    icon: "🖋️",
    tagline: "Choices branch the story. There's no wrong draft.",
    accent: "#ef06b1", // magenta
    levels: ["Draft Zero", "Ink Slinger", "Plot Twister", "Cult Author", "Ghostwriter of Legend"],
  },
  coding: {
    id: "coding",
    label: "Coding",
    shortLabel: "Code",
    icon: "⌁",
    tagline: "Trace it, break it, rebuild it better.",
    accent: "#719f04", // acid green
    levels: ["Script Kid", "Byte Bender", "Stack Overflow Regular", "Root Access", "Kernel Whisperer"],
  },
  trivia: {
    id: "trivia",
    label: "Trivia",
    shortLabel: "Trivia",
    icon: "◈",
    tagline: "Random knowledge. Deploy at will.",
    accent: "#bd8005", // amber
    levels: ["Lurker", "Deep Cut", "Rabbit Hole", "Walking Wikipedia", "Oracle"],
  },
};

const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500];
const REGIONS = ["Europe", "Asia", "Africa", "Americas", "Oceania", "Global"];

const QUESTIONS = {
  math: [
    { id: "m1-1", domain: "math", topic: "arithmetic", style: "rigorous", tier: 1, q: "What is 12% of 150?", choices: ["12", "18", "24", "30"], answer: 1, explain: "10% of 150 is 15, 2% is 3 — 18 total.", source: "Arithmetic", verifiedAt: "2026-08" },
    { id: "m1-2", domain: "math", topic: "biology", style: "rigorous", tier: 1, q: "Which gas do plants pull from the air to build sugar?", choices: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: 2, explain: "Photosynthesis: CO2 in, O2 out.", source: "Encyclopaedia Britannica", verifiedAt: "2026-08" },
    { id: "m1-3", domain: "math", topic: "physics", style: "rigorous", tier: 1, q: "Water boils at what temperature at sea level?", choices: ["90°C", "100°C", "110°C", "212°C"], answer: 1, explain: "212 is the Fahrenheit trap.", source: "NIST", verifiedAt: "2026-08" },
    { id: "m1-4", domain: "math", topic: "arithmetic", style: "rigorous", tier: 1, q: "Solve: 7 + 6 × 2", choices: ["26", "19", "20", "13"], answer: 1, explain: "Order of operations: 6×2 first.", source: "Arithmetic", verifiedAt: "2026-08" },
    { id: "m1-5", domain: "math", topic: "astronomy", style: "rigorous", tier: 1, q: "Which planet is nicknamed the Red Planet?", choices: ["Venus", "Jupiter", "Mars", "Mercury"], answer: 2, source: "NASA", verifiedAt: "2026-08" },
    { id: "m2-1", domain: "math", topic: "algebra", style: "rigorous", tier: 2, q: "Solve for x: 3x - 7 = 20", choices: ["7", "8", "9", "13"], answer: 2, explain: "3x = 27 → x = 9.", source: "Algebra", verifiedAt: "2026-08" },
    { id: "m2-2", domain: "math", topic: "biology", style: "rigorous", tier: 2, q: "Which part of a cell holds its DNA?", choices: ["Mitochondria", "Nucleus", "Ribosome", "Cytoplasm"], answer: 1, source: "Encyclopaedia Britannica", verifiedAt: "2026-08" },
    { id: "m2-3", domain: "math", topic: "chemistry", style: "rigorous", tier: 2, q: "What's the chemical symbol for sodium?", choices: ["So", "Sd", "Na", "S"], answer: 2, explain: "From natrium, its Latin name.", source: "IUPAC periodic table", verifiedAt: "2026-08" },
    { id: "m2-4", domain: "math", topic: "geometry", style: "rigorous", tier: 2, q: "A right triangle has legs 6 and 8. What's the hypotenuse?", choices: ["9", "10", "12", "14"], answer: 1, explain: "6² + 8² = 100 = 10².", source: "Geometry", verifiedAt: "2026-08" },
    { id: "m2-5", domain: "math", topic: "physics", style: "rigorous", tier: 2, q: "Force equals mass times what?", choices: ["Velocity", "Acceleration", "Momentum", "Displacement"], answer: 1, explain: "Newton's second law: F = ma.", source: "Newton's Laws of Motion", verifiedAt: "2026-08" },
    { id: "m3-1", domain: "math", topic: "calculus", style: "rigorous", tier: 3, q: "What's the derivative of x³?", choices: ["x²", "3x", "3x²", "x³/3"], answer: 2, source: "Calculus (power rule)", verifiedAt: "2026-08" },
    { id: "m3-2", domain: "math", topic: "biology", style: "rigorous", tier: 3, q: "Two heterozygous parents (Aa × Aa) — what fraction of offspring is aa?", choices: ["1/4", "1/2", "3/4", "0"], answer: 0, explain: "Punnett square: AA, Aa, aA, aa — 1 in 4.", source: "Mendelian genetics", verifiedAt: "2026-08" },
    { id: "m3-3", domain: "math", topic: "chemistry", style: "rigorous", tier: 3, q: "What's the pH of a neutral solution at 25°C?", choices: ["0", "7", "10", "14"], answer: 1, source: "IUPAC", verifiedAt: "2026-08" },
    { id: "m3-4", domain: "math", topic: "algebra", style: "rigorous", tier: 3, q: "Solve: log₂(x) = 5", choices: ["10", "16", "32", "25"], answer: 2, explain: "2^5 = 32.", source: "Algebra (logarithms)", verifiedAt: "2026-08" },
    { id: "mc-1", domain: "math", topic: "physics", style: "creative", tier: 1, q: "Invent one new law of physics. What breaks, and what becomes possible?", freeResponse: true, minWords: 12 },
    { id: "mc-2", domain: "math", topic: "biology", style: "creative", tier: 1, q: "Design an animal that would survive on a planet with triple Earth's gravity. What does it look like?", freeResponse: true, minWords: 12 },
    { id: "mc-3", domain: "math", topic: "astronomy", style: "creative", tier: 2, q: "You get to name a newly discovered exoplanet. What's the name and the one-line pitch for why humans should visit?", freeResponse: true, minWords: 15 },
    { id: "mc-4", domain: "math", topic: "chemistry", style: "creative", tier: 2, q: "Explain why the sky is blue to someone who's never had a science class — no jargon allowed.", freeResponse: true, minWords: 15 },
  ],

  coding: [
    { id: "c1-1", domain: "coding", topic: "operators", style: "rigorous", tier: 1, q: "In most languages, what does `%` do between two integers?", choices: ["Divides them", "Multiplies them", "Gives the remainder", "Rounds them"], answer: 2, source: "MDN Web Docs", verifiedAt: "2026-08" },
    { id: "c1-2", domain: "coding", topic: "js-basics", style: "rigorous", tier: 1, q: "What does `console.log(2 + '2')` print?", choices: ["4", "'22'", "NaN", "Error"], answer: 1, explain: "Number gets coerced to a string; + concatenates.", source: "MDN Web Docs", verifiedAt: "2026-08" },
    { id: "c1-3", domain: "coding", topic: "python-basics", style: "rigorous", tier: 1, q: "Which symbol starts a comment in Python?", choices: ["//", "#", "<!--", "/*"], answer: 1, source: "Python docs", verifiedAt: "2026-08" },
    { id: "c1-4", domain: "coding", topic: "data-structures", style: "rigorous", tier: 1, q: "Which structure is Last-In-First-Out?", choices: ["Queue", "Stack", "Array", "Tree"], answer: 1, source: "CS fundamentals", verifiedAt: "2026-08" },
    { id: "c1-5", domain: "coding", topic: "web", style: "rigorous", tier: 1, q: "What does HTML stand for?", choices: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Management Log", "Home Tool Markup Language"], answer: 0, source: "W3C", verifiedAt: "2026-08" },
    { id: "c2-1", domain: "coding", topic: "algorithms", style: "rigorous", tier: 2, q: "Time complexity of binary search on n sorted items?", choices: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], answer: 2, source: "CS fundamentals", verifiedAt: "2026-08" },
    { id: "c2-2", domain: "coding", topic: "python-basics", style: "rigorous", tier: 2, q: "Correct equality check in Python?", choices: ["x = 5", "x == 5", "x === 5", "x eq 5"], answer: 1, source: "Python docs", verifiedAt: "2026-08" },
    { id: "c2-3", domain: "coding", topic: "git", style: "rigorous", tier: 2, q: "Which Git command creates a new branch and switches to it in one shot?", choices: ["git branch -m", "git switch", "git checkout -b", "git merge"], answer: 2, source: "Git docs", verifiedAt: "2026-08" },
    { id: "c2-4", domain: "coding", topic: "scope", style: "rigorous", tier: 2, q: "A variable only visible inside the function that declared it is called...", choices: ["Global", "Local", "Constant", "Static"], answer: 1, source: "CS fundamentals", verifiedAt: "2026-08" },
    { id: "c2-5", domain: "coding", topic: "web", style: "rigorous", tier: 2, q: "What does an API primarily let two programs do?", choices: ["Share a screen", "Talk to each other", "Compile code", "Store files"], answer: 1, source: "CS fundamentals", verifiedAt: "2026-08" },
    { id: "c3-1", domain: "coding", topic: "js-basics", style: "rigorous", tier: 3, q: "Output of `[1,2,3].map(x => x * 2).filter(x => x > 2)`?", choices: ["[2,4,6]", "[4,6]", "[2,3]", "[1,2,3]"], answer: 1, source: "MDN Web Docs", verifiedAt: "2026-08" },
    { id: "c3-2", domain: "coding", topic: "algorithms", style: "rigorous", tier: 3, q: "Better average-case time complexity: bubble sort or quicksort?", choices: ["Bubble sort", "Quicksort", "Equal", "Neither sorts"], answer: 1, source: "CS fundamentals", verifiedAt: "2026-08" },
    { id: "c3-3", domain: "coding", topic: "recursion", style: "rigorous", tier: 3, q: "What does recursion need to avoid running forever?", choices: ["A loop", "A base case", "A global variable", "A class"], answer: 1, source: "CS fundamentals", verifiedAt: "2026-08" },
    { id: "c3-4", domain: "coding", topic: "data-structures", style: "rigorous", tier: 3, q: "In a hash map, what causes a 'collision'?", choices: ["Two keys hashing to the same slot", "Running out of memory", "A syntax error", "Deleting a missing key"], answer: 0, source: "CS fundamentals", verifiedAt: "2026-08" },
    { id: "cc-1", domain: "coding", topic: "debugging", style: "creative", tier: 1, q: "Describe, in plain English, how you'd find a bug that only happens 'sometimes.' No code — just your approach.", freeResponse: true, minWords: 15 },
    { id: "cc-2", domain: "coding", topic: "design", style: "creative", tier: 1, q: "Sketch the logic (pseudocode is fine) for an app that reminds you to text someone back after 3 days of silence.", freeResponse: true, minWords: 15 },
    { id: "cc-3", domain: "coding", topic: "algorithms", style: "creative", tier: 2, q: "Explain how you'd sort a deck of cards by hand, then say which real sorting algorithm that resembles.", freeResponse: true, minWords: 15 },
    { id: "cc-4", domain: "coding", topic: "design", style: "creative", tier: 2, q: "You're building an app for something you're annoyed by IRL. What does it do and what's the one feature that matters?", freeResponse: true, minWords: 15 },
  ],

  trivia: [
    { id: "t1-1", domain: "trivia", topic: "geography", region: "Europe", style: "rigorous", tier: 1, q: "Which country is home to the Eiffel Tower?", choices: ["Italy", "France", "Spain", "Germany"], answer: 1, source: "CIA World Factbook", verifiedAt: "2026-08" },
    { id: "t1-2", domain: "trivia", topic: "geography", region: "Global", style: "rigorous", tier: 1, q: "What's the largest ocean on Earth?", choices: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3, source: "NOAA", verifiedAt: "2026-08" },
    { id: "t1-3", domain: "trivia", topic: "pop-culture", region: "Global", style: "rigorous", tier: 1, q: "Which instrument has 88 keys?", choices: ["Guitar", "Piano", "Violin", "Drum kit"], answer: 1, source: "General knowledge", verifiedAt: "2026-08" },
    { id: "t1-4", domain: "trivia", topic: "geography", region: "Asia", style: "rigorous", tier: 1, q: "What's the currency of Japan?", choices: ["Won", "Yuan", "Yen", "Ringgit"], answer: 2, source: "CIA World Factbook", verifiedAt: "2026-08" },
    { id: "t1-5", domain: "trivia", topic: "pop-culture", region: "Global", style: "rigorous", tier: 1, q: "Twitter's old logo was a small blue what?", choices: ["Owl", "Bird", "Fish", "Bee"], answer: 1, source: "General knowledge", verifiedAt: "2026-08" },
    { id: "t2-1", domain: "trivia", topic: "art", region: "Europe", style: "rigorous", tier: 2, q: "Who painted the Mona Lisa?", choices: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"], answer: 1, source: "Louvre Museum", verifiedAt: "2026-08" },
    { id: "t2-2", domain: "trivia", topic: "sports", region: "Americas", style: "rigorous", tier: 2, q: "Which country hosted the 2016 Summer Olympics?", choices: ["China", "UK", "Brazil", "Japan"], answer: 2, source: "International Olympic Committee", verifiedAt: "2026-08" },
    { id: "t2-3", domain: "trivia", topic: "geography", region: "Europe", style: "rigorous", tier: 2, q: "Smallest country in the world by area?", choices: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: 1, source: "CIA World Factbook", verifiedAt: "2026-08" },
    { id: "t2-4", domain: "trivia", topic: "mythology", region: "Europe", style: "rigorous", tier: 2, q: "In Greek mythology, who rules the sea?", choices: ["Zeus", "Apollo", "Poseidon", "Hades"], answer: 2, source: "Encyclopaedia Britannica", verifiedAt: "2026-08" },
    { id: "t2-5", domain: "trivia", topic: "history", region: "Europe", style: "rigorous", tier: 2, q: "What year did the Berlin Wall fall?", choices: ["1987", "1989", "1991", "1993"], answer: 1, source: "Encyclopaedia Britannica", verifiedAt: "2026-08" },
    { id: "t3-1", domain: "trivia", topic: "history", region: "Africa", style: "rigorous", tier: 3, q: "Which wonder of the ancient world stood in Alexandria, Egypt?", choices: ["Hanging Gardens", "Colossus of Rhodes", "The Lighthouse (Pharos)", "Temple of Artemis"], answer: 2, source: "Encyclopaedia Britannica", verifiedAt: "2026-08" },
    { id: "t3-2", domain: "trivia", topic: "history", region: "Global", style: "rigorous", tier: 3, q: "Who was the first person to walk on the Moon?", choices: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"], answer: 2, source: "NASA", verifiedAt: "2026-08" },
    { id: "t3-3", domain: "trivia", topic: "history", region: "Asia", style: "rigorous", tier: 3, q: "Which empire did Genghis Khan rule?", choices: ["Ottoman Empire", "Mongol Empire", "Roman Empire", "Persian Empire"], answer: 1, source: "Encyclopaedia Britannica", verifiedAt: "2026-08" },
    { id: "t3-4", domain: "trivia", topic: "geography", region: "Africa", style: "rigorous", tier: 3, q: "Which African country was never colonized by a European power?", choices: ["Kenya", "Ethiopia", "Nigeria", "Ghana"], answer: 1, source: "Encyclopaedia Britannica", verifiedAt: "2026-08" },
    { id: "tc-1", domain: "trivia", topic: "history", region: "Global", style: "creative", tier: 1, q: "Pick a historical era to time-travel to for exactly one day. What do you do first?", freeResponse: true, minWords: 12 },
    { id: "tc-2", domain: "trivia", topic: "pop-culture", region: "Global", style: "creative", tier: 1, q: "Pitch a conspiracy theory so unhinged it loops back around to being kind of genius.", freeResponse: true, minWords: 12 },
    { id: "tc-3", domain: "trivia", topic: "geography", region: "Global", style: "creative", tier: 2, q: "Design a new country from scratch: flag, one law, one national holiday. Go.", freeResponse: true, minWords: 15 },
    { id: "tc-4", domain: "trivia", topic: "mythology", region: "Global", style: "creative", tier: 2, q: "Invent a minor god for something extremely specific and modern (e.g. 'god of dead phone batteries'). What do they control?", freeResponse: true, minWords: 15 },
  ],

  // Creative writing branches by choice, not correctness. `next` maps each
  // choice index to the id of the follow-up prompt, so the same starting
  // point grows into different short story paths. Nodes without `next`
  // (the "spark" prompts) are standalone one-offs the engine can slot in
  // any time it wants a quick creative beat that doesn't chain further.
  writing: [
    {
      id: "w-start", domain: "writing", topic: "openings", style: "creative", tier: 1,
      q: "Pick an opening line to build a story from:",
      choices: ["\"The last email arrived at 3:12 a.m.\"", "\"Nobody believed the door had always been there.\"", "\"She kept the astronaut's glove in her locker.\"", "\"By the time the power came back, the town had voted on something.\""],
      next: ["w-mystery", "w-fantasy", "w-scifi", "w-dystopia"],
    },
    { id: "w-mystery", domain: "writing", topic: "mystery", style: "creative", tier: 2, branchOnly: true, q: "Continue it in 2-3 sentences: who sent the email, and why does it matter?", freeResponse: true, minWords: 15, next: ["w-mystery-2"] },
    { id: "w-fantasy", domain: "writing", topic: "fantasy", style: "creative", tier: 2, branchOnly: true, q: "Continue it in 2-3 sentences: what's on the other side of the door?", freeResponse: true, minWords: 15, next: ["w-fantasy-2"] },
    { id: "w-scifi", domain: "writing", topic: "scifi", style: "creative", tier: 2, branchOnly: true, q: "Continue it in 2-3 sentences: whose glove was it, and how did she get it?", freeResponse: true, minWords: 15, next: ["w-scifi-2"] },
    { id: "w-dystopia", domain: "writing", topic: "dystopia", style: "creative", tier: 2, branchOnly: true, q: "Continue it in 2-3 sentences: what did the town vote on, and who's not happy about it?", freeResponse: true, minWords: 15, next: ["w-dystopia-2"] },
    { id: "w-mystery-2", domain: "writing", topic: "mystery", style: "creative", tier: 3, branchOnly: true, q: "Twist time: reveal one detail that makes the reader distrust the narrator.", freeResponse: true, minWords: 20 },
    { id: "w-fantasy-2", domain: "writing", topic: "fantasy", style: "creative", tier: 3, branchOnly: true, q: "Twist time: the door leads somewhere that shouldn't exist. Describe it using an unexpected sense (smell, sound, touch).", freeResponse: true, minWords: 20 },
    { id: "w-scifi-2", domain: "writing", topic: "scifi", style: "creative", tier: 3, branchOnly: true, q: "Twist time: the glove still works, and it was never meant to be found. Write the moment she realizes that.", freeResponse: true, minWords: 20 },
    { id: "w-dystopia-2", domain: "writing", topic: "dystopia", style: "creative", tier: 3, branchOnly: true, q: "Twist time: the vote turns out to have been rigged by someone the narrator trusts. Write the reveal.", freeResponse: true, minWords: 20 },
    { id: "w-spark-1", domain: "writing", topic: "pitch", style: "creative", tier: 1, q: "Write a one-line movie pitch mashing up two genres you love.", freeResponse: true, minWords: 8 },
    { id: "w-spark-2", domain: "writing", topic: "description", style: "creative", tier: 1, q: "Describe a color to someone who's never seen it.", freeResponse: true, minWords: 10 },
    { id: "w-spark-3", domain: "writing", topic: "character", style: "creative", tier: 1, q: "Give a villain a totally mundane Monday morning.", freeResponse: true, minWords: 12 },
    { id: "w-spark-4", domain: "writing", topic: "dialogue", style: "creative", tier: 2, q: "Write dialogue between two people who are both lying, without either of them saying so.", freeResponse: true, minWords: 15 },
    { id: "w-spark-5", domain: "writing", topic: "worldbuilding", style: "creative", tier: 2, q: "Invent a new holiday and explain why the world suddenly needs it.", freeResponse: true, minWords: 15 },
    { id: "w-spark-6", domain: "writing", topic: "poetry", style: "creative", tier: 2, q: "Write four lines about a place you've never been.", freeResponse: true, minWords: 10 },
  ],
};

// ---------- Derived taxonomy (Focus screen reads these, never a hand-kept list) ----------

function topicsForDomain(domainId) {
  const seen = new Set();
  QUESTIONS[domainId].forEach((n) => seen.add(n.topic));
  return [...seen].sort();
}

function regionsInUse() {
  const seen = new Set();
  QUESTIONS.trivia.forEach((n) => { if (n.region) seen.add(n.region); });
  return REGIONS.filter((r) => seen.has(r));
}
