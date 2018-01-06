import { Component, OnDestroy, Inject } from "@angular/core";
import { GAME_ENGINE } from "./service-tokens";

@Component({
    selector: "app-main",
    template: `
    <main-canvas></main-canvas>
    `
})
export class AppMainComponent implements OnDestroy {
    
    constructor(@Inject(GAME_ENGINE) private game_engine_: Worker) { };

    ngOnDestroy() {
        this.game_engine_.terminate();
    };
}