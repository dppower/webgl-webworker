import {Vec3} from "./vec3";

export class Quaternion {
    constructor(axis = new Vec3(), angle = 0.0) {
        let phi = angle * Math.PI / 360.0;
        this.v_ = new Vec3();
        Vec3.scale(Math.sin(phi), axis, this.v_);
        this.w_ = Math.cos(phi);     
    };

    get x() {
        return this.v_.x;
    };

    get y() {
        return this.v_.y;
    };

    get z() {
        return this.v_.z;
    };

    get w() {
        return this.w_;
    };

    set w(value: number) {
        this.w_ = value;
    };

    //set x(value: number) {
    //    this.v_.x = value;
    //};

    //set y(value: number) {
    //    this.v_.y = value;
    //};

    //set z(value: number) {
    //    this.v_.z = value;
    //};

    set v(v: Vec3) {
        this.v_.copy(v);
    };

    get v() {
        return this.v_;
    };

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) + Math.pow(this.w, 2));
    };

    conjugate() {
        let c = new Quaternion();
        Vec3.scale(-1.0, this.v_, c.v);
        c.w = this.w_
        return c;
    };

    rotate(v: Vec3) {
        let p = new Quaternion();
        p.w = 0.0;
        p.v = v;

        let r = this.multiply(p).multiply(this.conjugate());
        return r;
    };

    normalise() {
        let factor = 1.0 / this.length;

        Vec3.scale(factor, this.v, this.v);
        this.w *= factor;
    }

    multiply(q: Quaternion) {
        this.normalise();
        q.normalise();
        let r = new Quaternion();
        r.w = this.w * q.w - Vec3.dot(this.v_, q.v);
        let v = new Vec3();
        Vec3.scale(q.w, this.v_, v);
        Vec3.add(r.v, v, r.v);
        Vec3.scale(this.w, q.v, v);
        Vec3.add(r.v, v, r.v);
        Vec3.cross(this.v_, q.v, v);
        Vec3.add(r.v, v, r.v);
        //r.v = this.v.scale(q.w).add(q.v.scale(this.w)).add(this.v.cross(q.v));
        //r.x = (this.x * q.w) + (this.w * q.x) + (this.y * q.z) - (this.z * q.y);
        //r.y = (this.y * q.w) + (this.w * q.y) + (this.z * q.x) - (this.x * q.z);
        //r.z = (this.z * q.w) + (this.w * q.z) + (this.x * q.y) - (this.y * q.x);
        
        return r;

    };

    private w_: number;
    private v_: Vec3;
}