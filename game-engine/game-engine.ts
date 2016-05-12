import {Component, OnDestroy} from "angular2/core";
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

@Component({
    selector: "game-engine",
    providers: [WorkerMessenger, Camera, GameState]
})
export class GameEngine implements OnDestroy {

    intervalHandle: number;

    private currentInputs_;

    constructor(private messenger_: WorkerMessenger, private gameState_: GameState) {
        this.messenger_.getInputs((inputs: InputState) => {
            if (!this.isStarted) {
                this.Start();
                this.Update();
                this.isStarted = true;
            }
            this.currentInputs_ = inputs;
        });
    };

    ngOnDestroy() {
        clearInterval(this.intervalHandle);
    };

    Start() {
        let testObject = new GameObject(new Transform());
        this.gameState_.addNewObject(testObject);
    };

    
    Update() {
        this.intervalHandle = setInterval(this.Update, this.timeStep_);
        let state = this.gameState_.updateObjects(this.timeStep_, this.currentInputs_);

        this.messenger_.pushChanges(state);
    };
    
    private isStarted = false;
    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;
};