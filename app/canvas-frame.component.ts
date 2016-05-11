import {Component, ViewChild, ContentChild, AfterViewChecked, AfterContentChecked} from "angular2/core";
import {CanvasFrameDirective} from "./canvas-frame.directive";
import {ResizableCanvasComponent} from "./canvas.component";
import {InputManager} from "./input-manager";

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
        (mousemove)="onMouseMove($event)" 
        (wheel)="onMouseWheel($event)" 
        (keydown)="onKeyDown($event)" 
        (keyup)="onKeyUp($event)"
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
    directives: [CanvasFrameDirective],
    providers: [InputManager]
})
export class CanvasFrameComponent {
    @ViewChild(CanvasFrameDirective) frame: CanvasFrameDirective;
    @ContentChild(ResizableCanvasComponent) canvas: ResizableCanvasComponent;

    outCanvasWidth: number;
    outCanvasHeight: number;
    outCanvasTop: string;
    outCanvasLeft: string;

    constructor(private inputManager_: InputManager) { };

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
        this.inputManager_.zoom = event.deltaY;

        return false;
    };

    onKeyDown(event: KeyboardEvent) {
        this.inputManager_.KeyDown = event.key;
    };

    onKeyUp(event: KeyboardEvent) {
        this.inputManager_.KeyUp = event.key;
    };

    onMouseMove(event: MouseEvent) {
        this.inputManager_.setMouseCoords(event.clientX, event.clientY);
    };
}