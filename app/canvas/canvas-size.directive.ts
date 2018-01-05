import {Directive, Input} from "angular2/core";

@Directive({
    selector: "[canvasSize]"
})
export class CanvasSize {
    @Input() inWidth: number;
    @Input() inHeight: number;
    @Input() inTop: string;
    @Input() inLeft: string;

    constructor() { };
}