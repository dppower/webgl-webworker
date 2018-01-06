import { Subscription } from "rxjs/Subscription";
import { WorkerMessenger } from "./worker-messenger";
import { Camera } from "./game-camera";
import { GameObject } from "./game-object";
import { Transform } from "./transform";
import { GameState } from "./game-state";
import { InputState } from "./input-state";

export class GameEngine {

    intervalHandle: number;

    private current_inputs_ = new InputState();
    private inputs_subscription: Subscription;

    constructor(private messenger_: WorkerMessenger, private gameState_: GameState) {
        this.inputs_subscription = this.messenger_.getInputs().subscribe((inputs) => {
            this.current_inputs_ = inputs;
        });
    };

    Start() {
        let testObject = new GameObject(new Transform());
        this.gameState_.addNewObject(testObject);
    };

    Update(dt: number) {
        let state = this.gameState_.updateObjects(dt, this.current_inputs_);
        this.messenger_.pushChanges(state);
    };

    dispose() {
        this.inputs_subscription.unsubscribe();
    };
};