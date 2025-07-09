import { Scene } from "../scene.js";
import { Particle } from "./particle.js";
import { Vector2 } from "../vector2.js";

export class ParticleScene extends Scene {
  protected bodies: Array<Particle> = [];

  private particleRules: Map<string, Map<string, number>> = new Map();
  private particleGroups: Map<string, { color: string; radius: number }> =
    new Map();

  constructor(
    canvas: HTMLCanvasElement | null = document.querySelector("canvas"),
  ) {
    super(canvas);
    // this.settings.rendering.debug = true;

    const groups = ["blue", "red", "green", "yellow"];
    for (const group of groups) {
      this.createParticleGroup(group, group, 3);
      for (let i = 0; i < 200; i++) {
        this.createParticle(group);
      }
    }

    this.canvas?.addEventListener("click", (event: MouseEvent) => {
      this.randomizeAttraction();
      this.logAttractionRules();
    });
  }

  public randomizeAttraction(min: number = -1000, max: number = 1000): void {
    const groups = Array.from(this.particleGroups.keys());

    for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < groups.length; j++) {
        const groupA = groups[i];
        const groupB = groups[j];
        const rulesA = this.particleRules.get(groupA)!;
        const rulesB = this.particleRules.get(groupB)!;

        // if (j === i) {
        //   rulesA.set(groupB, 100);
        //   rulesB.set(groupA, 100);
        //   continue;
        // }

        const randomValueAB = Math.random() * (max - min) + min;
        const randomValueBA = Math.random() * (max - min) + min;

        rulesA.set(groupB, randomValueAB);
        rulesB.set(groupA, randomValueBA);
      }
    }
  }

  public logAttractionRules(): void {
    for (const [groupA, map] of this.particleRules) {
      for (const [groupB, value] of map) {
        console.log(`${groupA} → ${groupB}: ${value.toFixed(2)}`);
      }
    }
  }

  protected update(dt: number): void {
    if (this.settings.rendering.debug) {
      this.debugLines = [];
    }

    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const b1: Particle = this.bodies[i];
        const b2: Particle = this.bodies[j];
        const b1Rules = this.particleRules.get(b1.particleGroup)!;

        const displacement: Vector2 = b2.position.toSubtracted(b1.position);
        const direction: Vector2 = displacement.toNormalized();
        let distance: number = displacement.magnitudeSquared;

        if (distance === 0 || distance > 62500) continue;

        const softening = 10;
        distance = Math.sqrt(distance + softening ** 2);

        const force: number =
          b1Rules.get(b2.particleGroup)! *
          ((b1.mass * b2.mass) / distance ** 2);
        const fx: number = force * direction.x;
        const fy: number = force * direction.y;

        if (this.settings.rendering.debug) {
          this.debugLines!.push([b1.position, b2.position, force]);
        }

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

  protected drawBodies(): void {
    for (const body of this.bodies) {
      const particleGroup = this.particleGroups.get(body.particleGroup)!;
      this.ctx!.fillStyle = particleGroup.color;
      this.ctx!.beginPath();
      this.ctx!.arc(body.x, body.y, particleGroup.radius, 0, 2 * Math.PI);
      this.ctx!.fill();
    }
  }

  public createParticleGroup(name: string, color: string, radius: number) {
    if (this.particleGroups.has(name)) return;

    this.particleGroups.set(name, { color, radius });
    this.particleRules.set(name, new Map());
    const rules = this.particleRules.get(name)!;

    for (const group of this.particleGroups.keys()) {
      rules.set(group, 1000);
      this.particleRules.get(group)!.set(name, 1000);
    }
  }

  public createParticle(particleGroup: string) {
    if (!this.particleGroups.has(particleGroup)) return;

    const x = Math.random() * this.width;
    const y = Math.random() * this.height;

    this.bodies.push(
      new Particle({ position: new Vector2(x, y), particleGroup, mass: 100 }),
    );
  }
}
