import {Component, ViewChild, ContentChild, AfterViewChecked, AfterContentChecked} from "angular2/core";
import {CanvasFrameDirective} from "./canvas-frame.directive";
import {ResizableCanvasComponent} from "./resizable-canvas.component";

@Component({
    selector: "canvas-frame",
    template: `
    <div #frame id="frame" canvasFrame [inHeight]="frame.offsetHeight" [inWidth]="frame.offsetWidth" [inTop]="frame.offsetTop" [inLeft]="frame.offsetLeft"></div>
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
    directives: [CanvasFrameDirective, ResizableCanvasComponent]
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
}