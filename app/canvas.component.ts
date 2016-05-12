import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, provide, Inject} from "angular2/core";
import {RenderContext} from "./webgl/webgl-context";
import {ShaderProgram} from "./webgl/webgl-program";
import {FragmentShader} from "./webgl/fragment-shader";
import {VertexShader} from "./webgl/vertex-shader";
import {RenderBatch} from "./render-batch";
import {RenderMessenger} from "./render-messenger";
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
    providers: [RenderContext, ShaderProgram, FragmentShader, VertexShader, RenderMessenger, RenderBatch]
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

    cancelToken: number;


    private modelChanges_: ArrayBuffer;

    constructor(
        private gl_: RenderContext,
        private program_: ShaderProgram,
        private inputManager_: InputManager,
        private renderMessenger_: RenderMessenger,
        private renderBatch_: RenderBatch
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
        let gl = this.gl_.create(this.canvasRef.nativeElement);
        
        if (gl) {
            this.program_.initWebGl();

            let gameObjects = ["base-model"];
            this.renderBatch_.Start(gameObjects);

            this.cancelToken = requestAnimationFrame(() => {
                this.tick();
            });

            this.renderMessenger_.getChanges((buffer) => {
                this.modelChanges_ = buffer;
            });
        }
        else {
            setTimeout(() => {
                this.fallbackText = "Unable to initialise WebGL."
            }, 0);
        }
    }


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

        let view = new Float32Array(this.modelChanges_, 0, 64);
        let projection = new Float32Array(this.modelChanges_, 64, 64);
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

        this.renderBatch_.DrawAll(this.modelChanges_);
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