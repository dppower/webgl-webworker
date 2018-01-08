import { NgModule } from "@angular/core";

// Modules
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { CanvasModule } from "./canvas/canvas.module"

// Components
import { AppMainComponent } from "./app-main.component";

// Providers
import { Messenger } from "./worker/messenger";

import { GAME_ENGINE } from "./service-tokens";

@NgModule({
    imports: [ BrowserModule, HttpClientModule, CanvasModule ],
    declarations: [ AppMainComponent ],
    providers: [ Messenger, { provide: GAME_ENGINE, useValue: new Worker("load-engine.js") } ],
    bootstrap: [ AppMainComponent ]
})
export class AppModule { };