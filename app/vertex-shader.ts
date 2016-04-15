import {Injectable} from "angular2/core";
import {WebGLContextService} from "./webgl-context";

@Injectable()
export class VertexShader {
    constructor(private context_: WebGLContextService) { };

    getShader() {
        let gl = this.context_.get;
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
    
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat4 uTransform;

    void main(void) {
        gl_Position = uProjection * uView * uTransform * vec4(aVertexPosition, 1.0);
    }
    `;

    private shader_: WebGLShader;
}