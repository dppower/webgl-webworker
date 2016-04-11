export class Vec3 {

    constructor(x: number, y: number, z: number) {
        this.vector_ = new Float32Array([x, y, z]);
    };

    get x() {
        return this.vector_[0];
    };

    get y() {
        return this.vector_[1];
    }

    get z() {
        return this.vector_[2];
    };

    set copy(vec: Vec3) {
        for (let i in vec) {
            this.vector_[i] = vec[i]
        }
    };
      
    private vector_: Float32Array;
};

export class Mat4 {

    constructor() {
        this.matrix_ = new Float32Array(16);
        this.identity();
    };

    identity() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; i < 4; i++) {
                this.matrix_[4 * i + j] = (j == i) ? 1 : 0;
            }
        }
    };

    rotate() { };

    scale(vec: Vec3) {
        this.identity();
        this.matrix_[0] = vec.x;
        this.matrix_[5] = vec.y;
        this.matrix_[10] = vec.z;
    };

    translate(vec: Vec3) {
        this.identity();
        this.matrix_[12] = vec.x;
        this.matrix_[13] = vec.y;
        this.matrix_[14] = vec.z;
    };

    private matrix_: Float32Array;
};

export class Quaternion {
    constructor(axis: Vec3, angle: number) {
        this.x = axis.x * Math.sin(angle / 2);
        this.y = axis.y * Math.sin(angle / 2);
        this.z = axis.z * Math.sin(angle / 2);
        this.w = Math.cos(angle / 2)
    };

    x: number;
    y: number;
    z: number;
    w: number;    
}


export class Transform {

    scale(vec: Vec3) {
        let mat = new Mat4();
        mat.scale(vec);
        return mat;
    };

    translate(vec: Vec3) {
        let mat = new Mat4();
        mat.translate(vec);
        return mat;
    };

    rotate(vec: Vec3, angle: number) {
        let mat = new Mat4();
        return mat;
    };

    constructor(
        position = new Vec3(0, 0, 0),
        scale = new Vec3(1, 1, 1),
        rotation = new Quaternion(new Vec3(0, 0, 0), 0)
    ) { };
    
    private position_: Vec3;

    private scale_: Vec3;

    private rotation_: Quaternion;
};