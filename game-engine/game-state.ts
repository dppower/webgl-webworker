import { GameObject } from "./game-object";
import { Camera } from "./game-camera";
import { InputState } from "./input-state";

export class GameState {

    private game_objects_: GameObject[] = [];

    constructor(private camera_: Camera) { };

    addNewObject(object: GameObject) {
        this.game_objects_.push(object);
    };

    removeObject(index: number) {
    };

    updateObjects(dt: number, inputs: InputState) {
        let bufferLength = (this.game_objects_.length + 2) * 16 * 4;
        let buffer = new ArrayBuffer(bufferLength);

        let view = new Float32Array(buffer, 0, 16);
        let projection = new Float32Array(buffer, 64, 16);

        this.camera_.update(inputs);

        view.set(this.camera_.view);
        projection.set(this.camera_.projection);

        this.game_objects_.forEach((object, i) => {
            let matrix = new Float32Array(buffer, (i + 2) * 64, 16);
            matrix.set(object.update(dt, inputs));
        });

        return buffer;
    };
}