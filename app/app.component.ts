import {Component, ViewChild, AfterViewInit} from "angular2/core";
import {CanvasFrameComponent} from "./canvas-frame.component";
import {ResizableCanvasComponent} from "./resizable-canvas.component";

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