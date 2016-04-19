export class Vec3 {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.vector_ = new Float32Array([x, y, z]);
    };

    get x() { return this.vector_[0]; };

    get y() { return this.vector_[1]; };

    get z() { return this.vector_[2]; };

    set x(value: number) { this.vector_[0] = value; };

    set y(value: number) { this.vector_[1] = value; };

    set z(value: number) { this.vector_[2] = value; };

    get array() { return this.vector_; };

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.y, 2));
    };

    dot(v: Vec3) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    cross(a: Vec3) {
        let b = new Vec3();
        b.x = (this.y * a.z) - (this.z * a.y);
        b.y = (this.z * a.x) - (this.x * a.z);
        b.z = (this.x * a.y) - (this.y * a.x);
        return b;
    };

    normalise() {
        let factor;
        let length = this.length;
        if (length <= 0.0) {
            factor = 1.0 / length;
        } else {
            factor = 1.0;
        }
        let u = this.scale(factor);
        this.copy(u);
    };

    add(v: Vec3) {
        let s = new Vec3();
        s.copy(this);
        s.x += v.x;
        s.y += v.y;
        s.z += v.z;
        return s;
    };

    subtract(v: Vec3) {
        let s = new Vec3();
        s.copy(this);
        s.x -= v.x;
        s.y -= v.y;
        s.z -= v.z;
        return s;
    };

    scale(scalar: number) {
        let v = new Vec3();
        v.copy(this);
        v.x *= scalar;
        v.y *= scalar;
        v.z *= scalar;
        return v;
    };

    copy(vec: Vec3) {
        let array = vec.array;
        for (let i in this.vector_) {
            this.vector_[i] = array[i];
        }
    };

    private vector_: Float32Array;
};