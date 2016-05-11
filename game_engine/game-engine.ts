import {Component, OnDestroy} from "angular2/core";
import {PostMessageService} from "./post-message.service";
import {Camera} from "./game-camera";
import {GameObject} from "./game-object";
import {Transform} from "./transform";
import {GameState} from "./game-state";

interface Performance {
    now(): number;
}
declare var performance: Performance;

@Component({
    selector: "game-engine",
    providers: [PostMessageService, Camera]
})
export class GameEngine implements OnDestroy {

    intervalHandle: number;

    constructor(private postMessage_: PostMessageService, private camera_: Camera) {
        this.postMessage_.getInputs(this.Update);
    };

    ngOnDestroy() {
        clearInterval(this.intervalHandle);
    };

    Start() {
        let testObject = new GameObject(new Transform());
        this.previousState_.addNewObject(testObject);
        this.currentState_ = this.previousState_;
    };

    
    Update(changes: Float32Array) {

        this.intervalHandle = setInterval(this.Update, this.timeStep_);

        if (!this.isStarted) {
            this.Start();
            this.isStarted = true;
        };

        let zoom = changes[0];
        this.camera_.update(zoom);

        this.currentState_ = this.previousState_.updateObjects(this.timeStep_);
    };

    private previousState_: GameState;
    private currentState_: GameState;
    private isStarted = false;
    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;
};