import { describe, expect, it } from "vitest";
import { DOMAIN_IDS } from "../data/domains";
import { stageForDay } from "../storage/protocol";
import { protocolSummary, taskForDay } from "./protocolDetail";

describe("protocol daily assignments", () => {
  it("returns a concrete task for every domain on every day, matching its stage", () => {
    DOMAIN_IDS.forEach((id) => {
      expect(protocolSummary(id).length).toBeGreaterThan(20);
      for (let day = 1; day <= 30; day++) {
        const task = taskForDay(id, day);
        expect(task.title.length).toBeGreaterThan(3);
        expect(task.body.length).toBeGreaterThan(60); // real instructions, not a label
        expect(task.stageName).toBe(stageForDay(day).name);
      }
    });
  });

  it("cycles four distinct drills through the practice phase", () => {
    DOMAIN_IDS.forEach((id) => {
      const titles = new Set(
        Array.from({ length: 14 }, (_, i) => taskForDay(id, 8 + i).title),
      );
      expect(titles.size).toBe(4);
    });
  });

  it("carries the safety note on Adaptive's physical days", () => {
    expect(taskForDay("ADP", 5).safety).toBeTruthy();
    expect(taskForDay("ADP", 10).safety).toBeTruthy();
    expect(taskForDay("ANL", 10).safety).toBeUndefined();
  });
});
