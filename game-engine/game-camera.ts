import {Transform} from "./transform";
import {Vec3} from "./vec3";

export class Camera {

    minZoom: number = -3.0;
    maxZoom: number = -4.0;
    zoomSpeed: number = 0.2;

    constructor() {
        let transform = new Vec3(0.0, 0.0, -3.5);
        this.transform_.translate(transform);
        this.vMatrix_ = this.transform_.transform;
    };
    
    get view() {
        return this.vMatrix_;
    };

    get projection() {
        this.calculateFrustrum();
        return this.pMatrix_;
    };
    
    update(direction: number, aspect: number) {
        let zoom = direction * this.zoomSpeed;
        let currentPosition = this.vMatrix_[14];

        zoom = (zoom + currentPosition <= this.minZoom) ? 0.0 : ((zoom + currentPosition >= this.maxZoom) ? 0.0 : zoom);

        let transform = new Vec3(0.0, 0.0, zoom);
        this.transform_.translate(transform);
        this.vMatrix_ = this.transform_.transform;

        this.aspect_ = aspect;
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

    private near_ = 0.1;
    private far_ = 1000.0;

    private pMatrix_: Float32Array = new Float32Array(16);

    private vMatrix_: Float32Array = new Float32Array(16);

    // TODO Should the FoV be adjustable by user?
    private vFieldOfView_: number = 60.0 * Math.PI / 180;

    private transform_: Transform = new Transform();
}