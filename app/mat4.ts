import {Vec3} from "./vec3";
import {Quaternion} from "./quaternion";

export class Mat4 {

    constructor() {
        this.matrix_ = new Float32Array(16);
        this.identity();
    };

    get array() {
        return this.matrix_;
    };

    identity() {
        this.matrix_[0] = 1.0;
        this.matrix_[1] = 0;
        this.matrix_[2] = 0;
        this.matrix_[3] = 0;
        this.matrix_[4] = 0;
        this.matrix_[5] = 1.0;
        this.matrix_[6] = 0;
        this.matrix_[7] = 0;
        this.matrix_[8] = 0;
        this.matrix_[9] = 0;
        this.matrix_[10] = 1.0;
        this.matrix_[11] = 0;
        this.matrix_[12] = 0;
        this.matrix_[13] = 0;
        this.matrix_[14] = 0;
        this.matrix_[15] = 1.0;
    };

    static multiply(a: Mat4, b: Mat4, out: Mat4) {
        
        let a11 = a.array[0], a12 = a.array[1], a13 = a.array[2], a14 = a.array[3],
            a21 = a.array[4], a22 = a.array[5], a23 = a.array[6], a24 = a.array[7],
            a31 = a.array[8], a32 = a.array[9], a33 = a.array[10], a34 = a.array[11],
            a41 = a.array[12], a42 = a.array[13], a43 = a.array[14], a44 = a.array[15];

        for (let i = 0; i < 16; i += 4) {
            let b1 = b.array[i], b2 = b.array[i + 1], b3 = b.array[i + 2], b4 = b.array[i + 3];
            out.array[i] = b1 * a11 + b2 * a21 + b3 * a31 + b4 * a41;
            out.array[i + 1] = b1 * a12 + b2 * a22 + b3 * a32 + b4 * a42;
            out.array[i + 2] = b1 * a13 + b2 * a23 + b3 * a33 + b4 * a43;
            out.array[i + 3] = b1 * a14 + b2 * a24 + b3 * a34 + b4 * a44;
        }
    };

    rotate(q: Quaternion, angle: number) {
        let r = new Mat4();
        //q.normalise();
        //const n = 2.0;
        //let wx = n * q.w * q.x;
        //let wy = n * q.w * q.y;
        //let wz = n * q.w * q.z;
        //let xx = n * q.x * q.x;
        //let yy = n * q.y * q.y;
        //let zz = n * q.z * q.z;
        //let xy = n * q.x * q.y;
        //let xz = n * q.x * q.z;
        //let yz = n * q.y * q.z;

        //r.array[0] = 1.0 - (yy + zz);
        //r.array[4] = xy - wz;
        //r.array[8] = xz + wy;

        //r.array[1] = xy + wz;
        //r.array[5] = 1.0 - (xx + zz);
        //r.array[9] = yz - wx;

        //r.array[2] = xz - wy;
        //r.array[6] = yz + wx;
        //r.array[10] = 1.0 - (xx + yy);

        let s = Math.sin(angle);
        let c = Math.cos(angle);
        r.array[0] = c;
        r.array[2] = s;
        r.array[8] = -1.0 * s;
        r.array[10] = c;
        
        Mat4.multiply(this, r, this);
    };

    scale(v: Vec3) {
        let s = new Mat4();
        s.array[0] = v.x;
        s.array[5] = v.y;
        s.array[10] = v.z;

        Mat4.multiply(this, s, this);
    };

    translate(v: Vec3) {
        let t = new Mat4();
        t.array[12] = v.x;
        t.array[13] = v.y;
        t.array[14] = v.z;
        
        Mat4.multiply(this, t, this);
    };

    private matrix_: Float32Array;
};
