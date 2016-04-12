import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy} from "angular2/core";
import {WebGLContextService} from "./webgl-context";
import {WebGLProgramService} from "./webgl-program";
import {FragmentShader} from "./fragment-shader";
import {VertexShader} from "./vertex-shader";
import {Camera} from "./game-camera";
import {XAxis} from "./x-axis";
import {YAxis} from "./y-axis";
import {ZAxis} from "./z-axis";

@Component({
    selector: 'resizable-canvas',
    template: `
    <canvas id="canvas" 
        #canvas 
        [width]="getCanvasWidth()" 
        [height]="getCanvasHeight()" 
        [style.width]="canvasWidth" 
        [style.height]="canvasHeight" 
        [style.top]="canvasTop" 
        [style.left]="canvasLeft">
        <p>
            {{fallbackText}}
        </p>
    </canvas>
    `,
    styles: [`
    #canvas {
        position: absolute;
        z-index: 0;
    }
    `],
    providers: [WebGLContextService, WebGLProgramService, FragmentShader, VertexShader, Camera, XAxis, YAxis, ZAxis]
})
export class ResizableCanvasComponent implements OnDestroy {
    @ViewChild("canvas") canvasRef: ElementRef;
    
    fallbackText: string = "Loading Canvas...";

    // TODO If the client could change resolution, the binding to canvas height and width (dimensions of drawing buffer),
    // would be different to the style.height and style.width of the canvas.
    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    mouse_dx: number = 0;
    mouse_dy: number = 0;
    zoom: number = -2.0;

    cancelToken: number;
    
        
    constructor(private context_: WebGLContextService, private program_: WebGLProgramService, private camera_: Camera,
        private xaxis_: XAxis,
        private yaxis_: YAxis,
        private zaxis_: ZAxis
    ) { };
    
    getCanvasWidth() {
        let width = this.canvasWidth > 1920 ? 1920 : this.canvasWidth;
        return width;
    };

    getCanvasHeight() {
        let height = this.canvasHeight > 1080 ? 1080 : this.canvasHeight;
        return height;
    };

    ngAfterViewInit() {
        let gl = this.context_.create(this.canvasRef.nativeElement);
        
        if (gl) {
            this.program_.initWebGl();
            this.xaxis_.init(gl);
            this.yaxis_.init(gl);
            this.zaxis_.init(gl);
            this.cancelToken = requestAnimationFrame(() => {
                this.tick();
            });
        }
        else {
            setTimeout(() => {
                this.fallbackText = "Unable to initialise WebGL."
            }, 0);
        }
    }

    tick() {
        let timeNow = window.performance.now();
        this.dt_ += (timeNow - this.previousTime_); 
        while (this.dt_ >= this.timeStep_) {
            this.dt_ -= this.timeStep_;
        }
        this.camera_.update(this.zoom);
        this.update(this.mouse_dx, this.mouse_dy);
        this.draw(this.dt_, this.canvasWidth, this.canvasHeight);
        this.previousTime_ = timeNow;
        requestAnimationFrame(() => {
            this.tick();
        });
    };

    update(mouse_dx: number, mouse_dy: number) {
        mat4.identity(this.modelMatrix);
        mat4.rotateX(this.modelMatrix, this.modelMatrix, mouse_dx * Math.PI / 180);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, mouse_dy * Math.PI / 180);
    };

    draw(dt: number, width: number, height: number) {
        let gl = this.context_.get;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Use the viewport to display all of the buffer
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        
        // Aspect depends on the display size of the canvas, not drawing buffer.
        let aspect = width / height;
        this.camera_.aspect = aspect;

        gl.uniformMatrix4fv(this.program_.uView, false, this.camera_.view);

        gl.uniformMatrix4fv(this.program_.uProjection, false, this.camera_.projection);

        gl.uniformMatrix4fv(this.program_.uModel, false, this.modelMatrix);

        this.xaxis_.draw(gl, this.program_.uAxisColour, this.program_.aVertexPosition);
        this.yaxis_.draw(gl, this.program_.uAxisColour, this.program_.aVertexPosition);
        this.zaxis_.draw(gl, this.program_.uAxisColour, this.program_.aVertexPosition);
    };

    private modelMatrix: Float32Array = new Float32Array(16);

    ngOnDestroy() {
        //this.context_.get.deleteProgram(this.program_.get);
        cancelAnimationFrame(this.cancelToken);
    }

    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;
}