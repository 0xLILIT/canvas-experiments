import { Body } from "./body.js";
import { Vector2 } from "./vector2.js";

export class Scene {
  private bodies: Array<Body> = [];
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private running: boolean = false;
  private lastTimestamp: number | null = null;
  private animationFrameRequestID: number | null = null;
  private framesLastSecond: Array<number> = [];

  constructor(
    canvas: HTMLCanvasElement | null = document.querySelector("canvas"),
  ) {
    this.canvas = canvas;
    if (!this.canvas)
      throw new Error(
        "Could not initialize scene.\nReason: Could not find Canvas DOM element.",
      );

    this.ctx = this.canvas!.getContext("2d");
    if (!this.ctx)
      throw new Error(
        "Could not initialize scene.\nReason: Could not get rendering context from Canvas DOM element.",
      );

    this.canvas.addEventListener("click", (event: MouseEvent) => {
      const { offsetX, offsetY }: { offsetX: number; offsetY: number } = event;
      this.bodies.push(new Body(new Vector2(offsetX, offsetY)));
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
    while (
      this.framesLastSecond.length > 0 &&
      this.framesLastSecond[0] <= timestamp - 1000
    ) {
      this.framesLastSecond.shift();
    }
    this.framesLastSecond.push(timestamp);

    if (!this.running) return;

    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
    }

    const dt = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    this.update(dt);
    this.draw();
    this.animationFrameRequestID = requestAnimationFrame((ts) => this.tick(ts));
  }

  private update(dt: number): void {
    // TODO: Settings
    const G: number = 1;

    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const b1: Body = this.bodies[i];
        const b2: Body = this.bodies[j];

        const displacement: Vector2 = b2.position.toSubtracted(b1.position);
        const direction: Vector2 = displacement.toNormalized();

        if (direction.magnitudeSquared === 0) continue;

        const distance: number = direction.magnitude;
        const force: number = G * ((b1.mass * b2.mass) / distance ** 2);
        const fx: number = force * direction.x;
        const fy: number = force * direction.y;

        b1.vx += (fx / b1.mass) * dt;
        b1.vy += (fy / b1.mass) * dt;
        b2.vx -= (fx / b2.mass) * dt;
        b2.vy -= (fy / b2.mass) * dt;
      }
    }

    for (const body of this.bodies) {
      body.x += body.vx * dt;
      body.y += body.vy * dt;

      if (body.x > this.width) {
        body.x = this.width;
        body.velocity.invertX().scale(body.elasticity);
      } else if (body.x < 0) {
        body.x = 0;
        body.velocity.invertX().scale(body.elasticity);
      }

      if (body.y > this.height) {
        body.y = this.height;
        body.velocity.invertY().scale(body.elasticity);
      } else if (body.y < 0) {
        body.y = 0;
        body.velocity.invertY().scale(body.elasticity);
      }
    }
  }

  private draw(): void {
    this.ctx!.clearRect(0, 0, this.width, this.height);
    this.ctx!.fillStyle = "green";
    this.ctx!.font = "16px monospace";
    this.ctx!.fillText("FPS: " + String(this.fps), 5, 20);

    this.ctx!.fillStyle = "black";
    for (const body of this.bodies) {
      // const size: number = Math.max(1, body.mass / 100);
      const size = 5;
      this.ctx?.beginPath();
      this.ctx?.arc(body.x, body.y, size, 0, 2 * Math.PI);
      this.ctx?.fill();
    }
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
