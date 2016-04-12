import {Injectable} from "angular2/core";
import {Transform, Vec3} from "./object-transform";

@Injectable()
export class Camera {

    set aspect(aspect: number) { this.aspect_ = aspect; };
    
    get view() {
        return this.vMatrix_;
    };

    get projection() {
        mat4.perspective(this.pMatrix_, this.vFieldOfView_, this.aspect_, 0.1, 50.0);
        return this.pMatrix_;
    };

    update(zoom: number) {
        zoom = (zoom > -1.0) ? -1.0 : ((zoom < -5.0) ? -5.0 : zoom);
        //console.log(zoom);
        this.transform_.position = new Vec3(0.0, 0.0, zoom);
        this.vMatrix_ = this.transform_.translate().array;
        //console.log(this.vMatrix_); 
    };

    private aspect_;

    private pMatrix_: Float32Array = new Float32Array(16);

    private vMatrix_: Float32Array = new Float32Array(16);

    // TODO Should the FoV be adjustable by user?
    private vFieldOfView_: number = 60.0 * Math.PI / 180;

    private transform_: Transform = new Transform();
}