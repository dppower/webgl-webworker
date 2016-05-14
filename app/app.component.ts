import {Component, provide, OnDestroy, Inject} from "angular2/core";
import {HTTP_PROVIDERS} from "angular2/http";
import {CanvasFrame} from "./canvas-frame.component";
import {MainCanvas} from "./canvas.component";
import {GAME_ENGINE} from "./service-tokens";

@Component({
    selector: "app",
    template: `
    <canvas-frame>
        <main-canvas></main-canvas>
    </canvas-frame>
    `,
    directives: [CanvasFrame, MainCanvas],
    providers: [HTTP_PROVIDERS, provide(GAME_ENGINE, { useValue: new Worker("js/load-engine.js") })]
})
export class AppComponent implements OnDestroy {
    
    constructor( @Inject(GAME_ENGINE) private gameEngine_: Worker) { };

    ngOnDestroy() {
        this.gameEngine_.terminate();
    };
}