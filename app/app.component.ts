import {Component} from "angular2/core";
import {HTTP_PROVIDERS} from "angular2/http";
import {CanvasFrameComponent} from "./canvas-frame.component";
import {ResizableCanvasComponent} from "./canvas.component";

@Component({
    selector: 'my-app',
    template: `
    <canvas-frame>
        <resizable-canvas></resizable-canvas>
    </canvas-frame>
    `,
    directives: [HTTP_PROVIDERS, CanvasFrameComponent, ResizableCanvasComponent]
})
export class AppComponent { }