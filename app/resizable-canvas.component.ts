import {Component, ViewChild, ElementRef, AfterViewInit, OnDestroy} from "angular2/core";
import {WebGLContextService} from "./webgl-context";
import {WebGLProgramService} from "./webgl-program";
import {FragmentShader} from "./fragment-shader";
import {VertexShader} from "./vertex-shader";
import {Camera} from "./game-camera";
import {GameObject} from "./game-object";

@Component({
    selector: 'resizable-canvas',
    template: `
    <canvas #canvas id="canvas" [width]="getCanvasWidth()" [height]="getCanvasHeight()" [style.width]="canvasWidth" [style.height]="canvasHeight" [style.top]="canvasTop" [style.left]="canvasLeft"><p>{{fallbackText}}</p></canvas>
    `,
    styles: [`
    #canvas {
        position: absolute;
        z-index: 0;
    }
    `],
    providers: [WebGLContextService, WebGLProgramService, FragmentShader, VertexShader, Camera, GameObject]
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

    constructor(private context_: WebGLContextService, private program_: WebGLProgramService, private cube_: GameObject) { };
    
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
            this.cancelToken = requestAnimationFrame(() => {
                this.mainloop();
            });
        }
        else {
            console.log("Unable to initialise WebGL.");
            setTimeout(() => {
                this.fallbackText = "Unable to initialise WebGL."
            }, 0);
        }
    }

    mainloop() {
        let timeNow = window.performance.now();
        this.dt_ += (timeNow - this.previousTime_); 
        while (this.dt_ >= this.timeStep_) {
            this.cube_.update(this.timeStep_);
            this.dt_ -= this.timeStep_;
        }
        this.program_.draw(this.dt_, this.canvasWidth, this.canvasHeight);
        this.previousTime_ = timeNow;
        requestAnimationFrame(() => {
            this.mainloop();
        });
    };

    ngOnDestroy() {
        cancelAnimationFrame(this.cancelToken);
    }

    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;
}