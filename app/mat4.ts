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
        let n = 2 / q.length;
        let wx = n * q.w * q.x;
        let wy = n * q.w * q.y;
        let wz = n * q.w * q.z;
        let xx = n * q.x * q.x;
        let yy = n * q.y * q.y;
        let zz = n * q.z * q.z;
        let xy = n * q.x * q.y;
        let xz = n * q.x * q.z;
        let yz = n * q.y * q.z;

        r.array[0] = 1.0 - (yy + zz);
        r.array[1] = xy - wz;
        r.array[2] = xz + wy;

        r.array[4] = xy + wz;
        r.array[5] = 1.0 - (xx + zz);
        r.array[6] = yz - wx;

        r.array[8] = xz - wy;
        r.array[9] = yz + wx;
        r.array[10] = 1.0 - (xx + yy);
        //r.array[12] = v.x;
        //r.array[13] = v.y;
        //r.array[14] = v.z;
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
