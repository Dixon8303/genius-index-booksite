/* Customer-facing daily instructions for the 30-day Amplification Protocol.
   The book's PROTOCOL_DOMAIN strings are compressed week labels; this layer
   turns them into a concrete, plain-language assignment for every day, per
   domain. Structure of the month:
     Days 1–3   Awareness   — name the gift and catch it in the wild
     Days 4–7   Assessment  — set up and run a measurable baseline
     Days 8–21  Practice    — four rotating drills, ~15–20 min a day
     Days 22–27 Integration — use it in real situations
     Days 28–30 Mastery     — retest the same baseline, compare, claim it */

import { DOMAIN_BY_ID, type DomainId } from "../data/domains";

export interface DayTask {
  stageName: string;
  title: string;
  body: string;
  safety?: string;
}

interface DomainProtocolDetail {
  /* one plain sentence for the domain picker */
  summary: string;
  /* day 4: what to prepare */
  baselineSetup: string;
  /* day 5: how to run the cold measurement */
  baselineRun: string;
  /* days 8–21: four drills, cycled */
  drills: { name: string; how: string }[];
  /* days 22–27: three real-world assignments, cycled */
  integration: string[];
  /* shown on physical days when present */
  safety?: string;
}

const DETAIL: Record<DomainId, DomainProtocolDetail> = {
  KIN: {
    summary:
      "Pick one physical skill you can't do yet and measurably own it in 30 days — filmed before and after.",
    baselineSetup:
      "Pick one physical skill you can't do yet but could practice at home: juggling three balls, a dance step sequence, a pen spin, a footwork drill, a knife-skills cut. Gather what you need and set your phone somewhere it can film you.",
    baselineRun:
      "Film yourself attempting the skill completely cold — no warm-up, no rehearsal, three tries. Don't judge it; just capture it. Keep the video. That's your \"before,\" and you'll beat it on day 28.",
    drills: [
      {
        name: "Watch once, then reps",
        how: "Watch a tutorial of your skill exactly once, then practice for 15 minutes from body memory alone — no rewatching until tomorrow. Forcing the body to reconstruct the motion is what builds it.",
      },
      {
        name: "Spaced sets",
        how: "Three 5-minute practice bursts spread across the day — morning, midday, evening — instead of one long block. Short and spaced beats long and crammed for motor skills.",
      },
      {
        name: "Mix it up",
        how: "Alternate: 2 minutes of your new skill, 1 minute of a physical skill you already own, and repeat for 15 minutes. The switching feels worse but wires the skill deeper.",
      },
      {
        name: "Handicap round",
        how: "Practice 15 minutes with a handicap: eyes closed, off-hand, half speed, or balancing on one leg. Taking away a sense or an advantage forces your body to truly own the motion.",
      },
    ],
    integration: [
      "Do your skill in front of someone — family, a friend, a coworker. Performing under eyes is its own skill; today is about building it. One attempt counts.",
      "Teach the first step of your skill to someone else, hands-on. If your body can show it clearly enough for them to try it, you own it.",
      "Do your skill somewhere new — a different room, outdoors, a different surface. A skill that survives a change of location is really yours.",
    ],
    safety:
      "Warm up first, and stop at pain. Soreness is fine; pain is information.",
  },
  SEN: {
    summary:
      "Sharpen one sense lane — ear, palate, or eye — with blind tests you can score.",
    baselineSetup:
      "Pick one sense lane and get your materials ready: pitch (install a free ear-training app), taste (one category — coffee, chocolate, apples — and 3–4 varieties), or color (collect paint chips or photos with near-identical shades).",
    baselineRun:
      "Run 10 blind trials, cold, and count your hits: 10 interval questions in the ear-training app, or 5 paired blind tastings a helper labels for you, or 10 \"same or different?\" shade pairs. Write down the score — that's your baseline.",
    drills: [
      {
        name: "A/B pairs",
        how: "15 minutes of two-way comparisons in your lane: higher or lower, sweeter or more bitter, warmer or cooler shade. Score every answer. Wrong answers teach the most — replay them.",
      },
      {
        name: "Build the vocabulary",
        how: "Take 3 items in your lane and write exact words for the differences between them — not \"nicer,\" but \"brighter,\" \"rounder,\" \"more acidic.\" A named difference is a difference you'll catch again.",
      },
      {
        name: "Blind ID",
        how: "Have someone hide the labels (or use the app's quiz mode) and identify 5 items blind. Guessing is allowed — checking your guess is the training.",
      },
      {
        name: "Speed round",
        how: "Yesterday's trials again, but answer each within 3 seconds. Fast, gut-level discrimination is the skill in its finished form.",
      },
    ],
    integration: [
      "At a meal today, call out one specific thing — an ingredient, a flat note in the room's playlist, an off shade — out loud, and check if you're right.",
      "Quality-check something before it goes out: a document's layout, a dish before serving, a photo before posting. Find the one detail that's almost right, and fix it.",
      "Compare your read to an expert's: taste or listen to something reviewed (coffee bag notes, a wine label, a mastering breakdown) and see how much of their description you caught first.",
    ],
  },
  ADP: {
    summary:
      "Build measurable physical capacity — breath, recovery, or range — with safe, graded progress.",
    baselineSetup:
      "Choose your capacity lane: seated breath-hold, heart-rate recovery (how fast your pulse settles after 20 slow squats), or gentle range-of-motion (a sit-and-reach measure). If you have any heart, lung, or joint condition — or any doubt — clear it with a professional first. That's part of the protocol, not a detour.",
    baselineRun:
      "Measure cold, seated and rested, three times; record the best of three. Breath-hold rules: normal breath in (don't gulp air), hold, stop at the first strong urge to breathe. Never in water, never standing, never past discomfort.",
    drills: [
      {
        name: "Paced breathing",
        how: "15 minutes of slow, even breathing: in for 4 counts, out for 6. This trains the exact system your breath-hold and recovery run on. Seated, relaxed, nothing forced.",
      },
      {
        name: "Graded exposure",
        how: "Work at about 60–70% of your baseline — if you held 40 seconds, practice comfortable 25-second holds with full recovery between. Sub-maximal reps build capacity; maximal ones just test it.",
      },
      {
        name: "One notch more",
        how: "Add exactly one unit to yesterday — one more second, one more rep, one degree further. Never more than one notch. Write it in your check-in note so tomorrow knows where you left off.",
      },
      {
        name: "Recovery log",
        how: "Do 20 slow squats (or one flight of stairs briskly), then time how long your breathing takes to return to normal. Recovery speed is capacity you can watch improve week to week.",
      },
    ],
    integration: [
      "Choose the physical option once today — stairs over elevator, walking over riding — and notice how unremarkable it feels. That's the capacity working.",
      "Do one ordinary task under mild, safe discomfort — a cooler room, standing instead of sitting — and notice your steadiness. Adaptation is your domain; observe it running.",
      "Next stressful moment today, be the calm one on purpose: slow your exhale, keep your voice even. Note in your check-in whether the room followed you.",
    ],
    safety:
      "Never test limits alone, in water, or standing. Stop at discomfort — this domain rewards patience, and it punishes bravado.",
  },
  ANL: {
    summary:
      "Train pattern-finding you can score — timed problems, estimates checked against reality.",
    baselineSetup:
      "Pick your lane and prepare a fixed test set: 10 mental-math problems (no calculator), one timed logic-puzzle set (a puzzle app or book works), or 5 estimation questions you can verify (\"how much will this grocery run cost?\"). Have it ready to run tomorrow, untimed materials sealed.",
    baselineRun:
      "Run your set cold and timed. Record two numbers: how many right, and how long it took. Both have to be honest for day 28 to mean anything.",
    drills: [
      {
        name: "Take it apart",
        how: "Pick one messy real thing today — a bill, a news claim, a decision at work — and decompose it on paper into its parts: what's claimed, what's assumed, what would break it. Find one flaw or one simplification.",
      },
      {
        name: "Estimate, then check",
        how: "Make 3 estimates today and verify each: the grocery total before the register, minutes until you arrive, how many people are in the room. Write the guess before you check — no retroactive credit.",
      },
      {
        name: "Name the rule",
        how: "Five times today, say the underlying pattern out loud or in a note: \"this queue moves slower because…\", \"this argument assumes…\". Naming the structure is the rep.",
      },
      {
        name: "Speed set",
        how: "A fresh set of the same problem type as your baseline, racing yesterday's time. Accuracy first, then speed — a fast wrong answer counts as wrong.",
      },
    ],
    integration: [
      "Audit something real today — your subscriptions, a spreadsheet at work, a recurring bill — and find one actual error or one saving. Document it.",
      "Write three predictions for tomorrow with a confidence number on each (\"70% the meeting runs over\"). Tomorrow, score them. Calibration is analysis meeting reality.",
      "Explain one system you understand to someone in exactly three parts. If it doesn't fit in three, you haven't finished decomposing it.",
    ],
  },
  MEM: {
    summary:
      "Train recall you can count — a 20-item list now, the same test four weeks stronger later.",
    baselineSetup:
      "Prepare a 20-item test you can repeat later: 20 shuffled words, half a deck of cards, or 20 grocery items. Write the list, seal it (or have someone hold it), and set a 5-minute timer for tomorrow.",
    baselineRun:
      "Study your list for exactly 5 minutes, put it away, do something else for 10 minutes, then write down everything you remember — in order if you can. Score: items right, order right. Both numbers are your baseline.",
    drills: [
      {
        name: "Build the palace",
        how: "Take a route you know cold — your home, your commute — and place 10 items along it as vivid images (the milk is spilling down the staircase). Walk the route mentally tonight and collect them. This is the core technique; it gets easier fast.",
      },
      {
        name: "Names to faces",
        how: "Learn 5 new name-face pairs today (a show's cast, news anchors, colleagues you've been faking it with). Attach each name to an exaggerated feature. Recall all 5 at day's end.",
      },
      {
        name: "Spaced retrieval",
        how: "Recall yesterday's material three times today — morning, midday, night — without peeking. Only after the attempt may you check. The struggle to retrieve is the rep; rereading is not.",
      },
      {
        name: "Chunk the number",
        how: "Take a 12-digit number and memorize it in chunks of 3–4, giving each chunk a meaning (19-84 is a year, 007 is Bond). Recall it an hour later. Digits are the barbell of memory training.",
      },
    ],
    integration: [
      "Do the grocery run (or the errand list) with no written list — build it into your palace before you leave. Check the list only at the end, as your score.",
      "After one meeting or conversation today, write down what was said as exactly as you can — then verify one detail with someone who was there.",
      "Be the one who remembers: next time someone reaches for their phone to look it up, retrieve it from memory first. Note in your check-in whether you had it.",
    ],
  },
  GEN: {
    summary:
      "Train idea volume on a clock — a 5-minute count now, a bigger count by day 28.",
    baselineSetup:
      "Set up tomorrow's test tonight: pick one ordinary object (write it down, don't think about it further) and have a 5-minute timer and a blank page ready.",
    baselineRun:
      "Five minutes, cold: write every distinct use you can think of for your object, one per line. No judging, no stopping. Count the genuinely different ideas. That count is your baseline.",
    drills: [
      {
        name: "Quantity reps",
        how: "Twenty ideas on one prompt today (\"ways to make Mondays better\", \"things this box could become\") — without stopping to judge a single one. Volume is the muscle; quality shows up on its own by idea twelve.",
      },
      {
        name: "Forced connection",
        how: "Pick two unrelated nouns at random (point at a book page twice). In 10 minutes, combine them into one product, story, or fix. The stretch is the point — easy pairs teach nothing.",
      },
      {
        name: "Constraint round",
        how: "Solve one real prompt under an arbitrary rule: costs nothing, uses one hand, must fit in a tweet, must rhyme. Constraints don't shrink your options — they force new shelves open.",
      },
      {
        name: "Select and refine",
        how: "Go back through this week's ideas, pick the single best one, and push it one concrete step: a sketch, a paragraph, a prototype in tape. Generation needs one finishing rep per week to stay honest.",
      },
    ],
    integration: [
      "Bring three options to one real decision today — where a normal person brings one. Watch what having options does to the conversation.",
      "Remix something that exists: a recipe, a playlist, a workflow at work. Change two variables and actually try it today.",
      "Pitch one idea out loud to one person. Note in your check-in what landed and what didn't — audience contact is where generative work gets its edges.",
    ],
  },
  REL: {
    summary:
      "Train people-reading with verification — predict, then check, so hunches become skill.",
    baselineSetup:
      "Your instrument is predict-then-verify. Tonight, list 3 conversations you'll have tomorrow anyway — a coworker, a family member, a barista. That's your test bench; nothing artificial needed.",
    baselineRun:
      "In each of your 3 conversations, silently predict the person's state or want before it's spoken — then verify, either by watching how it plays out or by checking gently (\"you seem upbeat today — big morning?\"). Score your hits out of 3. Write it down.",
    drills: [
      {
        name: "Silent reads",
        how: "Before three people speak to you today, predict their mood in one word. Verify at least one prediction out loud. Prediction without verification is just projection — the checking is the training.",
      },
      {
        name: "Learn one baseline",
        how: "Pick one person you see often and note their normal: pace, volume, posture, humor. You can only read deviations from a baseline you actually know. Write two lines about it in your check-in.",
      },
      {
        name: "Say the read out loud",
        how: "Once today, name what you're picking up, tentatively: \"sounds like this has been frustrating — am I reading that right?\" Being correctable out loud is the fastest calibration there is.",
      },
      {
        name: "Match the register",
        how: "In one conversation, deliberately fit yourself to the other person: their pace, their energy, their vocabulary. Notice what it unlocks. That's not fakery — it's accuracy about people.",
      },
    ],
    integration: [
      "Find today's tensest (or flattest) interaction and move its temperature on purpose — slow it down, warm it up, name the thing under it. One degree counts.",
      "Convene: bring two or more people together today — a group text, a shared lunch — and watch what connects them. Connectors build the room others meet in.",
      "In one group setting, say the unsaid thing kindly: \"I think what X is getting at is…\". Note whether the room exhales.",
    ],
  },
  EXP: {
    summary:
      "Train transmission with a daily 60-second recording — clearer and stronger by day 28.",
    baselineSetup:
      "Pick a topic you genuinely love and could talk about forever. Tonight, prepare nothing — no notes, no outline. Tomorrow you speak cold. Have your phone's voice recorder ready.",
    baselineRun:
      "Record 60 seconds, one take, cold: explain your topic to an imaginary ten-year-old. Keep the recording — it's your \"before.\" Then rate it honestly, like the station: was it clear start to finish? Would a listener have stayed with you?",
    drills: [
      {
        name: "The daily sixty",
        how: "One new topic, 60 seconds, one take, out loud. No restarts — the discipline of the single take is the drill. Listen back once and note the one thing to fix tomorrow.",
      },
      {
        name: "One tactic",
        how: "Today's sixty seconds, plus exactly one deliberate tactic: a full two-second pause before your main point, or one vivid metaphor, or varying your volume once. One tactic, done on purpose, per day.",
      },
      {
        name: "Hit a feeling",
        how: "Before you record, pick the emotion you want the listener to feel — amused, moved, alarmed. Record, listen back, and judge only that: did the feeling land? Delivery is emotional targeting, not diction.",
      },
      {
        name: "Live rep",
        how: "Today's sixty seconds goes to a person, not the phone — tell someone about your topic for one minute and watch their face. The face is the feedback the recorder can't give you.",
      },
    ],
    integration: [
      "Speak up once today in a meeting or group with one prepared point — stated cleanly, with a beginning and an end. One good transmission beats five mumbles.",
      "Teach something for two minutes to someone who wants to know it. Teaching is expression with a scoreboard: either they got it or they didn't.",
      "Publish one small thing today — a post, a voice note to the group chat, a story. Transmission needs an audience the way kinetic needs gravity.",
    ],
  },
  PER: {
    summary:
      "Train noticing — room recall, change detection, and time sense, all scoreable.",
    baselineSetup:
      "Pick your lane: room recall (list a familiar room's contents from memory), route recall (draw the turns of a route you take weekly), or time sense (estimate 30 seconds without counting, three times). Choose the specific room, route, or setup tonight.",
    baselineRun:
      "Run it cold and score against reality: sit outside the room and list 20 things and where they sit, then walk in and count your hits. Or draw the route, then drive/walk it. Or run three 30-second estimates and note your average error. Write the score down.",
    drills: [
      {
        name: "Ten-second audit",
        how: "Enter any room, give yourself 10 seconds, then look away and name 5 things and their positions. Check. Three rooms today. This is the core noticing rep.",
      },
      {
        name: "Spot the change",
        how: "In one familiar place today, find what's different from yesterday — what moved, what's new, what's missing. If nothing seems different, look harder; something always is.",
      },
      {
        name: "The baseline book",
        how: "Pick one place you frequent and write its normal: who's usually there, the usual sounds, the usual rhythm. Perception runs on baselines — the abnormal only pops against a known normal.",
      },
      {
        name: "Unaided run",
        how: "Make one trip today without GPS — navigate by memory and orientation. Wrong turns are data, not failure; note where your internal map was thin.",
      },
    ],
    integration: [
      "In one building today, casually note the exits and who's where. Not vigilance for its own sake — just letting the watchtower run at its natural setting.",
      "In one meeting or gathering, write down afterward what was actually going on beneath the words — who aligned with whom, what wasn't said. Verify one guess later.",
      "Make one early call: flag something developing — at work, at home, in the news — before others mention it. Write it in your check-in and score yourself when it resolves.",
    ],
  },
};

export function protocolSummary(id: DomainId): string {
  return DETAIL[id].summary;
}

export function taskForDay(id: DomainId, day: number): DayTask {
  const d = DETAIL[id];
  const name = DOMAIN_BY_ID[id].name;
  const safetyOn = (task: DayTask): DayTask =>
    d.safety ? { ...task, safety: d.safety } : task;

  if (day <= 1)
    return {
      stageName: "Awareness",
      title: "Name it",
      body: `Write one sentence, by hand or in today's note, claiming the gift: "I have a ${name} genius." Then list three moments from your life when it showed up — times ${DOMAIN_BY_ID[id].sign.toLowerCase()}. Naming it is day one's entire job.`,
    };
  if (day === 2)
    return {
      stageName: "Awareness",
      title: "Catch it in the wild",
      body: `Go about a normal day, but watch for your ${name} gift firing on its own — the moment it does something without being asked. When you catch it, write down when, where, and what it did. One clean sighting is enough.`,
    };
  if (day === 3)
    return {
      stageName: "Awareness",
      title: "Say it out loud",
      body: `Tell one person about your result — "apparently my strong suit is ${name}" is plenty. Notice their reaction; people usually confirm a real gift instantly ("oh, that's definitely you"). Write down what they said.`,
    };
  if (day === 4)
    return safetyOn({
      stageName: "Assessment",
      title: "Set up your baseline test",
      body: d.baselineSetup,
    });
  if (day === 5)
    return safetyOn({
      stageName: "Assessment",
      title: "Run the baseline — cold",
      body: d.baselineRun,
    });
  if (day === 6)
    return {
      stageName: "Assessment",
      title: "Score it and write it down",
      body: "Turn yesterday's run into numbers and keep them somewhere you won't lose: the count, the time, the score — plus one honest sentence about how it felt. No rounding up. Day 28 repeats this exact test, and the gap between the two is the whole point of the month.",
    };
  if (day === 7)
    return {
      stageName: "Assessment",
      title: "Set the 30-day target",
      body: "Look at your baseline number and pick the number you intend to hit on day 28 — ambitious enough to require the next three weeks, realistic enough to be yours. Write it at the top of your notes. Rest today; practice starts tomorrow.",
    };
  if (day <= 21) {
    const drill = d.drills[(day - 8) % d.drills.length];
    return safetyOn({
      stageName: "Practice",
      title: `Drill · ${drill.name}`,
      body: `${drill.how} Aim for 15–20 focused minutes, then log one line about how it went in today's check-in.`,
    });
  }
  if (day <= 27) {
    const task = d.integration[(day - 22) % d.integration.length];
    return safetyOn({
      stageName: "Integration",
      title: "Take it live",
      body: `${task} Practice built the skill in private — this week is about running it where it counts. Log what happened.`,
    });
  }
  if (day === 28)
    return safetyOn({
      stageName: "Mastery",
      title: "Retest — same test, same rules",
      body: "Repeat your day-5 baseline exactly: same test, same conditions, cold. Film or record it the same way. Score it the same way. Don't compare yet — just run it clean.",
    });
  if (day === 29)
    return {
      stageName: "Mastery",
      title: "Compare the numbers",
      body: "Put day 6 and day 28 side by side: the scores, the times, the recordings. Write three lines — what moved, what didn't, and what surprised you. Improvement you can point at is what separates a named genius from a nice idea.",
    };
  return {
    stageName: "Mastery",
    title: "Claim it and choose what's next",
    body: "Gather the evidence in one place — the before and after recordings, the numbers, your best notes. That's your proof, in the book's terms: your currency. Then choose the next move: another 30 days going deeper in this domain, a run at your second strand to build the braid, or a retake of the Index to see the change in your score.",
  };
}
