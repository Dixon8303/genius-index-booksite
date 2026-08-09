/* The 74-item inventory, ported verbatim from the original assessment.
   Stream A (behavioral, 45 items, 5 per domain) — FREQ scale, one reverse-keyed
   item per domain. The original marked reversal by array position (index 3);
   here each item carries an explicit `reverse` flag so the bank can change
   shape without silently breaking scoring.
   Stream C (trait disposition, 27 items, 3 per domain) — AGREE scale.
   SDR (2 honesty-check items) — AGREE scale, advisory only. */

import type { DomainId } from "./domains";

export interface InventoryItem {
  text: string;
  reverse: boolean;
}

const a = (text: string, reverse = false): InventoryItem => ({ text, reverse });

export const A_ITEMS: Record<DomainId, InventoryItem[]> = {
  KIN: [
    a(
      "After seeing a physical sequence once — a dance step, a golf swing, a handshake — you reproduce it accurately within two attempts.",
    ),
    a(
      "A physical skill you haven't touched in years comes back to your body within minutes, not weeks.",
    ),
    a(
      "Learning a new sport or movement, you need far fewer repetitions than the people around you to get the basics.",
    ),
    a(
      "You feel clumsy copying physical movements and have to be shown several times.",
      true,
    ),
    a(
      "People remark that you “pick things up fast” physically — an instrument, a tool, a technique.",
    ),
  ],
  SEN: [
    a(
      "You notice when a cover song, karaoke track, or live singer is pitched slightly off from the original.",
    ),
    a(
      "You detect subtle differences others miss — near shades of color, flavors in a dish, faint background sounds.",
    ),
    a("You can identify a song within its first second or two."),
    a(
      "Fine sensory differences — close colors, faint off-notes, subtle flavors — generally pass you by.",
      true,
    ),
    a(
      "A specific smell, taste, or sound instantly returns you to a precise memory.",
    ),
  ],
  ADP: [
    a(
      "People are surprised by how far your joints (wrists, elbows, fingers, or more) bend.",
    ),
    a(
      "You recover from hard physical exertion faster than the people you did it with.",
    ),
    a(
      "You hold your breath, sustain wind, or control your breathing notably longer than peers.",
    ),
    a(
      "Physically, you tire or need recovery sooner than others doing the same activity.",
      true,
    ),
    a(
      "You tolerate conditions others struggle with — heat, cold, discomfort, long duration.",
    ),
  ],
  ANL: [
    a(
      "You spot the error — in a bill, a spreadsheet, a schedule, an argument — that everyone else missed.",
    ),
    a(
      "You see several moves ahead: you anticipate how a situation or system will play out.",
    ),
    a(
      "You run multi-step math or estimates in your head faster than others reach for a calculator.",
    ),
    a(
      "Number-heavy or highly complex problems make you want to hand them to someone else.",
      true,
    ),
    a("You naturally find the more efficient route, process, or solution."),
  ],
  MEM: [
    a(
      "You recall conversations, pages, or details close to word-for-word after one exposure.",
    ),
    a(
      "You remember specific dates and days — and what happened on them — going years back.",
    ),
    a("You lock a name to a face after meeting someone once."),
    a(
      "Names, numbers, and details slip away soon after you hear them.",
      true,
    ),
    a(
      "You memorize sequences — numbers, routes, steps, lyrics — with little effort.",
    ),
  ],
  GEN: [
    a("You produce more ideas than you can use, without trying hard."),
    a(
      "You connect ideas from completely different fields into something new.",
    ),
    a("You improvise well on the spot — words, music, solutions, jokes."),
    a(
      "Faced with a blank page or an open brief, you struggle to generate options.",
      true,
    ),
    a(
      "You reshape or remix existing things into something that feels original.",
    ),
  ],
  REL: [
    a(
      "Within ten minutes of meeting you, strangers tell you things they say they “don't usually tell people.”",
    ),
    a("You read the mood or tension in a room within moments of entering."),
    a(
      "You calm charged situations and bring the temperature down between people.",
    ),
    a(
      "You're often surprised by how people were really feeling — you missed the signals.",
      true,
    ),
    a("You sense what someone actually wants, beneath what they say."),
  ],
  EXP: [
    a("When you speak to a group, you feel them lock in and follow you."),
    a("You make complicated things clear and simple for other people."),
    a("You're at ease and effective on camera or on a stage."),
    a(
      "Speaking in front of others, your delivery tends to lose people.",
      true,
    ),
    a(
      "You can make an audience feel a specific emotion you intend — laugh, still, moved.",
    ),
  ],
  PER: [
    a(
      "You keep your orientation — you know which way is which and can retrace a route — without a map.",
    ),
    a(
      "You notice small changes in a space: what moved, what's new, what's off.",
    ),
    a(
      "You accurately sense how much time has passed without checking a clock.",
    ),
    a(
      "You get turned around easily and lose track of where things are around you.",
      true,
    ),
    a(
      "You pick up when “something isn't right” in a place or situation before others do.",
    ),
  ],
};

export const C_ITEMS: Record<DomainId, string[]> = {
  KIN: [
    "I'm comfortable performing physical skills while people watch.",
    "I'd rather learn by doing with my body than by reading about it.",
    "I stick with physical practice until my body gets it right.",
  ],
  SEN: [
    "I get absorbed in fine sensory detail — sound, color, taste, texture.",
    "Small imperfections in what I see or hear bother me until they're fixed.",
    "I seek out rich sensory experiences on purpose.",
  ],
  ADP: [
    "I push my body's limits and enjoy the challenge.",
    "I keep going physically when others tap out.",
    "I build physical capacity through steady, progressive effort.",
  ],
  ANL: [
    "I enjoy taking complex problems apart to see how they work.",
    "I double-check logic and numbers others take on faith.",
    "I look for the underlying system behind what I'm seeing.",
  ],
  MEM: [
    "I trust my memory over my notes.",
    "I enjoy drilling things until I can recall them cold.",
    "I naturally build tricks and associations to remember things.",
  ],
  GEN: [
    "I'd rather make something new than perfect something that exists.",
    "My mind jumps between unrelated ideas and links them.",
    "Constraints make me more inventive, not less.",
  ],
  REL: [
    "I'm energized by reading and connecting with people.",
    "I naturally attend to how others are feeling.",
    "I adjust my approach to fit whoever I'm with.",
  ],
  EXP: [
    "I come alive with an audience in front of me.",
    "I care about how a message is delivered, not just what it says.",
    "I'll take the mic or the stage when the moment calls for it.",
  ],
  PER: [
    "I scan and stay aware of my surroundings by default.",
    "I notice when the details of a place don't add up.",
    "I keep a running mental map of where I am.",
  ],
};

export const SDR_ITEMS = [
  "I have never exaggerated a skill to impress someone.",
  "Every new skill I've tried, I've been good at immediately.",
];
