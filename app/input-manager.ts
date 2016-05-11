import {Injectable} from "angular2/core";

var keyBindings = new Map<string, string>();
keyBindings["forward"] = "e";
keyBindings["back"] = "d";
keyBindings["left"] = "s";
keyBindings["right"] = "f";
keyBindings["jump"] = "Spacebar";

var moves = ["forward", "back", "left", "right"];
var actions = ["jump"];

export class InputState {
    aspect: number;
    zoom = 0.0;
    mouseDx = 0.0;
    mouseDy = 0.0;
    keyDown: string[] = [];
    keyPressed: string[] = [];
};

@Injectable()
export class InputManager {

    private zoom_ = 0.0;

    previousMouseX = 0.0;
    previousMouseY = 0.0;

    currentMouseX: number;
    currentMouseY: number;

    setMouseCoords(x: number, y: number) {
        this.currentMouseX = x;
        this.currentMouseY = y;
    };

    previousKeyMap = new Map<string, boolean>();
    currentKeyMap = new Map<string, boolean>();

    isKeyDown(key: string) {
        if (this.currentKeyMap[key] == true) {
            return true;
        }
        return false;
    };

    isKeyPressed(key: string) {
        if (this.isKeyDown(key) == true && this.wasKeyDown(key) == false) {
            return true;
        }
        return false;
    };

    wasKeyDown(key: string) {
        if (this.previousKeyMap[key] == true) {
            return true;
        }
        return false;
    };

    set KeyDown(key: string) {
        this.currentKeyMap[key] = true;
    };

    set KeyUp(key: string) {
        this.currentKeyMap[key] = false;
    };

    get inputs() {
        let currentState = new InputState();
        currentState.zoom = this.zoom_;
        currentState.mouseDx = this.currentMouseX - this.previousMouseX;
        currentState.mouseDy = this.currentMouseY - this.previousMouseY;

        for (let move in moves) {
            let key = keyBindings[move];
            if (this.isKeyDown(key)) {
                currentState.keyPressed[move];
            }
        }

        for (let action in actions) {
            let key = keyBindings[action];
            if (this.isKeyPressed(key)) {
                currentState.keyPressed[action];
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

    Update() {
        this.zoom_ = 0.0;
        this.previousKeyMap.forEach((value, i, map) => {
            map[i] = this.currentKeyMap[i];
        });
    };
}