import {Injectable} from "angular2/core";
import {GameObject} from "./game-object";
import {Camera} from "./game-camera";
import {InputState} from "./input-state";

@Injectable()
export class GameState {

    private gameObjects_: GameObject[] = [];

    constructor(private camera_: Camera) { };

    addNewObject(object: GameObject) {
        this.gameObjects_.push(object);
    };

    removeObject(index: number) {
    };

    updateObjects(dt: number, inputs: InputState) {
        let bufferLength = (this.gameObjects_.length + 2) * 16 * 4;
        let buffer = new ArrayBuffer(bufferLength);

        let view = new Float32Array(buffer, 0, 64);
        let projection = new Float32Array(buffer, 64, 64);

        this.camera_.update(inputs.zoom, inputs.aspect);

        view = this.camera_.view;
        projection = this.camera_.projection;

        this.gameObjects_.forEach((object, i, array) => {
            let matrix = new Float32Array(buffer, (i + 2) * 64, 64);
            matrix = object.update(dt);
        });

        return buffer;
    };
}