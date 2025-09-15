import { PhysicsMode, SceneContext } from "./types.js";
import { Body, CircleBody, PolygonBody } from "./body.js";
import { Vector2 } from "./vector2.js";

export class PhysicsEngine {
  private mode: PhysicsMode;

  constructor(mode: PhysicsMode) {
    this.mode = mode;
  }

  public step(
    dt: number,
    bodies: Array<Body>,
    {
      width: sceneWidth,
      height: sceneHeight,
      debug,
      addDebugLine,
    }: SceneContext,
  ): void {
    switch (this.mode) {
      case "earth": {
        const g: number = 9.8 * 200;

        for (const body of bodies) {
          const width =
            body instanceof CircleBody
              ? body.radius
              : body instanceof PolygonBody
                ? body.width
                : 0;

          const height =
            body instanceof CircleBody
              ? body.radius
              : body instanceof PolygonBody
                ? body.height
                : 0;

          body.vy += g * dt;
          const newX = body.x + body.vx * dt;
          const newY = body.y + body.vy * dt;

          for (const body2 of bodies) {
            if (body === body2) continue;

            const width2 =
              body instanceof CircleBody
                ? body.radius
                : body instanceof PolygonBody
                  ? body.width
                  : 0;

            // const height2 =
            //   body instanceof CircleBody
            //     ? body.radius
            //     : body instanceof PolygonBody
            //       ? body.height
            //       : 0;

            const dx = body.x - body2.x;
            const dy = body.y - body2.y;
            const d = Math.sqrt(dx ** 2 + dy ** 2);
            if (d <= width + width2) {
              // UNUSED
            }
          }

          if (newX > sceneWidth - width) {
            body.x = sceneWidth - width;
            body.velocity.invertX().scale(body.elasticity);
          } else if (newX < 0 + width) {
            body.x = 0 + width;
            body.velocity.invertX().scale(body.elasticity);
          } else {
            body.x = newX;
          }

          if (newY > sceneHeight - height) {
            body.y = sceneHeight - height;
            body.velocity.invertY().scale(body.elasticity);
          } else if (newY < 0 + height) {
            body.y = 0 + height;
            body.velocity.invertY().scale(body.elasticity);
          } else {
            body.y = newY;
          }
        }

        break;
      }

      case "space": {
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const b1: Body = bodies[i];
            const b2: Body = bodies[j];

            const displacement: Vector2 = b2.position.toSubtracted(b1.position);
            const direction: Vector2 = displacement.toNormalized();
            let distance: number = displacement.magnitudeSquared;

            if (distance === 0) continue;

            const softening = 5;
            distance = Math.sqrt(distance + softening ** 2);

            const G: number = 6.6743e-11;
            const force: number = G * ((b1.mass * b2.mass) / distance ** 2);
            const fx: number = force * direction.x;
            const fy: number = force * direction.y;

            if (debug) {
              addDebugLine([b1.position, b2.position, force]);
            }

            b1.vx += (fx / b1.mass) * dt;
            b1.vy += (fy / b1.mass) * dt;
            b2.vx -= (fx / b2.mass) * dt;
            b2.vy -= (fy / b2.mass) * dt;
          }
        }

        for (const body of bodies) {
          body.x += body.vx * dt;
          body.y += body.vy * dt;

          if (body.x > sceneWidth) {
            body.x = sceneWidth;
            body.velocity.invertX().scale(body.elasticity);
          } else if (body.x < 0) {
            body.x = 0;
            body.velocity.invertX().scale(body.elasticity);
          }

          if (body.y > sceneHeight) {
            body.y = sceneHeight;
            body.velocity.invertY().scale(body.elasticity);
          } else if (body.y < 0) {
            body.y = 0;
            body.velocity.invertY().scale(body.elasticity);
          }
        }
        break;
      }

      case "particle":
        break;

      default:
        break;
    }
  }
}
