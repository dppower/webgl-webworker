import {Vec3} from "./vec3";
import {Quaternion} from "./quaternion";
import {Mat4} from "./mat4";

export class Transform {

    get transform() {
        this.transform_.identity();
        this.transform_.rotate(this.orientation_);
        this.transform_.translate(this.position_);
        this.transform_.scale(this.scale_);
        return this.transform_.array;

    };

    scale(v: Vec3) {
        this.scale_.copy(v);   
    };

    translate(v: Vec3) {
        Vec3.add(this.position_, v, this.position_);
    };
    
    rotate(vec: Vec3, angle: number) {
        let q = new Quaternion(vec, angle);
        let r = this.orientation_.multiply(q);
        this.orientation_ = r;
    };

    constructor(
        public position_ = new Vec3(),
        public scale_ = new Vec3(1.0, 1.0, 1.0),
        private orientation_ = new Quaternion()
    ) { };

    private transform_ = new Mat4();
};