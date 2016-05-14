import {WorkerMessenger} from "./worker-messenger";
import {Camera} from "./game-camera";
import {GameObject} from "./game-object";
import {Transform} from "./transform";
import {GameState} from "./game-state";
import {InputState} from "./input-state";

interface Performance {
    now(): number;
}
declare var performance: Performance;

export class GameEngine {

    intervalHandle: number;

    private currentInputs_ = new InputState();

    constructor(private messenger_: WorkerMessenger, private gameState_: GameState) {
        this.messenger_.getInputs((inputs: InputState) => {
            this.currentInputs_ = inputs;
        });
    };

    Start() {
        let testObject = new GameObject(new Transform());
        this.gameState_.addNewObject(testObject);
    };

    Update(dt: number) {
        let state = this.gameState_.updateObjects(dt, this.currentInputs_);
        this.messenger_.pushChanges(state);
    };
};