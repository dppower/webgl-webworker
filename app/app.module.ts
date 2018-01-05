import { NgModule } from "@angular/core";

// Modules
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { CanvasModule } from "./canvas/canvas.module"

// Components
import { AppMainComponent } from "./app-main.component";

@NgModule({
    imports: [ BrowserModule, HttpClientModule, CanvasModule ],
    declarations: [ AppMainComponent ],
    bootstrap: [ AppMainComponent ]
})
export class AppModule { };