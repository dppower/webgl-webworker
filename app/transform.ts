import {Vec3} from "./vec3";
import {Quaternion} from "./quaternion";
import {Mat4} from "./mat4";

export class Transform {

    get transform() {
        this.matrix_.identity();
        this.matrix_.translate(this.position_);
        this.matrix_.rotate(this.orientation_);
        this.matrix_.scale(this.scale_); 
        return this.matrix_.array;
    };

    scale(v: Vec3) {
        this.scale_.copy(v);   
    };

    translate(v: Vec3) {
        let a = this.position_.add(v);
        this.position_.copy(a);
        
    };
    
    addRotation(vec: Vec3, angle: number) {
        let q = new Quaternion(vec, angle);
        let r = this.orientation_.multiply(q);
        this.orientation_ = r;
    };

    constructor(
        public position_ = new Vec3(),
        public scale_ = new Vec3(1.0, 1.0, 1.0),
        private orientation_ = new Quaternion()
    ) { };

    private matrix_ = new Mat4();
};