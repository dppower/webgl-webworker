import {Injectable} from "angular2/core";
import {Transform} from "./transform";
import {Vec3} from "./vec3";

@Injectable()
export class Camera {

    initialZoom: number = -2.0;
    maxZoom: number = -5.0;
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
        this.calculateFrustrum();
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

    calculateFrustrum() {
        let f = Math.tan(0.5 * (Math.PI - this.vFieldOfView_));
        let depth = 1.0 / (this.near_ - this.far_);

        this.pMatrix_[0] = f / this.aspect_;
        this.pMatrix_[5] = f;
        this.pMatrix_[10] = (this.near_ + this.far_) * depth;
        this.pMatrix_[11] = -1.0;
        this.pMatrix_[14] = 2.0 * (this.near_ * this.far_) * depth;
        
    };

    private aspect_;

    private near_ = 1.0;
    private far_ = 50.0;

    private pMatrix_: Float32Array = new Float32Array(16);

    private vMatrix_: Float32Array = new Float32Array(16);

    // TODO Should the FoV be adjustable by user?
    private vFieldOfView_: number = 60.0 * Math.PI / 180;

    private transform_: Transform = new Transform();
}