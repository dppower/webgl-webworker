import {Injectable} from "angular2/core";
import {WebGLContextService} from "./webgl-context";
import {FragmentShader} from "./fragment-shader";
import {VertexShader} from "./vertex-shader";
import {Camera} from "./game-camera";

@Injectable()
export class WebGLProgramService {
    
    constructor(
        private context_: WebGLContextService,
        private fragShader_: FragmentShader,
        private vertShader_: VertexShader
    ) { };

    initWebGl() {
        let gl = this.context_.get;
        
        this.initProgram(gl);
        this.initVertexArrays(gl);
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };

    initProgram(gl: WebGLRenderingContext) {
        let vertShader = this.vertShader_.getShader();
        let fragShader = this.fragShader_.getShader();

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

        this.uAxisColour_ = gl.getUniformLocation(this.program_, "uAxisColour");
        this.uView_ = gl.getUniformLocation(this.program_, "uView");
        this.uProjection_ = gl.getUniformLocation(this.program_, "uProjection");
        this.uModel_ = gl.getUniformLocation(this.program_, "uModel");
                
    };

    initVertexArrays(gl: WebGLRenderingContext) {
        this.aVertexPosition_ = gl.getAttribLocation(this.program_, "aVertexPosition");
        gl.enableVertexAttribArray(this.aVertexPosition_);
    };

    get aVertexPosition() { return this.aVertexPosition_; };
    get uAxisColour() { return this.uAxisColour_; };
    get uView() { return this.uView_; };
    get uProjection() { return this.uProjection_; };
    get uModel() { return this.uModel_; };

    private aVertexPosition_: number;
    private uAxisColour_: WebGLUniformLocation;
    private uView_: WebGLUniformLocation;
    private uProjection_: WebGLUniformLocation;
    private uModel_: WebGLUniformLocation;

    private program_: WebGLProgram;
}