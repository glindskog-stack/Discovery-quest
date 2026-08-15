// Rocket Science: a short, fixed 3-stage curriculum — real rocketry
// fundamentals, not the adaptive random-pick pool the rest of the app
// uses. Finishing a stage visibly drops that stage's rocket part —
// boosters first, then the body/fuel tank, then just the capsule is left
// — so the "build a rocket" reward and the course are the same thing,
// not two systems bolted together.
//
// Node shape mirrors js/data.js's QUESTIONS bank (style: "rigorous" with
// choices/answer/explain/source, or "creative" with freeResponse/minWords)
// so the existing Grading module and citation conventions apply here too.
// English lives here; localizeQuestions() (js/questions-i18n.js) also
// walks ROCKET_COURSE, same mechanism as the main question bank.

const ROCKET_COURSE = [
  {
    id: "boosters",
    part: "booster",
    titleKey: "rocket.stage1_title",
    subtitleKey: "rocket.stage1_subtitle",
    nodes: [
      {
        id: "rc1-1", style: "rigorous",
        q: "A rocket lifts off by throwing hot gas out one way, which pushes the rocket the other way. Which law of motion is that?",
        choices: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Bernoulli's Principle"],
        answer: 2,
        explain: "Every action has an equal and opposite reaction — the exhaust goes down, the rocket goes up.",
        source: "Newton's Laws of Motion", verifiedAt: "2026-08",
      },
      {
        id: "rc1-2", style: "rigorous",
        q: "For a rocket to actually leave the pad, its thrust has to be greater than what?",
        choices: ["The speed of sound", "Its own weight", "The air pressure", "The fuel tank's size"],
        answer: 1,
        explain: "Thrust-to-weight ratio has to clear 1, or the rocket just sits there burning fuel without moving.",
        source: "Rocket Propulsion Fundamentals", verifiedAt: "2026-08",
      },
      {
        id: "rc1-3", style: "rigorous",
        q: "Rockets like Falcon 9 drop their first (booster) stage once its fuel is spent. Why?",
        choices: ["To save it for later", "It's dead weight the rocket no longer needs to keep accelerating", "It's required by law", "To slow the rocket down"],
        answer: 1,
        explain: "Hauling an empty tank and spent engines the rest of the way wastes fuel — dropping them is the rocket unhooking a trailer it doesn't need anymore.",
        source: "Multistage rocket design", verifiedAt: "2026-08",
      },
      {
        id: "rc1-4", style: "rigorous",
        q: "What do rocket engines actually burn to produce thrust?",
        choices: ["Just fuel", "Fuel and an oxidizer", "Compressed air", "Electricity only"],
        answer: 1,
        explain: "Unlike a car engine, a rocket has to carry its own oxidizer too — there's no air to burn fuel with once you leave the atmosphere.",
        source: "Rocket Propulsion Fundamentals", verifiedAt: "2026-08",
      },
      {
        id: "rc1-5", style: "creative", freeResponse: true, minWords: 5,
        q: "You're designing the booster stage for a brand-new rocket. What's one creative feature it has, and what problem does it solve?",
      },
    ],
  },
  {
    id: "orbit",
    part: "body",
    titleKey: "rocket.stage2_title",
    subtitleKey: "rocket.stage2_subtitle",
    nodes: [
      {
        id: "rc2-1", style: "rigorous",
        q: "To stay in orbit, a spacecraft doesn't need to go 'up' so much as it needs to go...",
        choices: ["Sideways, fast enough to keep missing the ground as it falls", "Straight up and stop", "Backwards relative to Earth's spin", "Nowhere — orbit just means very high up"],
        answer: 0,
        explain: "This is Newton's cannonball idea: orbit is a controlled fall that never lands, because you're moving fast enough sideways to keep curving past the horizon.",
        source: "Orbital mechanics basics", verifiedAt: "2026-08",
      },
      {
        id: "rc2-2", style: "rigorous",
        q: "Roughly how fast does a spacecraft need to travel to stay in low Earth orbit?",
        choices: ["About 100 km/h", "About 1,000 km/h", "About 28,000 km/h", "About 300,000 km/h"],
        answer: 2,
        explain: "That's roughly 7.8 km/s — fast enough that the curve of your fall matches the curve of the Earth.",
        source: "NASA", verifiedAt: "2026-08",
      },
      {
        id: "rc2-3", style: "rigorous",
        q: "Why do rockets use multiple stages instead of one giant single-stage rocket?",
        choices: ["Multiple smaller rockets are cheaper to paint", "Each stage gets lighter once the previous stage's dead weight is dropped, so less fuel is wasted moving empty tanks", "It's easier to launch three rockets than one", "Single-stage rockets aren't allowed above the atmosphere"],
        answer: 1,
        explain: "Dragging empty fuel tanks the whole way to orbit is wasteful — staging lets each phase of the climb carry only what it still needs.",
        source: "Tsiolkovsky rocket equation (simplified)", verifiedAt: "2026-08",
      },
      {
        id: "rc2-4", style: "rigorous",
        q: "What's the name for the total 'push' a rocket has left to change its speed or direction — basically its fuel budget, measured in velocity?",
        choices: ["Delta-v", "Escape velocity", "G-force", "Apogee"],
        answer: 0,
        explain: "Mission planners budget delta-v (in km/s) the way you'd budget money — every maneuver spends some of it.",
        source: "Orbital mechanics", verifiedAt: "2026-08",
      },
      {
        id: "rc2-5", style: "creative", freeResponse: true, minWords: 5,
        q: "Your rocket just reached orbit, and the second stage's fuel tank is empty and about to be dropped. Write the moment from the pilot's point of view.",
      },
    ],
  },
  {
    id: "splashdown",
    part: null, // the capsule never drops — it's what's left once the other two parts are gone
    titleKey: "rocket.stage3_title",
    subtitleKey: "rocket.stage3_subtitle",
    nodes: [
      {
        id: "rc3-1", style: "rigorous",
        q: "Why is the crew capsule so much smaller than the rest of the rocket?",
        choices: ["It's cheaper to build small", "Everything else was fuel and engines just to get it moving — only the capsule needs to survive the whole trip", "Smaller capsules fly faster", "Regulations cap capsule size"],
        answer: 1,
        explain: "The booster and fuel tank did their job and got dropped — the capsule is the only part that actually needs life support and has to come home.",
        source: "Human spaceflight basics", verifiedAt: "2026-08",
      },
      {
        id: "rc3-2", style: "rigorous",
        q: "As a capsule re-enters the atmosphere at high speed, most of that speed turns into...",
        choices: ["Heat, from air friction and compression", "Sound only", "Extra speed", "Light, with no heat"],
        answer: 0,
        explain: "A heat shield's whole job is managing that heat so it doesn't reach the crew.",
        source: "Atmospheric re-entry physics", verifiedAt: "2026-08",
      },
      {
        id: "rc3-3", style: "rigorous",
        q: "What's an 'ablative' heat shield designed to do?",
        choices: ["Reflect all heat away instantly", "Burn away and erode on purpose, carrying heat with it as it goes", "Stay perfectly intact through re-entry", "Cool the capsule with liquid nitrogen"],
        answer: 1,
        explain: "Apollo's AVCOAT and Dragon's PICA-X shields are both ablative — they're meant to char and flake off, taking heat with them.",
        source: "Apollo & Dragon heat shield design", verifiedAt: "2026-08",
      },
      {
        id: "rc3-4", style: "rigorous",
        q: "Which rocket family made reusable boosters — flying themselves back down and landing upright — a routine part of orbital launches?",
        choices: ["Falcon 9", "Saturn V", "Soyuz", "Space Shuttle"],
        answer: 0,
        explain: "SpaceX's Falcon 9 boosters land and refly, which is a big part of why launches got cheaper.",
        source: "SpaceX", verifiedAt: "2026-08",
      },
      {
        id: "rc3-5", style: "creative", freeResponse: true, minWords: 5,
        q: "Plan a realistic space mission: where's it going, what's the crew size, and what's the single biggest risk you'd need to design around?",
      },
    ],
  },
];

function localizeRocketCourse() {
  ROCKET_COURSE.forEach((stage) => {
    stage.title = I18n.t(stage.titleKey);
    stage.subtitle = I18n.t(stage.subtitleKey);
  });
}
