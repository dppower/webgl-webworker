import {Injectable} from "angular2/core";
import {WebGLContextService} from "./webgl-context";

@Injectable()
export class FragmentShader {
    constructor(private gl_: WebGLContextService) { };

    getShader() {
        let gl = this.gl_.context;
        this.shader_ = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.shader_, this.source_);
        gl.compileShader(this.shader_);

        if (!gl.getShaderParameter(this.shader_, gl.COMPILE_STATUS)) {
            console.log("Fragment shader compilation error: " + gl.getShaderInfoLog(this.shader_));
            return null;
        }
        return this.shader_; 
    };

    private source_: string = `
    precision mediump float;
    
    varying vec2 vTextureCoordinates;
    uniform sampler2D uTexture;

    void main(void) {
        gl_FragColor = texture2D(uTexture, vTextureCoordinates);
    }
    `;

    private shader_: WebGLShader;
}