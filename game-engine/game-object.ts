import { Transform } from "./transform";

export class GameObject {
    isActive = true;

    constructor(private transform_: Transform) { };

    update(dt: number) {
        return this.transform_.transform;
    };

    markInactive() {
        this.isActive = false;
    };
};