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
        let factor = 1.0 / this.length;
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

export class Mat4 {

    constructor() {
        this.matrix_ = new Float32Array(16);
        this.identity();
    };

    get array() {
        return this.matrix_;
    };

    identity() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.matrix_[4 * i + j] = (j == i) ? 1 : 0;
            }
        }
    };

    multiply(m: Mat4) {
        let m1 = this.array;
        let m2 = m.array;

        for (let i = 0; i < 16; i += 4) {
            for (let j = 0; j < 4; j++) {
                this.matrix_[i + j] = m1[i] * m2[j] + m1[i + 1] * m2[j + 4] + m1[i + 2] * m2[j + 8] + m1[i + 3] * m2[j + 12];
            };
        }
    };

    rotate(q: Quaternion) {
        let r = new Mat4();
        r.array[0] = 1.0 - 2.0 * (q.y * q.y + q.z * q.z);
        r.array[1] = 2.0 * (q.x * q.y - q.z * q.w);
        r.array[2] = 2.0 * (q.x * q.z + q.y * q.w);

        r.array[4] = 2.0 * (q.x * q.y + q.z * q.w);
        r.array[5] = 1.0 - 2.0 * (q.x * q.x + q.z * q.z);
        r.array[6] = 2.0 * (q.y * q.z - q.x * q.w);

        r.array[8] = 2.0 * (q.x * q.z - q.y * q.w);
        r.array[9] = 2.0 * (q.y * q.z + q.x * q.w);
        r.array[10] = 1.0 - 2.0 * (q.x * q.x + q.y * q.y);
        this.multiply(r);
    };

    scale(v: Vec3) {
        let s = new Mat4();
        s.array[0] = v.x;
        s.array[5] = v.y;
        s.array[10] = v.z;
        this.multiply(s);
    };

    translate(v: Vec3) {
        let t = new Mat4();
        t.array[12] = v.x;
        t.array[13] = v.y;
        t.array[14] = v.z;
        this.multiply(t)
    };

    private matrix_: Float32Array;
};

export class Quaternion {
    constructor(axis = new Vec3(), angle = 0.0) {
        let phi = angle * Math.PI / 360;
        this.v_ = new Vec3();
        this.v_.copy(axis);
        this.v_.scale(Math.sin(phi));
        this.w_ = Math.cos(phi)
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

    get v() {
        return this.v_;
    };

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.y, 2) + Math.pow(this.w, 2));
    };

    multiply(q: Quaternion) {
        let r = new Quaternion();
        r.w = (this.w * q.w - this.v_.dot(q.v));
        let v = new Vec3();
        v.x = (this.x * q.w) + (this.w * q.x) + (this.z * q.y) - (this.y * q.z);
        v.y = (this.y * q.w) - (this.z * q.x) + (this.w * q.y) + (this.x * q.z);
        v.z = (this.z * q.w) + (this.y * q.x) - (this.x * q.y) + (this.w * q.z);
        r.v.copy(v);
        let factor = 1.0 / r.length;
        r.v.scale(factor);
        r.w *= factor;
        return r;
        
    };

    private w_: number;
    private v_: Vec3;  
}


export class Transform {

    get transform() {
        this.matrix_.identity();
        this.matrix_.translate(this.position_);
        let rotation = this.rotation_.multiply(this.orientation_);
        this.matrix_.rotate(rotation);
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

    setOrientation(vec: Vec3, angle: number) {
        let q = new Quaternion(vec, angle);
        this.orientation_ = q;
        
    };

    setRotation(vec: Vec3, angle: number) {
        let q = new Quaternion(vec, angle);
        this.rotation_ = q;

    };

    constructor(
        public position_ = new Vec3(),
        public scale_ = new Vec3(1.0, 1.0, 1.0),
        public orientation_ = new Quaternion(),
        private rotation_ = new Quaternion()
    ) { };

    private matrix_ = new Mat4();
};