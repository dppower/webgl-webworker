
import { GameEngine } from "./game-engine";
import { WorkerMessenger } from "./worker-messenger";
import { GameState } from "./game-state";
import { Camera } from "./game-camera";

const messenger = new WorkerMessenger();

const camera = new Camera();
const gameState = new GameState(camera);

const engine = new GameEngine(messenger, gameState);
let interval_token: number;

(function() {
    engine.Start();
    let dt = 20; // 1000 / 50 ms per update
    interval_token = self.setInterval(() => {
        engine.Update(dt);
    }, dt);
})();