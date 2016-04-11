import {Directive, Input} from "angular2/core";

@Directive({
    selector: "[canvasFrame]"
})
export class CanvasFrameDirective {
    @Input() inWidth: number;
    @Input() inHeight: number;
    @Input() inTop: string;
    @Input() inLeft: string;
    
}