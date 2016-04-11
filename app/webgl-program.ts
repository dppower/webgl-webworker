import {Injectable, OnDestroy} from "angular2/core";
import {WebGLContextService} from "./webgl-context";
import {FragmentShader} from "./fragment-shader";
import {VertexShader} from "./vertex-shader";
import {Camera} from "./game-camera";
import {GameObject} from "./game-object";

@Injectable()
export class WebGLProgramService implements OnDestroy {
    
    constructor(
        private context_: WebGLContextService,
        private fragShader_: FragmentShader,
        private vertShader_: VertexShader,
        private camera_: Camera,
        private cube_: GameObject
    ) { };

    ngOnDestroy() {
        this.context_.get.deleteProgram(this.program_);
    };

    initWebGl() {
        let gl = this.context_.get;
        
        this.initProgram(gl);
        this.cube_.initBuffers(this.context_.get);
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

        this.vUniform_ = gl.getUniformLocation(this.program_, "uView");
        this.pUniform_ = gl.getUniformLocation(this.program_, "uProjection");
        this.mUniform_ = gl.getUniformLocation(this.program_, "uModel");
                
    };

    initVertexArrays(gl: WebGLRenderingContext) {

        let vertexPosition = gl.getAttribLocation(this.program_, "aVertexPosition");
        let vertexColor= gl.getAttribLocation(this.program_, "aVertexColor");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cube_.cubeVerticesBuffer_);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cube_.cubeColorsBuffer_);
        gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(vertexPosition);
        gl.enableVertexAttribArray(vertexColor);
    };

    draw(dt: number, width: number, height: number) {
        let gl = this.context_.get;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Use the viewport to display all of the buffer
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        
        // Aspect depends on the display size of the canvas, not drawing buffer.
        let aspect = width / height;
        this.camera_.aspect = aspect;

        gl.uniformMatrix4fv(this.vUniform_, false, this.camera_.vMatrix);

        gl.uniformMatrix4fv(this.pUniform_, false, this.camera_.pMatrix);

        gl.uniformMatrix4fv(this.mUniform_, false, this.cube_.getmMatrix());

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cube_.cubeIndexBuffer_);

        gl.drawElements(gl.LINES, 36, gl.UNSIGNED_SHORT, 0);

    };

    private vUniform_: WebGLUniformLocation;
    private pUniform_: WebGLUniformLocation;
    private mUniform_: WebGLUniformLocation;

    private program_: WebGLProgram;
}