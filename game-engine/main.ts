///<reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

import {GameEngine} from "./game-engine";
import {WorkerMessenger} from "./worker-messenger";
import {GameState} from "./game-state";
import {Camera} from "./game-camera";

const messenger = new WorkerMessenger();

const camera = new Camera();
const gameState = new GameState(camera);

const engine = new GameEngine(messenger, gameState);

(function() {
    engine.Start();
    let dt = 1000 / 60;
    let Update = () => {
        setInterval(Update, dt);
        engine.Update(dt);
    };
    Update();
})();