import { Injectable } from "@angular/core";
import { RenderContext } from "./webgl-context";
import { FragmentShader } from "./fragment-shader";
import { VertexShader } from "./vertex-shader";

@Injectable()
export class ShaderProgram {
    
    constructor(
        private gl_: RenderContext,
        private fragment_shader_: FragmentShader,
        private vertex_shader_: VertexShader
    ) { };

    initWebGl() {
        let gl = this.gl_.context;
        
        this.initProgram(gl);
        this.initVertexArrays(gl);
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };

    initProgram(gl: WebGLRenderingContext) {
        let vertShader = this.vertex_shader_.getShader(gl);
        let fragShader = this.fragment_shader_.getShader(gl);

        this.program_ = gl.createProgram();
        gl.attachShader(this.program_, vertShader);
        gl.attachShader(this.program_, fragShader);
        gl.linkProgram(this.program_);

        if (!gl.getProgramParameter(this.program_, gl.LINK_STATUS)) {
            gl.deleteProgram(this.program_);

            gl.deleteShader(vertShader);
            gl.deleteShader(fragShader);

            alert("Unable to initialize the shader program."); 
        }

        gl.detachShader(this.program_, vertShader);
        gl.detachShader(this.program_, fragShader);

        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);

        gl.useProgram(this.program_);
        
        this.uView_ = gl.getUniformLocation(this.program_, "uView");
        this.uProjection_ = gl.getUniformLocation(this.program_, "uProjection");
        this.uTransform_ = gl.getUniformLocation(this.program_, "uTransform");
        this.uSampler_ = gl.getUniformLocation(this.program_, "uSampler");             
    };

    initVertexArrays(gl: WebGLRenderingContext) {
        this.aVertexPosition_ = gl.getAttribLocation(this.program_, "aVertexPosition");
        gl.enableVertexAttribArray(this.aVertexPosition_);

        this.aNormals_ = gl.getAttribLocation(this.program_, "aNormals");
        gl.enableVertexAttribArray(this.aNormals_);
    };

    get aVertexPosition() { return this.aVertexPosition_; };
    get aNormals() { return this.aNormals_; };

    get uView() { return this.uView_; };
    get uProjection() { return this.uProjection_; };
    get uTransform() { return this.uTransform_; };;
    get uSampler() { return this.uSampler_; };;

    private aVertexPosition_: number;
    private aNormals_: number;

    private uView_: WebGLUniformLocation;
    private uProjection_: WebGLUniformLocation;
    private uTransform_: WebGLUniformLocation;
    private uSampler_: WebGLUniformLocation;

    private program_: WebGLProgram;
}