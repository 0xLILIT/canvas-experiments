import { Vector2 } from "./vector2.js";

export class Body {
  public position: Vector2;
  public velocity: Vector2;
  public mass: number;
  public elasticity: number;

  constructor(
    position: Vector2 = new Vector2(),
    velocity: Vector2 = new Vector2(),
    mass: number = 100,
    elasticity: number = 0.5,
  ) {
    this.position = position;
    this.mass = mass;
    this.velocity = velocity;
    this.elasticity = elasticity;
  }

  get x(): number {
    return this.position.x;
  }

  set x(val: number) {
    this.position.x = val;
  }

  set y(val: number) {
    this.position.y = val;
  }

  get y(): number {
    return this.position.y;
  }

  get vx(): number {
    return this.velocity.x;
  }

  get vy(): number {
    return this.velocity.y;
  }

  set vx(val: number) {
    this.velocity.x = val;
  }

  set vy(val: number) {
    this.velocity.y = val;
  }
}
