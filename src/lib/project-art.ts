// Deterministic, monochrome cover art for projects that have no screenshot.
export type ProjectArt = {
  glowX: number;
  glowY: number;
  angle: number;
  mark: 0 | 1 | 2;
  sparkX: number;
  sparkY: number;
};

const hash = (input: string) => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export function getProjectArt(slug: string): ProjectArt {
  const h = hash(slug);
  const pick = (shift: number, min: number, max: number) =>
    min + (((h >>> shift) & 0xff) / 0xff) * (max - min);
  return {
    glowX: Math.round(pick(0, 15, 85)),
    glowY: Math.round(pick(8, 20, 80)),
    angle: Math.round(pick(16, 0, 180)),
    mark: (h % 3) as ProjectArt["mark"],
    sparkX: Math.round(pick(24, 12, 88)),
    sparkY: Math.round(pick(4, 14, 86)),
  };
}
