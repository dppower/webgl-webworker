import { Injectable } from "@angular/core";

export interface Vec2 {
    x: number;
    y: number;
}

export interface PointerState {
    left: boolean;
    right: boolean;
    wheel: number;
    position: Vec2;
    delta: Vec2;
    aspect?: number;
};

const InitialPointerState: PointerState = {
    left: false,
    right: false,
    wheel: 0,
    position: { x: 0, y: 0 },
    delta: { x: 0, y: 0 }
};

@Injectable()
export class InputManager {

    get current_state() {
        return this.current_pointer_state_;
    };

    private previous_pointer_state_: PointerState;
    private current_pointer_state_: PointerState;

    constructor() {
        this.previous_pointer_state_ = Object.assign({}, InitialPointerState);
        this.current_pointer_state_ = Object.assign({}, InitialPointerState);
    };

    setMousePosition(position: Vec2) {
        let current_delta = {
            x: position.x - this.previous_pointer_state_.position.x,
            y: position.y - this.previous_pointer_state_.position.y
        };

        this.current_pointer_state_.position = position;
        this.current_pointer_state_.delta = current_delta;
    };

    setWheelDirection(value: number) {
        this.current_pointer_state_.wheel = value;
    };

    isButtonDown(button: "left" | "right") {
        return this.current_pointer_state_[button];
    };

    wasButtonDown(button: "left" | "right") {
        return this.previous_pointer_state_[button];
    };

    isButtonPressed(button: "left" | "right") {
        if (this.isButtonDown(button) && !this.wasButtonDown(button)) {
            return true;
        }
        return false;
    };

    wasButtonReleased(button: "left" | "right") {
        if (!this.isButtonDown(button) && this.wasButtonDown(button)) {
            return true;
        }
        return false;
    };

    setMouseButton(button: "left" | "right", state: boolean) {
        this.current_pointer_state_[button] = state;
    };

    update() {
        // Reset inputs
        this.previous_pointer_state_["left"] = this.current_pointer_state_["left"];
        this.previous_pointer_state_["right"] = this.current_pointer_state_["right"];
        this.previous_pointer_state_["wheel"] = this.current_pointer_state_["wheel"];
        this.previous_pointer_state_["position"] = this.current_pointer_state_["position"];
        this.previous_pointer_state_["delta"] = this.current_pointer_state_["delta"];

        this.current_pointer_state_["delta"] = { x: 0, y: 0 };
        this.current_pointer_state_.wheel = 0;
    };
}