import { Body } from "./body.js";
import { PhysicsEngine } from "./physics.js";
import { Renderer } from "./renderer.js";
import {
  DebugLine,
  PhysicsMode,
  RenderContext,
  SceneContext,
} from "./types.js";
import { Vector2 } from "./vector2.js";

interface SceneOptions {
  debug?: boolean;
  physicsMode?: PhysicsMode;
}

export class Scene {
  private canvas: HTMLCanvasElement | null;
  private bodies: Array<Body> = [];
  private running: boolean = false;
  private lastTimestamp: number | null = null;
  private debug: boolean = false;
  private animationFrameRequestID: number | null = null;
  private framesLastSecond: Array<number> = [];
  private debugLines: Array<DebugLine> = [];
  private renderer: Renderer;
  private physics: PhysicsEngine;

  constructor(
    canvas: HTMLCanvasElement | null = document.querySelector("canvas"),
    { debug = false, physicsMode = "earth" }: SceneOptions = {},
  ) {
    this.canvas = canvas;
    if (!this.canvas)
      throw new Error(
        "Could not initialize scene.\nReason: Could not find Canvas DOM element.",
      );

    this.debug = debug;
    this.renderer = new Renderer(canvas!);
    this.physics = new PhysicsEngine(physicsMode);
    this.canvas.addEventListener("click", (ev: MouseEvent) => {
      console.log(this.bodies);
      const body = Body.circle(ev.offsetX, ev.offsetY, 20);
      this.bodies.push(body);
    });
  }

  get fps(): number {
    return this.framesLastSecond.length;
  }

  get width(): number {
    return this.canvas!.width;
  }

  get height(): number {
    return this.canvas!.height;
  }

  private tick(timestamp: number): void {
    if (!this.running) return;

    while (
      this.framesLastSecond.length > 0 &&
      this.framesLastSecond[0] <= timestamp - 1000
    ) {
      this.framesLastSecond.shift();
    }

    this.framesLastSecond.push(timestamp);

    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
    }

    const dt = (timestamp - this.lastTimestamp) / 1000;

    const sceneContext: SceneContext = {
      width: this.width,
      height: this.height,
      debug: this.debug,
      addDebugLine: (line: DebugLine) => {
        this.debugLines!.push(line);
      },
    };

    const renderContext: RenderContext = {
      debug: this.debug,
      debugLines: this.debugLines,
      fps: this.framesLastSecond.length,
    };

    this.physics.step(dt, this.bodies, sceneContext);
    this.renderer.draw(this.bodies, renderContext);
    this.lastTimestamp = timestamp;
    this.animationFrameRequestID = requestAnimationFrame((ts) => this.tick(ts));
  }

  public play(): void {
    if (this.running) return;
    this.running = true;
    this.lastTimestamp = null;
    this.animationFrameRequestID = requestAnimationFrame((ts) => this.tick(ts));
  }

  public pause(): void {
    if (!this.running) return;
    this.running = false;
    if (this.animationFrameRequestID !== null) {
      cancelAnimationFrame(this.animationFrameRequestID);
      this.animationFrameRequestID = null;
    }
  }
}
