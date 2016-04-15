import {Component, ViewChild, ContentChild, AfterViewChecked, AfterContentChecked} from "angular2/core";
import {CanvasFrameDirective} from "./canvas-frame.directive";
import {ResizableCanvasComponent} from "./canvas.component";

@Component({
    selector: "canvas-frame",
    template: `
    <div id="frame" 
        #frame 
        canvasFrame 
        [inHeight]="frame.offsetHeight" 
        [inWidth]="frame.offsetWidth" 
        [inTop]="frame.offsetTop" 
        [inLeft]="frame.offsetLeft" 
        (mousemove)="onDrag($event)" 
        (wheel)="onMouseWheel($event)"
    ></div>
    <ng-content></ng-content>
    `,
    styles: [`
    #frame {
        height: 100%;
        width: 100%;
        position: relative;
        z-index: 10;
        border: 0.25em dashed white;
    }
    `],
    directives: [CanvasFrameDirective]
})
export class CanvasFrameComponent {
    @ViewChild(CanvasFrameDirective) frame: CanvasFrameDirective;
    @ContentChild(ResizableCanvasComponent) canvas: ResizableCanvasComponent;

    outCanvasWidth: number;
    outCanvasHeight: number;
    outCanvasTop: string;
    outCanvasLeft: string;

    ngAfterContentChecked() {
        this.canvas.canvasHeight = this.outCanvasHeight;
        this.canvas.canvasWidth = this.outCanvasWidth;
        this.canvas.canvasTop = this.outCanvasTop;
        this.canvas.canvasLeft = this.outCanvasLeft;
    };

    ngAfterViewChecked() {
        setTimeout(() => {
            this.outCanvasHeight = this.frame.inHeight;
            this.outCanvasWidth = this.frame.inWidth;
            this.outCanvasTop = this.frame.inTop;
            this.outCanvasLeft = this.frame.inLeft;
        }, 0);
    };

    onMouseWheel(event: WheelEvent) {
        let delta = event.deltaY;

        if (delta > 0.0) {
            this.canvas.updateCameraZoom("out");
        } else {
            this.canvas.updateCameraZoom("in");
        }
        return false;
    };

    onDrag(event: MouseEvent) {
        if (event.buttons == 1) {
            this.canvas.mouse_dx = event.movementX;
            this.canvas.mouse_dy = event.movementY;
        } else {
            this.canvas.mouse_dx = 0;
            this.canvas.mouse_dy = 0;
        }
    };
}