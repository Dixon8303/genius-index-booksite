/* Content library (condensed from the book; per-domain / per-braid).
   Ported verbatim — this is finished editorial copy, not placeholder text. */

import type { Braid } from "../data/braids";
import type { DomainId } from "../data/domains";

export const CAREERS: Record<DomainId, string> = {
  KIN: "Performance trades (dance, music, acting, athletics) · precision trades (surgery, watchmaking, luthiery) · skilled trades (welding, carpentry, culinary knife work) · teaching of movement (coaching, PT, choreography)",
  SEN: "Ear trades (audio engineering, sound design) · palate trades (culinary, sommelier, perfumery) · eye trades (photography, colour grading, design) · QA / inspection trades",
  ADP: "Endurance & strength trades · flexibility trades (dance, gymnastics, yoga) · breath trades (vocal, wind instruments, free-diving) · physical-labour professions — medical self-knowledge is the prerequisite throughout",
  ANL: "Building trades of the mind (software, data science, quant finance) · diagnostic trades (medicine, debugging, forensic accounting) · strategy trades (consulting, investing) · structural trades (law, research)",
  MEM: "Knowledge-dense professions (medicine, law, academia) · language trades (interpretation, translation) · performance-of-memory (acting, competitive memory) · relationship trades (sales, hospitality, diplomacy)",
  GEN: "Making trades (writing, music, film, design) · invention trades (product, R&D, entrepreneurship) · idea trades (advertising, branding, content) · problem trades (innovation, consulting)",
  REL: "Helping professions (therapy, coaching, teaching) · deal professions (sales, negotiation, biz dev) · leading professions (management, executive leadership) · service professions (hospitality, healthcare)",
  EXP: "Platform trades (speaking, podcasting, broadcasting) · teaching trades · performance trades (acting, singing) · persuasion trades (sales, law, ministry, marketing) · leadership trades",
  PER: "Watching trades (security, investigation) · inspection trades (QC, building & safety, aviation) · frame trades (cinematography, continuity, editing) · field trades (guiding, tracking, SAR) · experience trades (UX research, venue design)",
};

/* [solo practice, date-night version, out-in-the-world version] */
export const HOBBIES: Record<DomainId, string[]> = {
  KIN: ["A new sport from scratch, martial arts, dance", "A partner-dance lesson, axe-throwing, a hands-on cooking class", "A maker faire, a movement workshop"],
  SEN: ["Home barista training, tasting practice, ear-training apps", "A blind tasting menu, a paint-your-own-pottery night", "A tasting festival, a sound-design meetup"],
  ADP: ["Yoga & mobility training, breathwork (with a professional screen first)", "A hike matched to real capacity, partner yoga", "A guided (not solo) endurance event"],
  ANL: ["Chess & strategy games, cryptic puzzles", "An escape room, a trivia night", "A hackathon, a strategy-game tournament"],
  MEM: ["Memory-palace practice, language learning, genealogy", "A trivia date, revisiting a shared place and comparing recall", "A history walking tour, a storytelling night"],
  GEN: ["Sketchbook practice, songwriting, a maker project", "An art-supply date, an improv class together", "A hackathon, an open-mic"],
  REL: ["Hosting small gatherings, deep-listening practice", "A phones-down walk, comparing reads after a show", "A communal dinner series"],
  EXP: ["Public-speaking practice, a podcast habit, karaoke", "Karaoke, teaching your date something you love", "An open-mic, a theatre workshop"],
  PER: ["Photography walks, geocaching, birdwatching", "A photo-walk date, a scavenger hunt in a new neighbourhood", "A nature & wildlife tour, an urban-sketching meetup"],
};

/* [the friction this gift creates, the challenge that feeds it] */
export const CHALLENGES: Record<DomainId, string[]> = {
  KIN: ["Impatience with purely verbal instruction; the gift reads as “not real intelligence” to others", "A new physical skill, no manual — figure it out by feel"],
  SEN: ["Comes across as overly particular; genuinely bothered by low-quality environments others don't notice", "Any task where getting the fine detail exactly right is the whole point"],
  ADP: ["Tolerance can mask real cost — risk of ignoring true limits", "An honest physical ceiling to find, safely, with guidance"],
  ANL: ["“Always finds the problem” fatigues people who wanted enthusiasm, not an audit", "The genuinely broken system nobody else could untangle"],
  MEM: ["The group leans on you as its memory and never builds their own", "Mastering a body of material most people wouldn't attempt"],
  GEN: ["Idea volume looks like flakiness without visible follow-through", "A genuinely open brief with no existing answer"],
  REL: ["Absorbing everyone's state is exhausting; risk of becoming free therapy", "Walking into a tense room and being the one who can read it"],
  EXP: ["Can look like performing even when sincere; drained by unresponsive rooms", "Any audience, any size, with something worth saying"],
  PER: ["Noticing everything is quietly tiring (the book's own hypervigilance caution)", "The one detail everyone else missed, waiting to be found"],
};

/* 30-day protocol, four phase summaries per domain:
   [weeks 1 baseline, week 2, week 3, week 4]. */
export const PROTOCOL_DOMAIN: Record<DomainId, string[]> = {
  KIN: ["Baseline: film the skill cold, score it", "Spacing + interleaving practice", "Remove a sense / add a variable", "Retention test + filmed delta"],
  SEN: ["Baseline + build a reference vocabulary", "A/B discrimination drills", "Blind identification", "Speed trial + retest"],
  ADP: ["Baseline + professional screen", "Graded load, 60–70% of ceiling", "Progressive overload, log recovery", "Consolidate + retest"],
  ANL: ["Baseline + name the pattern in words", "Decomposition drills, find the flaw", "Estimation & forecasting (Fermi)", "Speed trial + retest"],
  MEM: ["Baseline + build a memory palace", "Encoding systems (numbers / names / text)", "Spaced retrieval practice", "Volume push + retest"],
  GEN: ["Baseline + quantity reps, no judging", "Cross-domain input, force a connection", "Constraint & blend", "Select / refine + retest"],
  REL: ["Baseline + silent reads (predict, check)", "Learn people's real baselines", "Active verification, check it out loud", "Response practice + retest"],
  EXP: ["Baseline + 60-second transmissions", "One charismatic tactic per day", "Emotional transmission, check it landed", "Live reps + retest"],
  PER: ["Baseline + the room audit", "Change detection (the delta drill)", "Field vigilance, the baseline book", "The unaided day + retest"],
};

export const EVIDENCE: Record<DomainId, string> = {
  KIN: "Folklore says fast physical learners are simply “born that way” and that muscle memory is permanent once earned. The record is messier — cellular retention of trained muscle (myonuclei) is a contested, unsettled hypothesis in humans. What's real: rate of skill acquisition varies and is measurable — the permanence story is the part still unproven.",
  SEN: "Folklore says perfect pitch and fine sensory acuity are fixed gifts you're born with. The record shows absolute pitch is strongly tied to a critical early window plus tonal-language exposure — a genetic-only origin has been ruled out. What's real: acuity is substantially built by early demand, not issued at birth.",
  ADP: "Folklore treats extreme endurance, flexibility, or low sleep need as superhuman willpower. The record shows these are often rare population- or mutation-level adaptations (documented spleen adaptation in free-diving populations; an inherited gene variant behind true natural short sleep) — not something to train your way into. What's real: the capacity is genuine, but overriding your own limits on purpose can be dangerous. See a professional before you test this one.",
  ANL: "Folklore says “math people” are born, not made. The record shows expert pattern-recognition (a chess master's board-reading) is built through structured practice and exposure, not raw innate ability — though mindset-effect sizes are genuinely debated. What's real: this domain is trainable further than the folklore admits.",
  MEM: "Folklore promises true photographic memory. The record: no well-documented adult case has ever been replicated, and the one famous claim is compromised by conflict of interest in its own research. What's real: exceptional memory is genuine but works through dense association, not mental photography — and it is highly trainable by technique.",
  GEN: "Folklore says creative genius waits for rare, superior flashes of inspiration. The record (the equal-odds rule) says quality tracks quantity — the most creative people are also the most prolific, misfires included. What's real: output volume is the lever, not waiting for the “right” idea.",
  REL: "Folklore says some people can just read minds. The record: even trained professionals barely beat chance at lie detection, though rapid “thin-slice” judgments are surprisingly accurate on other things. What's real: this is a genuine, measurable skill on subtle cues — keep the confidence calibrated; it isn't mind-reading.",
  EXP: "Folklore says charisma is innate — you have it or you don't. The record identifies specific, learnable verbal and nonverbal tactics that reliably increase perceived charisma. What's real: this is substantially trainable technique, not fixed birthright.",
  PER: "Folklore claims a paranormal “sixth sense” for danger or being watched. Controlled testing finds no reliable effect above chance. What's real: what reads as a sixth sense is usually fast, often subconscious integration of real cues (peripheral motion, sound, pattern deviation) — trainable through deliberate attention, not paranormal.",
};

/* Currency of proof, keyed by braid name (all 36). */
export const CURRENCY: Record<string, string> = {
  "The Craftsman": "a finished, technically precise piece — a dish, a recording, a built object",
  "The Performer": "a recorded or live performance that visibly moves an audience",
  "The Connoisseur": "a judgment or rating that experts independently confirm as correct",
  "The Translator": "writing or a talk that makes a hard idea click for a lay audience",
  "The Diagnostician": "a documented catch — a bug, error, or anomaly found and explained",
  "The Connector": "a network of real relationships you can actually call on",
  "The Storyteller": "a finished, shipped narrative work",
  "The Leader": "a team or room that visibly moved because of you, with a result to show",
  "The Instrument": "a recorded vocal or physical performance demonstrating range and control",
  "The Documentarian": "a published observational piece that makes others see what you saw",
  "The Natural": "a skill picked up from scratch, demonstrated on camera in a short window",
  "The Tactician": "a match / game record showing anticipation, not just execution",
  "The Virtuoso": "a performed repertoire executed from memory",
  "The Maker": "a physical object or prototype invented and built by hand",
  "The Healer": "client outcomes or testimonials from hands-on practice",
  "The Athlete": "game footage showing reads and reactions under real conditions",
  "The Composer": "an original sensory work released — music, a dish, a fragrance",
  "The Empath": "documented cases of correctly reading and meeting an unspoken need",
  "The Stylist": "a body of stylistically distinctive published work",
  "The Tracker": "a documented find — the clue or subject others missed",
  "The Optimizer": "a measurable before / after improvement in a trained physical outcome",
  "The Caregiver": "a sustained caregiving or crisis-work record with real outcomes",
  "The Explorer": "a completed expedition or route log showing endurance and navigation",
  "The Scholar": "a demonstrated body of expertise — publication, credential, teaching",
  "The Inventor": "a shipped invention or prototype that solves a real problem",
  "The Negotiator": "closed deals or resolved disputes with documented terms",
  "The Synthesizer": "an original work that visibly recombines disparate source material",
  "The Bard": "a delivered oral performance from memory, well received",
  "The Witness": "an accurate, detailed account of an event that held up under scrutiny",
  "The Entertainer": "a live, improvised, or hosted performance that read the room and landed",
  "The Visionary": "a documented early call on a trend, later validated by events",
  "The Diplomat": "a resolved multi-party situation with all sides satisfied, on record",
  "The Adept": "a demonstrated controlled response under real sensory / physical stress",
  "The Aesthete": "a portfolio of precisely recalled or reproduced sensory signatures",
  "The Veteran": "a multi-year track record with detailed recall of specifics across it",
  "The Daredevil": "a novel physical feat performed and documented, safely",
};

/* Team-fit partner, for the ten canonical braids; others fall back to
   Expressive/Analytic. */
export const TEAMFIT: Record<string, string> = {
  "The Craftsman": "An Expressive collaborator, to carry the work to an audience",
  "The Performer": "An Analytic collaborator, to build the structure around the performance",
  "The Connoisseur": "A Relational collaborator, to turn the judgment into relationships",
  "The Translator": "A Generative collaborator, to keep fresh material coming",
  "The Diagnostician": "An Expressive collaborator, to report findings persuasively",
  "The Connector": "A Generative or Analytic collaborator, to give the network something to rally around",
  "The Storyteller": "An Analytic or Perceptive collaborator, to keep the story grounded and well-timed",
  "The Leader": "An Analytic collaborator, to pressure-test the plan behind the vision",
  "The Instrument": "A Generative collaborator, to keep writing new material for the voice",
  "The Documentarian": "An Analytic collaborator, to turn observations into a structured argument",
};

export function teamFitFor(primary: Braid | null): string {
  if (!primary)
    return "An Expressive or Analytic collaborator, to communicate and structure the work.";
  if (TEAMFIT[primary.name]) return TEAMFIT[primary.name];
  const ids = primary.pair as string[];
  if (!ids.includes("EXP"))
    return "An Expressive collaborator, to communicate the work.";
  if (!ids.includes("ANL"))
    return "An Analytic collaborator, to structure and scale the work.";
  return "A Relational collaborator, to widen the work's reach.";
}
