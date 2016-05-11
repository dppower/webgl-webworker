import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, provide, Inject} from "angular2/core";
import {WebGLContextService} from "./webgl/webgl-context";
import {WebGLProgramService} from "./webgl/webgl-program";
import {FragmentShader} from "./webgl/fragment-shader";
import {VertexShader} from "./webgl/vertex-shader";
import {RenderObject} from "./render-object";
import {RenderMessenger} from "./render-messenger.service";
import {InputManager} from "./input-manager";

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
    providers: [WebGLContextService, WebGLProgramService, FragmentShader, VertexShader, RenderMessenger]
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
    
    constructor(private gl_: WebGLContextService, private program_: WebGLProgramService, private inputManager_: InputManager, private renderMessenger_: RenderMessenger) { };
    
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

            this.renderMessenger_.getChanges((buffer) => {
                this.modelChanges = buffer;
            });
        }
        else {
            setTimeout(() => {
                this.fallbackText = "Unable to initialise WebGL."
            }, 0);
        }
    }

    private modelChanges: ArrayBuffer;

    private tick() {
        requestAnimationFrame(() => {
            this.tick();
        });
        let timeNow = window.performance.now();
        let inputs = this.inputManager_.inputs;
        
        inputs.aspect = this.canvasWidth / this.canvasHeight;

        this.renderMessenger_.sendInputs(inputs);

        this.dt_ += (timeNow - this.previousTime_); 
        while (this.dt_ >= this.timeStep_) {
            this.dt_ -= this.timeStep_;
        }

        let view = new Float32Array(this.modelChanges, 0, 16 * 4);
        let projection = new Float32Array(this.modelChanges, 16, 16 * 4);
        this.render(view, projection);

        this.previousTime_ = timeNow;
        
    };

    private render(view: Float32Array, projection: Float32Array) {
        let gl = this.gl_.context;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Use the viewport to display all of the buffer
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        gl.uniformMatrix4fv(this.program_.uView, false, view);

        gl.uniformMatrix4fv(this.program_.uProjection, false, projection);

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