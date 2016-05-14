
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
    attribute vec3 aNormals;
    attribute vec2 aTextureCoordinates;
    
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform mat4 uTransform;
    
    varying vec2 vTextureCoordinates;
    varying vec3 vNormals;

    void main(void) {
        
        gl_Position = uProjection * uView * uTransform * vec4(aVertexPosition, 1.0);
        vTextureCoordinates = aTextureCoordinates;
        vNormals = aNormals;
    }
    `;

    private shader_: WebGLShader;
}