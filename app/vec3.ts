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
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    };

    static dot(a: Vec3, b: Vec3) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    };

    static cross(a: Vec3, b: Vec3, out: Vec3) {
        out.x = (a.y * b.z) - (a.z * b.y);
        out.y = (a.z * b.x) - (a.x * b.z);
        out.z = (a.x * b.y) - (a.y * b.x);
    };

    normalise() {
        let length = this.length;
        if (length > 0) {
            let factor = 1.0 / length;
            Vec3.scale(factor, this, this);
        }    
    };

    static add(a: Vec3, b: Vec3, out: Vec3) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
    };

    static subtract(a: Vec3, b: Vec3, out: Vec3) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
    };

    static scale(s: number, a: Vec3, out: Vec3) {
        out.x = a.x * s;
        out.y = a.y * s;
        out.z = a.z * s;
    };

    copy(a: Vec3) {
        for (let i in this.vector_) {
            this.vector_[i] = a.array[i];
        }
    };

    private vector_: Float32Array;
};