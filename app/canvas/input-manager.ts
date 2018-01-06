import { Injectable } from "@angular/core";

var keyBindings = new Map<string, number>();
keyBindings["forward"] = 69;
keyBindings["back"] = 68;
keyBindings["left"] = 83;
keyBindings["right"] = 70;
keyBindings["jump"] = 32;

const moves = ["forward", "back", "left", "right"];
const actions = ["jump"];

export class InputState {
    aspect: number;
    zoom = 0.0;
    mouse_dx = 0.0;
    mouse_dy = 0.0;
    keys_down: string[] = [];
    keys_pressed: string[] = [];
};

@Injectable()
export class InputManager {

    private zoom_ = 0.0;

    previousMouseX = 0.0;
    previousMouseY = 0.0;

    currentMouseX = 0.0;
    currentMouseY = 0.0;

    setMouseCoords(x: number, y: number) {
        this.currentMouseX = x;
        this.currentMouseY = y;
    };

    previousKeyMap = new Map<number, boolean>();
    currentKeyMap = new Map<number, boolean>();

    isKeyDown(key: number) {
        if (this.currentKeyMap[key] == true) {
            return true;
        }
        return false;
    };

    isKeyPressed(key: number) {
        if (this.isKeyDown(key) == true && this.wasKeyDown(key) == false) {
            return true;
        }
        return false;
    };

    wasKeyDown(key: number) {
        if (this.previousKeyMap[key] == true) {
            return true;
        }
        return false;
    };

    setKeyDown(event: KeyboardEvent) {
        this.currentKeyMap[event.keyCode] = true;
    };

    setKeyUp(event: KeyboardEvent) {
        this.currentKeyMap[event.keyCode] = false;
    };

    get inputs() {
        let currentState = new InputState();
        currentState.zoom = this.zoom_;
        currentState.mouse_dx = this.currentMouseX - this.previousMouseX;
        currentState.mouse_dy = this.currentMouseY - this.previousMouseY;

        for (let i in moves) {
            let move = moves[i];
            let key = keyBindings[move];
            if (this.isKeyDown(key)) {
                currentState.keys_down.push(move);
            }
        }

        for (let i in actions) {
            let action = actions[i];
            let key = keyBindings[action];
            if (this.isKeyPressed(key)) {
                currentState.keys_pressed.push(action);
            }
        }
        return currentState;
    };

    set zoom(value: number) {
        if (value > 0.0) {
            this.zoom_ = -1.0;
        }
        else {
            this.zoom_ = 1.0;
        }
    };

    update() {
        this.zoom_ = 0.0;

        this.previousMouseX = this.currentMouseX;
        this.previousMouseY = this.currentMouseY;

        this.previousKeyMap.forEach((value, i, map) => {
            map[i] = this.currentKeyMap[i];
        });

        this.currentKeyMap.clear();
    };
}