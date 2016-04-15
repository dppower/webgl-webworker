import {MeshLoader} from "./mesh-loader";
import {WebGLProgramService} from "./webgl-program";
import {Transform} from "./transform";

class Mesh {
    vertices: Float32Array;
    indices: Uint16Array;
}

export class GameObject {
    vertexBuffer_: WebGLBuffer;
    indexBuffer_: WebGLBuffer;
    mesh_: Mesh = new Mesh();
    private meshLoaded_: boolean = false;

    constructor(
        public transform_: Transform,
        private meshFile_: string,
        public colour_ = new Float32Array([1.0, 1.0, 1.0, 1.0]),
        private meshLoader_: MeshLoader
    ) { };

    init(gl: WebGLRenderingContext) {
        this.meshLoader_.loadMesh(this.meshFile_).subscribe(data => {
            this.mesh_.vertices = new Float32Array(data.vertices);
            this.mesh_.indices = new Uint16Array(data.indices);
            this.initBuffers(gl);
        });       
    };

    private initBuffers(gl: WebGLRenderingContext) {
        this.vertexBuffer_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer_);
        gl.bufferData(gl.ARRAY_BUFFER, this.mesh_.vertices, gl.STATIC_DRAW);

        this.indexBuffer_ = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer_);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.mesh_.indices, gl.STATIC_DRAW);
        this.meshLoaded_ = true
    };

    draw(gl: WebGLRenderingContext, program: WebGLProgramService) {

        if (this.meshLoaded_ == false) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer_);

        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.uniform4fv(program.uAxisColour, this.colour_);

        gl.uniformMatrix4fv(program.uTransform, false, this.transform_.transform);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer_);

        gl.drawElements(gl.LINES, 40, gl.UNSIGNED_SHORT, 0);

    };
};