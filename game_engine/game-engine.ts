import {Component} from "angular2/core";
import {PostMessageService} from "./post-message.service";
import {Camera} from "./game-camera";

interface Performance {
    now(): number;
}
declare var performance: Performance;

@Component({
    selector: "game-engine",
    providers: [PostMessageService, Camera]
})
export class GameEngine {

    constructor(private postMessage_: PostMessageService, private camera_: Camera) {
        this.postMessage_.getInputs(this.Update);
    };

    Start() {
    };

    
    Update(changes: Float32Array) {
        let zoom = changes[0];
        this.camera_.update(zoom);
    };
};