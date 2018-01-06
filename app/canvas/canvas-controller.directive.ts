import { Directive, HostListener } from "@angular/core";
import { InputManager } from "./input-manager";

@Directive({
    selector: "[canvas-controller]"
})
export class CanvasController {

    constructor(private input_manager_: InputManager) { };

    @HostListener("wheel", ["$event"])
    onMouseWheel(event: WheelEvent) {
        this.input_manager_.zoom = event.deltaY;
        return false;
    };

    @HostListener("keydown", ["$event"])
    onKeyDown(event: KeyboardEvent) {
        this.input_manager_.setKeyDown(event);
        return false;
    };

    @HostListener("keyup", ["$event"])
    onKeyUp(event: KeyboardEvent) {
        this.input_manager_.setKeyUp(event);
        return false;
    };

    @HostListener("mousemove", ["$event"])
    onMouseMove(event: MouseEvent) {
        this.input_manager_.setMouseCoords(event.clientX, event.clientY);
        return false;
    };
}