/* Result artwork manifest, ported verbatim. Commissioned art with one to
   several interchangeable pieces per braid/domain/family — pick one at random
   each render. Paths resolve under the app's BASE_URL so the GitHub Pages
   subpath deploy works unchanged. */

import type { DomainId, Family } from "./domains";

export const RESULT_IMAGES: {
  braids: Record<string, string[]>;
  domains: Record<DomainId, string[]>;
  families: Record<Family, string[]>;
  fallback: string[];
} = {
  braids: {
    "The Adept": ["braids/adept-1.jpg", "braids/adept-2.jpg", "braids/adept-3.jpg", "braids/adept-4.jpg"],
    "The Aesthete": ["braids/aesthete-1.jpg", "braids/aesthete-2.jpg", "braids/aesthete-3.jpg"],
    "The Athlete": ["braids/athlete-1.jpg", "braids/athlete-2.jpg", "braids/athlete-3.jpg", "braids/athlete-4.jpg"],
    "The Bard": ["braids/bard-1.jpg", "braids/bard-2.jpg"],
    "The Caregiver": ["braids/caregiver-1.jpg", "braids/caregiver-2.jpg"],
    "The Composer": ["braids/composer-1.jpg", "braids/composer-2.jpg", "braids/composer-3.jpg"],
    "The Connector": ["braids/connector-1.jpg", "braids/connector-2.jpg"],
    "The Connoisseur": ["braids/connoisseur-1.jpg", "braids/connoisseur-2.jpg", "braids/connoisseur-3.jpg", "braids/connoisseur-4.jpg", "braids/connoisseur-5.jpg"],
    "The Craftsman": ["braids/craftsman-1.jpg", "braids/craftsman-2.jpg", "braids/craftsman-3.jpg", "braids/craftsman-4.jpg", "braids/craftsman-5.jpg", "braids/craftsman-6.jpg", "braids/craftsman-7.jpg"],
    "The Daredevil": ["braids/daredevil-1.jpg", "braids/daredevil-2.jpg"],
    "The Diagnostician": ["braids/diagnostician-1.jpg", "braids/diagnostician-2.jpg", "braids/diagnostician-3.jpg"],
    "The Diplomat": ["braids/diplomat-1.jpg", "braids/diplomat-2.jpg"],
    "The Documentarian": ["braids/documentarian-1.jpg", "braids/documentarian-2.jpg", "braids/documentarian-3.jpg"],
    "The Empath": ["braids/empath-1.jpg", "braids/empath-2.jpg", "braids/empath-3.jpg", "braids/empath-4.jpg"],
    "The Entertainer": ["braids/entertainer-1.jpg", "braids/entertainer-2.jpg"],
    "The Explorer": ["braids/explorer-1.jpg", "braids/explorer-2.jpg"],
    "The Healer": ["braids/healer-1.jpg", "braids/healer-2.jpg", "braids/healer-3.jpg", "braids/healer-4.jpg"],
    "The Instrument": ["braids/instrument-1.jpg", "braids/instrument-2.jpg"],
    "The Inventor": ["braids/inventor-1.jpg", "braids/inventor-2.jpg"],
    "The Leader": ["braids/leader-1.jpg", "braids/leader-2.jpg"],
    "The Maker": ["braids/maker-1.jpg", "braids/maker-2.jpg", "braids/maker-3.jpg", "braids/maker-4.jpg"],
    "The Natural": ["braids/natural-1.jpg", "braids/natural-2.jpg", "braids/natural-3.jpg", "braids/natural-4.jpg", "braids/natural-5.jpg"],
    "The Negotiator": ["braids/negotiator-1.jpg", "braids/negotiator-2.jpg"],
    "The Optimizer": ["braids/optimizer-1.jpg", "braids/optimizer-2.jpg"],
    "The Performer": ["braids/performer-1.jpg", "braids/performer-2.jpg", "braids/performer-3.jpg", "braids/performer-4.jpg", "braids/performer-5.jpg"],
    "The Scholar": ["braids/scholar-1.jpg", "braids/scholar-2.jpg"],
    "The Storyteller": ["braids/storyteller-1.jpg", "braids/storyteller-2.jpg", "braids/storyteller-3.jpg"],
    "The Stylist": ["braids/stylist-1.jpg", "braids/stylist-2.jpg", "braids/stylist-3.jpg", "braids/stylist-4.jpg"],
    "The Synthesizer": ["braids/synthesizer-1.jpg", "braids/synthesizer-2.jpg"],
    "The Tactician": ["braids/tactician-1.jpg", "braids/tactician-2.jpg", "braids/tactician-3.jpg", "braids/tactician-4.jpg"],
    "The Tracker": ["braids/tracker-1.jpg", "braids/tracker-2.jpg", "braids/tracker-3.jpg"],
    "The Translator": ["braids/translator-1.jpg", "braids/translator-2.jpg"],
    "The Veteran": ["braids/veteran-1.jpg", "braids/veteran-2.jpg"],
    "The Virtuoso": ["braids/virtuoso-1.jpg", "braids/virtuoso-2.jpg", "braids/virtuoso-3.jpg", "braids/virtuoso-4.jpg"],
    "The Visionary": ["braids/visionary-1.jpg", "braids/visionary-2.jpg"],
    "The Witness": ["braids/witness-1.jpg", "braids/witness-2.jpg"],
  },
  domains: {
    ADP: ["domains/adaptive-1.jpg", "domains/adaptive-2.jpg", "domains/adaptive-3.jpg", "domains/adaptive-4.jpg"],
    ANL: ["domains/analytic-1.jpg", "domains/analytic-2.jpg", "domains/analytic-3.jpg", "domains/analytic-4.jpg"],
    EXP: ["domains/expressive-1.jpg", "domains/expressive-2.jpg", "domains/expressive-3.jpg", "domains/expressive-4.jpg", "domains/expressive-5.jpg", "domains/expressive-6.jpg"],
    GEN: ["domains/generative-1.jpg", "domains/generative-2.jpg", "domains/generative-3.jpg", "domains/generative-4.jpg"],
    KIN: ["domains/kinetic-1.jpg", "domains/kinetic-2.jpg", "domains/kinetic-3.jpg", "domains/kinetic-4.jpg"],
    MEM: ["domains/mnemonic-1.jpg", "domains/mnemonic-2.jpg"],
    PER: ["domains/perceptive-1.jpg", "domains/perceptive-2.jpg", "domains/perceptive-3.jpg", "domains/perceptive-4.jpg", "domains/perceptive-5.jpg", "domains/perceptive-6.jpg"],
    REL: ["domains/relational-1.jpg", "domains/relational-2.jpg", "domains/relational-3.jpg", "domains/relational-4.jpg"],
    SEN: ["domains/sensory-1.jpg", "domains/sensory-2.jpg", "domains/sensory-3.jpg", "domains/sensory-4.jpg"],
  },
  families: {
    field: ["families/field-1.jpg", "families/field-2.jpg"],
    mind: ["families/mind-1.jpg", "families/mind-2.jpg", "families/mind-3.jpg"],
    soma: ["families/soma-1.jpg", "families/soma-2.jpg", "families/soma-3.jpg"],
  },
  fallback: ["fallback/error-filler.jpg", "fallback/null.jpg"],
};

const IMAGES_BASE = `${import.meta.env.BASE_URL}images/results/`;

function pickResultImage(pool: string[] | undefined): string {
  const list = pool && pool.length ? pool : RESULT_IMAGES.fallback;
  return IMAGES_BASE + list[Math.floor(Math.random() * list.length)];
}

export function braidImage(name: string): string {
  return pickResultImage(RESULT_IMAGES.braids[name]);
}
export function domainImage(id: DomainId): string {
  return pickResultImage(RESULT_IMAGES.domains[id]);
}
export function familyImage(key: Family): string {
  return pickResultImage(RESULT_IMAGES.families[key]);
}
