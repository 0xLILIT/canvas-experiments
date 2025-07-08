export class Vector2 {
  public x: number;
  public y: number;

  static fromArray(arr: Array<number>): Vector2 {
    if (arr.length < 2)
      throw new Error("Could not parse array.\nReason: Missing element.");

    const x: number = typeof arr[0] !== "number" ? Number(arr[0]) : arr[0];
    const y: number = typeof arr[1] !== "number" ? Number(arr[1]) : arr[1];

    return new this(x, y);
  }

  static fromObject(obj: Record<string, any>): Vector2 {
    if (obj.x === undefined || obj.y === undefined)
      throw new Error("Could not parse object.\nReason: Missing key.");

    const x: number = typeof obj.x !== "number" ? Number(obj.x) : obj.x;
    const y: number = typeof obj.y !== "number" ? Number(obj.y) : obj.y;

    if (Number.isNaN(x) || Number.isNaN(y))
      throw new Error("Could not parse.\nReason: Value is NaN.");

    return new this(x, y);
  }

  static fromVector2(vec: Vector2): Vector2 {
    return new this(vec.x, vec.y);
  }

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  get magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get magnitudeSquared(): number {
    return this.x ** 2 + this.y ** 2;
  }

  public clone(): Vector2 {
    return Vector2.fromVector2(this);
  }

  public add(vec: Vector2): Vector2 {
    this.x += vec.x;
    this.y += vec.y;

    return this;
  }

  public toAdded(vec: Vector2): Vector2 {
    return this.clone().add(vec);
  }

  public distanceTo(vec: Vector2): number {
    const dx = this.x - vec.x;
    const dy = this.y - vec.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  public distanceToSquared(vec: Vector2): number {
    const dx = this.x - vec.x;
    const dy = this.y - vec.y;
    return dx ** 2 + dy ** 2;
  }

  public normalize(): Vector2 {
    const magnitude: number = this.magnitude;
    if (magnitude === 0) return this;

    this.x /= magnitude;
    this.y /= magnitude;

    return this;
  }

  public toNormalized(): Vector2 {
    return this.clone().normalize();
  }

  public subtract(vec: Vector2): Vector2 {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  public toSubtracted(vec: Vector2): Vector2 {
    return this.clone().subtract(vec);
  }

  public copy(vec: Vector2): Vector2 {
    this.x = vec.x;
    this.y = vec.y;

    return this;
  }

  public copyX(vec: Vector2): Vector2 {
    this.x = vec.x;
    return this;
  }

  public copyY(vec: Vector2): Vector2 {
    this.y = vec.y;
    return this;
  }

  public invert(): Vector2 {
    this.x *= -1;
    this.y *= -1;

    return this;
  }

  public toInverted(): Vector2 {
    return this.clone().invert();
  }

  public invertX(): Vector2 {
    this.x *= -1;

    return this;
  }

  public invertY(): Vector2 {
    this.y *= -1;

    return this;
  }

  public scale(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }
}
