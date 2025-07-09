import { Vector2 } from "./vector2.js";

export interface BodyOptions {
  position?: Vector2;
  velocity?: Vector2;
  mass?: number;
  elasticity?: number;
}

export interface PolygonBodyOptions extends BodyOptions {
  vertices?: Array<Vector2>;
}

export interface CircleBodyOptions extends BodyOptions {
  radius?: number;
}

export class Body {
  public position: Vector2;
  public velocity: Vector2;
  public mass: number;
  public elasticity: number;

  static rectangle(x: number, y: number, width: number, height: number) {
    const hw: number = width / 2;
    const hh: number = height / 2;
    const tl: Vector2 = new Vector2(-hw, -hh);
    const tr: Vector2 = new Vector2(hw, -hh);
    const br: Vector2 = new Vector2(hw, hh);
    const bl: Vector2 = new Vector2(-hw, hh);

    const opts: PolygonBodyOptions = {
      vertices: [tl, tr, br, bl],
      position: new Vector2(x, y),
    };

    return new PolygonBody(opts);
  }

  static triangle(x: number, y: number, width: number, height: number) {
    const hw: number = width / 2;
    const hh: number = height / 2;
    const t: Vector2 = new Vector2(0, -hh);
    const br: Vector2 = new Vector2(hw, hh);
    const bl: Vector2 = new Vector2(-hw, hh);

    const opts: PolygonBodyOptions = {
      vertices: [t, br, bl],
      position: new Vector2(x, y),
    };

    return new PolygonBody(opts);
  }

  static circle(x: number, y: number, radius: number) {
    const opts: CircleBodyOptions = { radius, position: new Vector2(x, y) };
    return new CircleBody(opts);
  }

  constructor({
    position = new Vector2(),
    velocity = new Vector2(),
    mass = 1,
    elasticity = 0.5,
  }: BodyOptions = {}) {
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

  get y(): number {
    return this.position.y;
  }

  set y(val: number) {
    this.position.y = val;
  }

  get vx(): number {
    return this.velocity.x;
  }

  set vx(val: number) {
    this.velocity.x = val;
  }

  get vy(): number {
    return this.velocity.y;
  }

  set vy(val: number) {
    this.velocity.y = val;
  }
}

export class PolygonBody extends Body {
  public vertices: Array<Vector2>;
  constructor({ vertices = [], ...rest }: PolygonBodyOptions = {}) {
    super(rest);
    this.vertices = vertices;
  }
}

export class CircleBody extends Body {
  public radius: number;
  constructor({ radius = 1, ...rest }: CircleBodyOptions = {}) {
    super(rest);
    this.radius = radius;
  }
}
