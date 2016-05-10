import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, provide, Inject} from "angular2/core";
import {WebGLContextService} from "./webgl/webgl-context";
import {WebGLProgramService} from "./webgl/webgl-program";
import {FragmentShader} from "./webgl/fragment-shader";
import {VertexShader} from "./webgl/vertex-shader";
import {RenderObject} from "./render-object";
import {Http} from "angular2/http";

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
    providers: [WebGLContextService, WebGLProgramService, FragmentShader, VertexShader]
})
export class ResizableCanvasComponent implements OnDestroy {
    @ViewChild("canvas") canvasRef: ElementRef;
    
    fallbackText: string = "Loading Canvas...";

    private renderBatch_: RenderObject[] = [];

    // TODO If the client could change resolution, the binding to canvas height and width (dimensions of drawing buffer),
    // would be different to the style.height and style.width of the canvas.
    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    mouse_dx: number = 0;
    mouse_dy: number = 0;

    cancelToken: number;
    
    constructor(private gl_: WebGLContextService, private program_: WebGLProgramService, private http_: Http) { };
    
    getCanvasWidth() {
        let width = this.canvasWidth > 1920 ? 1920 : this.canvasWidth;
        return width;
    };

    getCanvasHeight() {
        let height = this.canvasHeight > 1080 ? 1080 : this.canvasHeight;
        return height;
    };

    ngAfterViewInit() {
        let gl = this.gl_.create(this.canvasRef.nativeElement);
        
        if (gl) {
            this.program_.initWebGl();

            // TODO async
            for (let i in this.renderBatch_) {
                this.renderBatch_[i].Start();
            };

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

    private tick() {
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

    private update(dt: number, mouse_dx: number, mouse_dy: number) {
        //let dx = 0.005 * dt * mouse_dx;
        //let dy = -0.005 * dt * mouse_dy;

        //updateCameraZoom(direction: string) {
        //    this.camera_.update(direction);
        //};
        //// Aspect depends on the display size of the canvas, not drawing buffer.
        //let aspect = this.canvasWidth / this.canvasHeight;
        //this.camera_.aspect = aspect;
        //this.axisTransform_.addRotation(new Vec3(1.0, 0.0, 0.0), dy);
        ////this.axisTransform_.addRotation(new Vec3(0.0, 1.0, 0.0), dx);
        //let angle = 0.05 * dt;
        //this.axisTransform_.rotate(new Vec3(0.0, 1.0, 0.0), angle);
        
    };

    private draw(dt: number) {
        let gl = this.gl_.context;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Use the viewport to display all of the buffer
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        gl.uniformMatrix4fv(this.program_.uView, false, this.camera_.view);

        gl.uniformMatrix4fv(this.program_.uProjection, false, this.camera_.projection);

        for (let i in this.renderBatch_) {
            this.renderBatch_[i].Draw(gl, this.program_,);
        };
    };

    ngOnDestroy() {
        //this.context_.get.deleteProgram(this.program_.get);
        cancelAnimationFrame(this.cancelToken);
        // TODO remove when a better way of chceking if meshes are up to date.
        localStorage.clear();
    }

    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;
}