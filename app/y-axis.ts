import {Injectable} from "angular2/core";
import {Transform} from "./object-transform";

@Injectable()
export class YAxis {
    vertexBuffer_: WebGLBuffer;
    indexBuffer_: WebGLBuffer;
    colour:Float32Array = new Float32Array([0.0, 1.0, 0.0, 1.0]);

    constructor() { };

    init(gl: WebGLRenderingContext) {
        this.vertexBuffer_ = gl.createBuffer();

        let vertices: number[] = [];
        for (let i = 0; i < 20; i++) {
            vertices.push(0.0);
            vertices.push((i / 10.0) - 1.0);
            vertices.push(0.0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer_);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.indexBuffer_ = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer_);

        let indices = [];
        for (let i = 0; i < 20; i++) {
            indices.push(i);
            indices.push(i + 1);
        };

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    };

    draw(gl: WebGLRenderingContext, uColour: WebGLUniformLocation, positionAttrib: number) {

        gl.lineWidth(5);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer_);

        gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);

        gl.uniform4fv(uColour, this.colour);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer_);

        gl.drawElements(gl.LINES, 38, gl.UNSIGNED_SHORT, 0);

    };
};