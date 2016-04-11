import {Injectable} from "angular2/core";

@Injectable()
export class Camera {

    set aspect(inAspect: number) { this.aspect_ = inAspect; };
    
    get vMatrix() {
        // TODO Need to determine how the world should be transformed in relationship to the camera i.e. does the camera zoom or pan?
        mat4.identity(this.vMatrix_);
        return this.vMatrix_;
    };

    get pMatrix() {
        mat4.perspective(this.pMatrix_, this.vFieldOfView_, this.aspect_, 0.1, 10.0);
        return this.pMatrix_;
    };

    private aspect_;

    private pMatrix_: Float32Array = new Float32Array(16);

    private vMatrix_: Float32Array = new Float32Array(16);

    // TODO Should the FoV be adjustable by user?
    private vFieldOfView_: number = 60.0 * Math.PI / 180;
}