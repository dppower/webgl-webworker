import { Injector, StaticProvider } from "@angular/core";
import { GameEngine } from "./game-engine";
import { WorkerMessenger } from "./worker-messenger";
import { GameState } from "./game-state";
import { Camera } from "./game-camera";

const providers: StaticProvider[] = [
    { provide: GameEngine, deps: [WorkerMessenger, GameState] },
    { provide: Camera, deps: [] },
    { provide: GameState, deps: [Camera] },
    { provide: WorkerMessenger, deps: [] }
];

const injector = Injector.create(providers);

let interval_token: number;

(function () {
    const engine = injector.get(GameEngine);
    engine.Start();
    let dt = 20; // 1000 / 50 ms per update
    interval_token = self.setInterval(() => {
        engine.Update(dt);
    }, dt);
})();