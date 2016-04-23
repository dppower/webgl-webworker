import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, provide, Inject} from "angular2/core";
import {WebGLContextService} from "./webgl-context";
import {WebGLProgramService} from "./webgl-program";
import {FragmentShader} from "./fragment-shader";
import {VertexShader} from "./vertex-shader";
import {Camera} from "./game-camera";
import {Transform} from "./transform";
import {Vec3} from "./vec3";
import {MeshLoader} from "./mesh-loader";
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
        border: none;
        position: absolute;
        z-index: 0;
    }
    `],
    providers: [WebGLContextService, WebGLProgramService, FragmentShader, VertexShader, Camera, MeshLoader, XAxis, YAxis, ZAxis, provide("axis-transform", { useValue: new Transform() })]
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

    cancelToken: number;
    
    constructor(private context_: WebGLContextService, private program_: WebGLProgramService, private camera_: Camera,
        private xaxis_: XAxis,
        private yaxis_: YAxis,
        private zaxis_: ZAxis,
        @Inject("axis-transform") private axisTransform_: Transform
    ) { };
    
    updateCameraZoom(direction: string) {
        this.camera_.update(direction);
    };

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
            this.axisTransform_.rotate(new Vec3(1.0, 0.0, 0.0), 45.0);

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
            this.update(this.timeStep_, this.mouse_dx, this.mouse_dy);
            this.dt_ -= this.timeStep_;
        }
        this.draw(this.dt_);
        this.previousTime_ = timeNow;
        requestAnimationFrame(() => {
            this.tick();
        });
    };

    update(dt: number, mouse_dx: number, mouse_dy: number) {
        //let dx = 0.005 * dt * mouse_dx;
        //let dy = -0.005 * dt * mouse_dy;

        //this.axisTransform_.addRotation(new Vec3(1.0, 0.0, 0.0), dy);
        //this.axisTransform_.addRotation(new Vec3(0.0, 1.0, 0.0), dx);
        let angle = 0.1 * dt;
        this.axisTransform_.rotate(new Vec3(0.0, 1.0, 0.0), angle);
        
    };

    draw(dt: number) {
        let gl = this.context_.get;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Use the viewport to display all of the buffer
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        
        // Aspect depends on the display size of the canvas, not drawing buffer.
        let aspect = this.canvasWidth / this.canvasHeight;
        this.camera_.aspect = aspect;

        gl.uniformMatrix4fv(this.program_.uView, false, this.camera_.view);

        gl.uniformMatrix4fv(this.program_.uProjection, false, this.camera_.projection);

        this.xaxis_.draw(gl, this.program_);
        this.yaxis_.draw(gl, this.program_);
        this.zaxis_.draw(gl, this.program_);
    };

    ngOnDestroy() {
        //this.context_.get.deleteProgram(this.program_.get);
        cancelAnimationFrame(this.cancelToken);
    }

    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;
}