import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";

import { RenderContext } from "../webgl/webgl-context";
import { ShaderProgram } from "../webgl/webgl-program";

import { RenderBatch } from "../render/render-batch";
import { Messenger } from "../worker/messenger";
import { InputManager } from "./input-manager";

@Component({
    selector: 'main-canvas',
    template: `
    <canvas id="canvas" #canvas canvas-controller [width]="canvas_width" [height]="canvas_height">
        <p>{{fallback_text}}</p>
    </canvas>
    `,
    styles: [`
    #canvas {
        height: 100%;
        width: 100%;
        border: none;
        position: absolute;
        z-index: 0;
    }
    `]
})
export class CanvasComponent implements OnDestroy {
    @ViewChild("canvas") canvas_ref: ElementRef;
    
    fallback_text: string = "Loading Canvas...";

    // TODO If the client could change resolution, the binding to canvas height and width (dimensions of drawing buffer),
    // would be different to the style.height and style.width of the canvas.
    //canvasWidth: number;
    //canvasHeight: number;
    //canvasTop: string;
    //canvasLeft: string;
    get canvas_width() {
        return this.canvas_ref.nativeElement.clientWidth;
    };

    get canvas_height() {
        return this.canvas_ref.nativeElement.clientHeight;
    };

    readonly RENDER_OBJECTS = 3;

    private cancel_token_: number;

    private model_changes_ = new Float32Array(this.RENDER_OBJECTS * 16);

    constructor(
        private gl_: RenderContext,
        private program_: ShaderProgram,
        private input_manager_: InputManager,
        private messenger_: Messenger,
        private render_batch_: RenderBatch
    ) {
        this.messenger_.getChanges((array) => {
            this.model_changes_.set(array);
        });
    };
    
    //getCanvasWidth() {
    //    let width = this.canvasWidth > 1920 ? 1920 : this.canvasWidth;
    //    return width;
    //};

    //getCanvasHeight() {
    //    let height = this.canvasHeight > 1080 ? 1080 : this.canvasHeight;
    //    return height;
    //};

    ngAfterViewInit() {
        let gl = this.gl_.create(this.canvas_ref.nativeElement);
        
        if (gl) {
            this.program_.initWebGl();

            let game_objects = ["base-model"];
            this.render_batch_.start(game_objects);
            
            this.cancel_token_ = requestAnimationFrame(this.tick);
        }
        else {
            setTimeout(() => {
                this.fallback_text = "Unable to initialise WebGL."
            }, 0);
        }
    }
    
    private tick = (timestamp: number) => {
        this.cancel_token_ = requestAnimationFrame(this.tick);
        
        let inputs = this.input_manager_.inputs;

        inputs.aspect = this.canvas_width / this.canvas_height;

        this.messenger_.sendInputs(inputs);

        this.input_manager_.update();

        let view = this.model_changes_.subarray(0, 16);
        let projection = this.model_changes_.subarray(16, 32);

        this.render(view, projection);
    };

    private render(view: Float32Array, projection: Float32Array) {
        let gl = this.gl_.context;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Use the viewport to display all of the buffer
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        gl.uniformMatrix4fv(this.program_.uView, false, view);
        gl.uniformMatrix4fv(this.program_.uProjection, false, projection);

        this.render_batch_.drawAll(this.model_changes_);
    };

    ngOnDestroy() {
        //this.context_.get.deleteProgram(this.program_.get);
        cancelAnimationFrame(this.cancel_token_);
        // TODO remove when a better way of chceking if meshes are up to date.
        localStorage.clear();
    }
}