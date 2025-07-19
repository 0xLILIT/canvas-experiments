import { Vector2 } from "./vector2.js";

export type PhysicsMode = "earth" | "space" | "particle";
export type DebugLine = [Vector2, Vector2, number];

export interface SceneContext {
  width: number;
  height: number;
  debug: boolean;
  addDebugLine: (line: DebugLine) => void;
}

export interface RenderContext {
  debug: boolean;
  debugLines: Array<DebugLine>;
  fps: number;
}
