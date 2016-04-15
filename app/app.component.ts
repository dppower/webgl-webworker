import {Component} from "angular2/core";
import {CanvasFrameComponent} from "./canvas-frame.component";
import {ResizableCanvasComponent} from "./canvas.component";

@Component({
    selector: 'my-app',
    template: `
    <canvas-frame>
        <resizable-canvas></resizable-canvas>
    </canvas-frame>
    `,
    directives: [CanvasFrameComponent, ResizableCanvasComponent]
})
export class AppComponent { }