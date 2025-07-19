import { Body, CircleBody, PolygonBody } from "./body.js";
import { DebugLine, RenderContext } from "./types.js";
import { Vector2 } from "./vector2.js";

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    if (!this.ctx)
      throw new Error(
        "Could not initialize scene.\nReason: Could not get rendering context from Canvas DOM element.",
      );
  }

  get width(): number {
    return this.canvas!.width;
  }

  get height(): number {
    return this.canvas!.height;
  }

  private drawBodies(bodies: Array<Body>): void {
    this.ctx!.fillStyle = "black";
    for (const body of bodies) {
      this.ctx.fillStyle = body.color;
      if (body instanceof PolygonBody) {
        const vertices: Array<Vector2> = body.vertices.map((vertex) => {
          return vertex.toAdded(body.position);
        });

        this.ctx.beginPath();
        this.ctx.moveTo(vertices[0].x, vertices[0].y);

        for (let i = 1; i < vertices.length; i++) {
          this.ctx!.lineTo(vertices[i].x, vertices[i].y);
        }

        this.ctx.closePath();
        this.ctx.fill();
      } else if (body instanceof CircleBody) {
        this.ctx.beginPath();
        this.ctx.arc(body.x, body.y, body.radius, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    }
  }

  private drawFPS(fps: number): void {
    this.ctx.fillStyle = "green";
    this.ctx.font = "16px monospace";
    this.ctx.fillText("FPS: " + String(fps), 5, 20);
  }

  private drawDebug(bodies: Array<Body>, debugLines: Array<DebugLine>): void {
    this.ctx.fillStyle = "green";
    this.ctx.font = "16px monospace";
    this.ctx.fillText("Number of bodies: " + String(bodies.length), 5, 40);

    for (const debugLine of debugLines) {
      this.ctx.beginPath();
      const b1 = debugLine[0];
      const b2 = debugLine[1];
      const force = debugLine[2];
      this.ctx.strokeStyle = `rgba(0,0,0,${Math.min(1, Math.log10(force) / 3)})`;
      this.ctx.moveTo(b1.x, b1.y);
      this.ctx.lineTo(b2.x, b2.y);
      this.ctx.stroke();
    }

    for (const body of bodies) {
      this.ctx!.font = "10px monospace";
      this.ctx!.fillText(
        `(${body.x.toPrecision(3)}, ${body.y.toPrecision(3)})`,
        body.x + 6,
        body.y,
      );
      this.ctx!.fillText(
        `(${body.vx.toPrecision(3)}, ${body.vy.toPrecision(3)})`,
        body.x + 6,
        body.y + 10,
      );
    }
  }

  public draw(bodies: Body[], { debug, debugLines, fps }: RenderContext) {
    this.ctx!.clearRect(0, 0, this.width, this.height);
    this.ctx!.fillStyle = "white";
    this.ctx!.fillRect(0, 0, this.width, this.height);
    this.drawFPS(fps);
    if (debug) this.drawDebug(bodies, debugLines);
    this.drawBodies(bodies);
  }
}
