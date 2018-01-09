import { Transform } from "./transform";
import { InputState } from "./input-state";
import { Vec3 } from "./vec3";

export class GameObject {
    isActive = true;

    constructor(private transform_: Transform) { };

    update(dt: number, inputs: InputState) {
        if (inputs.left) {
            let dx = 0.005 * dt * inputs.delta.x;
            this.transform_.rotate(new Vec3(0.0, 0.0, 1.0), dx);
        }
        return this.transform_.transform;
    };

    markInactive() {
        this.isActive = false;
    };
};