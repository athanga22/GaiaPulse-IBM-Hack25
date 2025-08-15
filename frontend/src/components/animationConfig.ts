export type AppState = "critical" | "stressed" | "neutral" | "healing";

export const LOOK: Record<AppState, {
  base: string;
  halo: number;
  pulse: number;
  particle: number;
  arcDensity: number;
}> = {
  critical: { base: "#ff3b30", halo: 1.6, pulse: 2.0, particle: 1.6, arcDensity: 0.9 },
  stressed: { base: "#ffcc00", halo: 1.2, pulse: 1.2, particle: 1.2, arcDensity: 0.6 },
  neutral: { base: "#3da9fc", halo: 0.8, pulse: 0.6, particle: 0.8, arcDensity: 0.4 },
  healing: { base: "#34c759", halo: 1.4, pulse: 1.5, particle: 0.6, arcDensity: 0.5 },
};
