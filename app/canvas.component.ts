import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, NgZone} from "angular2/core";
import {RenderContext} from "./webgl/webgl-context";
import {ShaderProgram, BASIC_SHADER} from "./webgl/webgl-program";
import {FragmentShader} from "./webgl/fragment-shader";
import {VertexShader} from "./webgl/vertex-shader";
import {RenderBatch, RENDER_PROVIDERS} from "./render-batch";
import {RenderMessenger} from "./render-messenger";
import {InputManager} from "./input-manager";
import {MeshLoader} from "./mesh-loader";

const RENDER_OBJECTS = 3;

@Component({
    selector: 'main-canvas',
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
    providers: [RenderContext, BASIC_SHADER, RenderMessenger, RENDER_PROVIDERS]
})
export class MainCanvas implements OnDestroy {
    @ViewChild("canvas") canvasRef: ElementRef;
    
    fallbackText: string = "Loading Canvas...";

    // TODO If the client could change resolution, the binding to canvas height and width (dimensions of drawing buffer),
    // would be different to the style.height and style.width of the canvas.
    canvasWidth: number;
    canvasHeight: number;
    canvasTop: string;
    canvasLeft: string;

    cancelToken: number;

    private modelChanges_ = new Float32Array(RENDER_OBJECTS * 16);

    constructor(
        private gl_: RenderContext,
        private program_: ShaderProgram,
        private inputManager_: InputManager,
        private renderMessenger_: RenderMessenger,
        private renderBatch_: RenderBatch,
        private zone_: NgZone
    ) {
        this.renderMessenger_.getChanges((array) => {
            this.modelChanges_.set(array);
        });
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
        let gl = this.gl_.create(this.canvasRef.nativeElement);
        
        if (gl) {
            this.program_.initWebGl();

            let gameObjects = ["base-model"];
            this.renderBatch_.Start(gameObjects);

            //this.cancelToken = requestAnimationFrame(this.tick);
            this.zone_.runOutsideAngular(() => {
                let timeNow = performance.now();
                this.tick(timeNow);
            });
        }
        else {
            setTimeout(() => {
                this.fallbackText = "Unable to initialise WebGL."
            }, 0);
        }
    }
    
    private tick = (timestamp: number) => {
        this.cancelToken = requestAnimationFrame(this.tick);
        
        let inputs = this.inputManager_.inputs;

        inputs.aspect = this.canvasWidth / this.canvasHeight;

        this.renderMessenger_.sendInputs(inputs);

        this.inputManager_.Update();

        let view = this.modelChanges_.subarray(0, 16);
        let projection = this.modelChanges_.subarray(16, 32);

        this.render(view, projection);
        
        console.log("---------------");
        console.log("current time: " + timestamp);
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
}