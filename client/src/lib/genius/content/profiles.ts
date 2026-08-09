/* Genius profile library — per-domain fragments for the psychometric-style
   profile read (cognitive / leadership / learning / communication / team role /
   innovation / stress). Each lens: t = archetype label (led by the PRIMARY
   domain), p = primary paragraph, s = secondary clause composed into
   "Your {name} strand {s}." Interpretive content in the book's voice — a
   reading, not a measurement. Ported verbatim. */

import type { DomainId, Family } from "../data/domains";

export interface ProfileLens {
  t: string;
  p: string;
  s?: string;
}

export type LensKey =
  | "cog"
  | "lead"
  | "learn"
  | "comm"
  | "team"
  | "innov"
  | "stress";

export type DomainProfile = Record<LensKey, ProfileLens>;

export const PROFILE_LIB: Record<DomainId, DomainProfile> = {
  KIN: {
    cog: { t: "The Embodied Thinker", p: "You think by doing. Understanding arrives through the hands and the body before it arrives in words — the concept clicks only after the motion does.", s: "keeps your thinking tied to physical reality: if it can't be done yet, it isn't understood yet" },
    lead: { t: "Leads from the front", p: "You lead by demonstration. People follow you because they've watched you do the thing — not describe it — and that credibility can't be faked.", s: "makes your leadership credible in the doing, not the telling" },
    learn: { t: "Learns by reps", p: "You learn through attempts: watch once, try immediately, adjust by feel. Lectures without practice evaporate on you — reps are the retention.", s: "means new material sticks fastest when your body is involved" },
    comm: { t: "Shows, then tells", p: "Your default move in any explanation is “here — watch.” You communicate through demonstration, and it works on people that words don't reach.", s: "backs your words with visible proof" },
    team: { t: "The Hands", p: "On a team you're the one who makes it real. While the meeting is still debating, you've already built the first rough version.", s: "adds the builder's reflex: rough versions appear while the room is still talking" },
    innov: { t: "Innovates in the making", p: "Your breakthroughs happen mid-build. The better way reveals itself through your hands, not on the whiteboard — you have to be touching the work to see it.", s: "finds the better way mid-build" },
    stress: { t: "Grounds through the body", p: "Under pressure, you go physical — movement burns off what rumination feeds. Your warning sign is stillness: too many days without using your body, and everything else starts to degrade." },
  },
  SEN: {
    cog: { t: "The Fine Discriminator", p: "You think in distinctions — differences of tone, texture, and quality that most people literally cannot detect. Where others see one thing, you see the grades within it.", s: "adds resolution: you catch the small differences others round away" },
    lead: { t: "Leads by standards", p: "You lead through quality. Your eye for “almost right versus right” becomes the bar the whole team calibrates to — often without you saying a word.", s: "quietly raises the standard of everything the group ships" },
    learn: { t: "Learns by immersion", p: "You learn through exposure. Give you enough good examples and your judgment calibrates itself — no rulebook required, because the rulebook builds itself in you.", s: "tunes your judgment through direct exposure to quality" },
    comm: { t: "The Precision Speaker", p: "You communicate in exact terms — the specific word, the specific flaw, the specific fix. Vagueness genuinely bothers you, and your feedback shows it.", s: "makes your feedback unusually precise" },
    team: { t: "The Quality Gate", p: "On a team you're the last checkpoint. Nothing ships past you at “good enough” when it could be right — and the team's reputation quietly rests on that.", s: "adds the quality gate: what would have shipped past gets caught" },
    innov: { t: "Innovates by refinement", p: "Your breakthroughs are refinements — the adjustment nobody else could even perceive that changes everything about how the result lands.", s: "supplies the imperceptible adjustment that changes the result" },
    stress: { t: "Overloads through the senses", p: "Under pressure, your inputs saturate — noise, clutter, and low-quality environments drain you faster than the work itself does. Your reset is sensory: quiet, order, one good thing done exactly right." },
  },
  ADP: {
    cog: { t: "The Recalibrator", p: "You think in adjustments. Every new condition is data, and your model of the situation updates without drama — you're rarely attached to the version of the plan that just died.", s: "keeps your thinking flexible when conditions change" },
    lead: { t: "Leads through weather", p: "You lead best when conditions turn. Calm in the storm reads as authority — and yours isn't performed, it's physiological.", s: "keeps you steady when the plan breaks" },
    learn: { t: "Learns in the deep end", p: "You learn fastest thrown in. Unfamiliar conditions organize your attention like nothing else — comfort is where your learning goes to stall.", s: "means discomfort is your accelerant, not your enemy" },
    comm: { t: "Reads the moment", p: "You communicate to conditions. The message flexes to the room, the mood, and the moment without ever losing its point.", s: "lets you shift tone mid-conversation without losing the thread" },
    team: { t: "The Shock Absorber", p: "On a team you're the stabilizer. When the plan collapses, you're the one already functioning in the new reality while everyone else is still grieving the old one.", s: "adds ballast: functioning continues when the plan doesn't" },
    innov: { t: "Innovates under constraint", p: "Your breakthroughs come from scarcity — fewer resources, harder limits, better ideas. Abundance actually dulls you.", s: "turns constraints into raw material" },
    stress: { t: "Steady in the storm, brittle in the stall", p: "Acute pressure is your element — it's chronic sameness that erodes you. Your warning sign is boredom that masquerades as burnout; the fix is a changed condition, not a rest." },
  },
  ANL: {
    cog: { t: "The Systems Mind", p: "You think in structures — parts, causes, and consequences snap into diagrams almost on their own. A mess is just a system whose map hasn't been drawn yet.", s: "adds a load-bearing frame: instinct gets checked against logic" },
    lead: { t: "Leads by architecture", p: "You lead through clarity — decomposing the mess into parts people can actually own. Your teams know what they're doing and why, which is rarer than it should be.", s: "gives your direction structure people can execute" },
    learn: { t: "Learns from first principles", p: "You learn by taking it apart. You don't trust a method until you know why it works — and once you can derive it, you never really lose it.", s: "means you retain what you can derive, not just what you memorized" },
    comm: { t: "The Clarifier", p: "You communicate by structuring — turning a tangled conversation into three clean points people can act on. Rooms leave your meetings knowing what was decided.", s: "gives your arguments a skeleton others can follow" },
    team: { t: "The Architect", p: "On a team you're the structure. You turn ambition into parts, sequence, and a plan that survives contact with reality.", s: "adds the structure the ambition was missing" },
    innov: { t: "Innovates by re-architecture", p: "Your breakthroughs are structural. You don't decorate the existing system — you redesign it, and the gains come from the bones.", s: "redesigns the system instead of decorating it" },
    stress: { t: "Copes by structuring", p: "Under pressure, you systematize — breaking the threat into parts you can order. The trap is analysis as avoidance: your warning sign is a plan on its fourth revision that still hasn't been started." },
  },
  MEM: {
    cog: { t: "The Archivist", p: "You think in precedent. What worked, what failed, and exactly what happened last time are always at hand — your past is an instrument, not a fog.", s: "gives your thinking receipts: the past stays available as evidence" },
    lead: { t: "Leads by memory", p: "You lead by knowing the history — what was tried, why it failed, and who was in the room. Teams under you stop repeating their own mistakes.", s: "grounds your calls in precedent instead of fashion" },
    learn: { t: "Learns by accumulation", p: "You learn by building an archive — spaced returns, exact recall, and a memory that compounds. What you learn once stays learnable forever.", s: "means what the team learns through you doesn't get lost" },
    comm: { t: "The Precedent-Citer", p: "You communicate with receipts — dates, quotes, and exactly what was agreed. People eventually stop arguing with you about facts.", s: "means your claims arrive pre-verified" },
    team: { t: "The Continuity", p: "On a team you're the institutional memory — the reason the same mistake doesn't get made twice and the origin story doesn't get rewritten.", s: "adds continuity: what the team forgets, you keep" },
    innov: { t: "Innovates by resurrection", p: "Your breakthroughs come from the archive — the forgotten approach from years ago, redeployed where nobody expects it.", s: "redeploys what everyone else forgot" },
    stress: { t: "Replays under pressure", p: "Under stress, your memory turns on you — replaying the mistake in high fidelity, on a loop. The exit is externalizing: write it down once, completely, and the loop loses its grip." },
  },
  GEN: {
    cog: { t: "The Combinator", p: "You think in possibilities — ideas breed with each other faster than you can write them down. Your problem is never the blank page; it's the fiftieth page.", s: "keeps options multiplying when others see only one path" },
    lead: { t: "Leads by possibility", p: "You lead by showing people a version of the future they hadn't considered — then making it feel reachable. Momentum follows the vision.", s: "keeps the vision fresh when momentum dips" },
    learn: { t: "Learns by producing", p: "You learn by making something with it. A new idea isn't learned until you've used it to build — study without output slides straight through you.", s: "turns everything you study into raw material" },
    comm: { t: "The Reframer", p: "You communicate through angles no one saw coming — the metaphor that makes the whole stuck conversation suddenly click.", s: "supplies the unexpected comparison that unlocks the room" },
    team: { t: "The Spark", p: "On a team you're the option-generator. When everyone is deadlocked between two choices, you arrive with a fifth nobody had considered.", s: "adds options exactly when the room runs dry" },
    innov: { t: "Innovates by collision", p: "Your breakthroughs come from collisions — two unrelated ideas fused into something neither field saw coming. Feed the engine widely; it runs on strange inputs.", s: "fuses ideas from fields that never meet" },
    stress: { t: "Floods with options", p: "Under pressure, your idea engine floods — ten escape routes and no exit taken. Your relief is ruthless narrowing: one option, chosen imperfectly, beats ten held open." },
  },
  REL: {
    cog: { t: "The Social Cartographer", p: "You think in people — motives, alliances, and unspoken tensions form a live map you navigate by. The org chart is fiction to you; the real one is in your head.", s: "adds a human layer: every plan gets checked against how people will actually react" },
    lead: { t: "Leads the room", p: "You lead through people — reading who needs pushing, who needs protecting, and saying it in the register each one can hear. You rarely lose a room, because you never stop reading it.", s: "means you rarely lose the room, because you're reading it constantly" },
    learn: { t: "Learns through people", p: "You learn best in dialogue — apprenticeship, argument, and watching a master up close. The right teacher accelerates you more than the right book.", s: "means the right mentor moves you faster than the right manual" },
    comm: { t: "The Translator of People", p: "You communicate person-by-person — the same truth, tuned to what each listener can actually hear. It isn't manipulation; it's accuracy about people.", s: "tunes your delivery to the listener in front of you" },
    team: { t: "The Connective Tissue", p: "On a team you're the reason it holds. Conflicts get caught early because you felt them coming two meetings ago.", s: "adds glue: the humans stay aligned while the work gets loud" },
    innov: { t: "Innovates socially", p: "Your breakthroughs are human — new ways for people to work, connect, and decide. You prototype them live, in real rooms, on real people.", s: "redesigns how the people work, not just the work" },
    stress: { t: "Absorbs the room", p: "Under pressure, you carry other people's states home — the tension in the room becomes tension in you. Your warning sign is exhaustion after conflict you weren't even part of; your reset is genuine solitude." },
  },
  EXP: {
    cog: { t: "The Out-Loud Processor", p: "You think by expressing. The idea isn't finished until it's been said, performed, or put in front of someone — articulation is your compiler.", s: "sharpens your thinking by forcing it into words others can follow" },
    lead: { t: "Leads from the stage", p: "You lead through voice — framing the mission so people feel it, not just understand it. Your teams can repeat the why in your words.", s: "makes the message land: people repeat your framing back to you" },
    learn: { t: "Learns by teaching", p: "You learn by explaining. The gaps in your understanding only show up when you try to perform it for someone — so you volunteer to present, and it works.", s: "means explaining it to someone else is how you make it yours" },
    comm: { t: "The Carrier", p: "You communicate to move people — timing, emphasis, and presence that make the message land in the chest, not just the ear.", s: "gives your message carry: people feel it, then remember it" },
    team: { t: "The Voice", p: "On a team you're the amplifier — the one who makes the work legible and compelling to the people who weren't in the room when it happened.", s: "adds reach: the work gets heard beyond the room" },
    innov: { t: "Innovates in the delivery", p: "Your breakthroughs are in the form — new formats, new framings, new ways to make a known truth impossible to ignore.", s: "reinvents the delivery until the idea can't be ignored" },
    stress: { t: "Performs through it", p: "Under pressure, you keep performing — the show continues while the person behind it runs empty. Your warning sign is an audience convinced you're fine; your reset is one room where you don't have to be on." },
  },
  PER: {
    cog: { t: "The Wide-Angle Lens", p: "You think in context — the room, the terrain, the thing just out of frame that everyone else missed. Your attention has peripheral vision.", s: "adds peripheral vision: you catch what's moving at the edges" },
    lead: { t: "Leads from the watchtower", p: "You lead by seeing it coming. Threats and openings register with you before they're visible to anyone else — your teams get early warning as a standing advantage.", s: "gives the people around you early warning others don't get" },
    learn: { t: "Learns by fieldwork", p: "You learn from live environments — real rooms, real terrain, real stakes. Observation in the wild teaches you what simulations never will.", s: "means observing the real thing beats reading about it" },
    comm: { t: "The Subtext Reader", p: "You communicate on two channels — what's said, and what's actually going on underneath. You answer both, which unnerves people the first time.", s: "means you respond to what was meant, not just what was said" },
    team: { t: "The Lookout", p: "On a team you're the early-warning system. Risks and openings reach you first — the team's job is to actually listen when you flag them.", s: "adds the lookout's eye: it gets seen coming" },
    innov: { t: "Innovates from the gap", p: "Your breakthroughs start with a gap — the need everyone walked past that you actually registered. Seeing the hole is the invention; the rest is execution.", s: "spots the need everyone else walked past" },
    stress: { t: "Scans until it burns", p: "Under pressure, your vigilance locks on — scanning for threats long after the threat has passed. Your reset is an environment safe enough that the watchtower can genuinely stand down." },
  },
};

/* Blind spots: the realm NOT in the braid is the unwatched flank. */
export const BLIND_FAMILY: Record<Family, string> = {
  soma: "Both strands of your braid run above the body's channel — the physical is your unwatched flank. Expect to override the body's early signals (fatigue, tension, the quiet “no”) until they escalate, and to under-rate skills that can't be argued, only performed.",
  mind: "Neither strand of your braid runs on the analytical channel — structure is your unwatched flank. Expect to trust feel and read over documentation and system, which works right up until the problem gets too big to hold in intuition.",
  field: "Both strands of your braid point inward at the work — the field around it is your unwatched flank. Expect to under-read rooms, under-announce wins, and be surprised by social weather everyone else watched building.",
};

/* Blind spots: what the profile's lowest domain costs, practically. */
export const BLIND_LOW: Record<DomainId, string> = {
  KIN: "Physical skill-building will feel slower for you than most things do — plan for more reps, not more theory.",
  SEN: "Fine quality-distinctions may blur on you — borrow a trusted eye (or ear) before you ship.",
  ADP: "Changed conditions cost you more than most — build routines that survive disruption instead of assuming you'll adjust.",
  ANL: "Structure won't build itself for you — steal templates and checklists rather than deriving from scratch.",
  MEM: "Precise recall isn't your native storage — write it down the moment it happens, every time.",
  GEN: "Options won't multiply on their own — schedule divergence deliberately before you converge.",
  REL: "Reading people takes real effort here — ask directly instead of assuming you've read the room.",
  EXP: "The work won't speak for itself, and neither will you by default — script the telling like it's part of the job.",
  PER: "The edges of the situation escape you — build explicit scan habits: who's here, what changed, what's missing.",
};

/* The Shelf: real published books per domain [title, author, one-line why]. */
export const SHELF_BOOKS: Record<DomainId, [string, string, string][]> = {
  KIN: [["The Talent Code", "Daniel Coyle", "how deep practice actually builds physical skill"], ["The Inner Game of Tennis", "W. Timothy Gallwey", "the mental side of embodied performance"], ["Mastery", "Robert Greene", "the long arc of hands-on excellence"]],
  SEN: [["The Craftsman", "Richard Sennett", "the dignity and depth of trained perception"], ["An Immense World", "Ed Yong", "what senses can actually detect"], ["The Art of Noticing", "Rob Walker", "exercises for a sharper eye"]],
  ADP: [["Antifragile", "Nassim Nicholas Taleb", "systems and people that gain from disorder"], ["Range", "David Epstein", "why generalists thrive in changing conditions"], ["Endure", "Alex Hutchinson", "the science of physical and mental limits"]],
  ANL: [["Thinking, Fast and Slow", "Daniel Kahneman", "the machinery underneath your judgment"], ["The Signal and the Noise", "Nate Silver", "prediction, and where it breaks"], ["Super Thinking", "Gabriel Weinberg & Lauren McCann", "a field guide of mental models"]],
  MEM: [["Moonwalking with Einstein", "Joshua Foer", "what trained memory can really do"], ["Make It Stick", "Peter C. Brown, Henry Roediger & Mark McDaniel", "the science of durable learning"], ["The Memory Illusion", "Julia Shaw", "where recall deceives — and how to trust yours anyway"]],
  GEN: [["Where Good Ideas Come From", "Steven Johnson", "the environments that breed ideas"], ["Steal Like an Artist", "Austin Kleon", "permission and method for combination"], ["Big Magic", "Elizabeth Gilbert", "sustaining a generative life without burning it down"]],
  REL: [["Never Split the Difference", "Chris Voss", "reading people when the stakes are real"], ["The Culture Code", "Daniel Coyle", "what makes groups actually work"], ["Nonviolent Communication", "Marshall Rosenberg", "saying hard things so they land"]],
  EXP: [["The War of Art", "Steven Pressfield", "beating the resistance to putting work out"], ["On Writing", "Stephen King", "craft, voice, and honesty on the page"], ["Talk Like TED", "Carmine Gallo", "the mechanics of talks that carry"]],
  PER: [["The Gift of Fear", "Gavin de Becker", "trusting the signal you already caught"], ["Visual Intelligence", "Amy Herman", "training the noticing eye"], ["Blink", "Malcolm Gladwell", "rapid cognition — its powers and its traps"]],
};
