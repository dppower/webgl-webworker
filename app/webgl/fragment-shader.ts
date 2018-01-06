import { Injectable } from "@angular/core";

@Injectable()
export class FragmentShader {
    constructor() { };

    getShader(gl: WebGLRenderingContext) {
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
    
    const float PI = 3.14159265358979323846;
    const vec4 ambient = vec4(0.1, 0.1, 0.1, 1.0);
    // A single fixed light position
    const vec3 light_position = vec3(1.0, 1.0, 1.0);
    varying vec3 vVertexPosition;
    varying vec3 vNormal;

    //varying vec2 vTextureCoordinates;
    //uniform sampler2D uTexture;

    void main(void) {
        vec3 n = normalize(vNormal);
        vec3 l = normalize(light_position - vVertexPosition);
        // Since camera is at (0, 0, 0), can just negate the vertex position for view vector
        vec3 v = -vVertexPosition;
        vec3 h = normalize(l + v);

        //vec4 c = texture2D(uTexture, vTextureCoordinates);
        vec4 c = vec4(0.898, 0.815, 0.482, 1.0);
        float NdotL = clamp(dot(n, l), 0.0, 1.0);
        gl_FragColor = c * ambient + vec4(c.xyz * NdotL, 1.0);
    }
    `;

    private shader_: WebGLShader;
}