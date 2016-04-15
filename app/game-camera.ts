import {Injectable} from "angular2/core";
import {Transform, Vec3, Mat4} from "./transform";

@Injectable()
export class Camera {

    initialZoom: number = -2.0;
    maxZoom: number = -4.0;
    zoomSpeed: number = 0.4;

    constructor() {
        let transform = new Vec3(0.0, 0.0, this.initialZoom);
        this.transform_.translate(transform);
        this.vMatrix_ = this.transform_.transform;
    };

    set aspect(aspect: number) { this.aspect_ = aspect; };
    
    get view() {
        return this.vMatrix_;
    };

    get projection() {
        mat4.perspective(this.pMatrix_, this.vFieldOfView_, this.aspect_, 0.1, 100.0);
        return this.pMatrix_;
    };
    
    update(direction: string) {
        let zoom;
        let z_position = this.vMatrix_[14];
        if (direction == "in") {
            zoom = (z_position + this.zoomSpeed >= this.initialZoom) ? 0.0 : this.zoomSpeed;
        } else {
            zoom = (z_position - this.zoomSpeed <= this.maxZoom) ? 0.0 : -this.zoomSpeed;
        };
        let transform = new Vec3(0.0, 0.0, zoom);
        this.transform_.translate(transform);
        this.vMatrix_ = this.transform_.transform;
    };

    private aspect_;

    private pMatrix_: Float32Array = new Float32Array(16);

    private vMatrix_: Float32Array = new Float32Array(16);

    // TODO Should the FoV be adjustable by user?
    private vFieldOfView_: number = 45.0; //* Math.PI / 180;

    private transform_: Transform = new Transform();
}