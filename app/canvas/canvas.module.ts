import { NgModule } from "@angular/core";

// Modules
import { WebGLModule } from "../webgl/webgl.module";
import { RenderModule } from "../render/render.module";

// Components
import { CanvasComponent } from "./canvas.component";

// Directives
import { CanvasController } from "./canvas-controller.directive";

// Services
import { InputManager } from "./input-manager";

@NgModule({
    imports: [ WebGLModule, RenderModule ],
    declarations: [ CanvasComponent, CanvasController ],
    providers: [ InputManager ],
    exports: [ CanvasComponent ]
})
export class CanvasModule { };