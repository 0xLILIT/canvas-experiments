import { CircleBody } from "../body.js";
import { CircleBodyOptions } from "../body.js";

export interface ParticleOptions extends CircleBodyOptions {
  particleGroup: string;
}

export class Particle extends CircleBody {
  public particleGroup: string;

  constructor({ particleGroup = "default", ...rest }: ParticleOptions) {
    super(rest);
    this.particleGroup = particleGroup;
  }
}
