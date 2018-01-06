import { Injectable } from "@angular/core";

@Injectable()
export class VertexShader {
    constructor() { };

    getShader(gl: WebGLRenderingContext) {
        this.shader_ = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.shader_, this.source_);
        gl.compileShader(this.shader_);

        if (!gl.getShaderParameter(this.shader_, gl.COMPILE_STATUS)) {
            console.log("Vertex shader compilation error: " + gl.getShaderInfoLog(this.shader_));
            return null;
        }
        return this.shader_;
    };

    private source_: string = `
    attribute vec3 aVertexPosition;
    attribute vec3 aNormal;
    //attribute vec2 aTextureCoordinates;
    
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat4 uTransform;
    
    //varying vec2 vTextureCoordinates;
    varying vec3 vNormal;
    varying vec3 vVertexPosition;

    void main(void) {       
        vec4 mv_position = uView * uTransform * vec4(aVertexPosition, 1.0);
        gl_Position = uProjection * mv_position;
        //vTextureCoordinates = aTextureCoordinates;
        vVertexPosition = vec3(mv_position);
        // Caution this should be changed to a distinct normal_mat = transpose(inverse(M * V)) when scaling is non-uniform
        vNormal = vec3(uView * uTransform * vec4(aNormal, 0.0));
    }
    `;

    private shader_: WebGLShader;
}