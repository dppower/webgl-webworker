import { Directive, HostListener } from "@angular/core";
import { InputManager } from "./input-manager";

@Directive({
    selector: "[canvas-controller]"
})
export class CanvasController {

    constructor(private input_manager_: InputManager) { };

    @HostListener("mouseup", ["$event"])
    setMouseUp(event: MouseEvent) {
        event.stopPropagation();
        if (event.button == 0) {
            this.input_manager_.setMouseButton("left", false);
        }
        else if (event.button == 2) {
            this.input_manager_.setMouseButton("right", false);
        }
    };

    @HostListener("mousedown", ["$event"])
    setMouseDown(event: MouseEvent) {
        event.stopPropagation();
        if (event.button == 0) {
            this.input_manager_.setMouseButton("left", true);
        }
        else if (event.button == 2) {
            this.input_manager_.setMouseButton("right", true);
        }
    };

    @HostListener("wheel", ["$event"])
    onMouseWheel(event: WheelEvent) {
        let scroll = (event.deltaY > 0) ? 1 : -1;
        this.input_manager_.setWheelDirection(scroll);
        return false;
    };

    @HostListener("mousemove", ["$event"])
    onMouseMove(event: MouseEvent) {
        this.input_manager_.setMousePosition({ x: event.clientX, y: event.clientY });
        return false;
    };
}