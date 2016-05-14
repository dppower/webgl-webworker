
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
    
    varying vec2 vTextureCoordinates;
    uniform sampler2D uTexture;

    void main(void) {
        //gl_FragColor = texture2D(uTexture, vTextureCoordinates);
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }
    `;

    private shader_: WebGLShader;
}