import { NgModule } from "@angular/core";

// Modules
import { WebGLModule } from "../webgl/webgl.module";

// Components
import { MainCanvasComponent } from "./main-canvas.component";

// Directives
import { CanvasController } from "./canvas-controller.directive";

// Services
import { Camera } from "../objects/camera";
import { XAxis } from "../objects/x-axis";
import { YAxis } from "../objects/y-axis";
import { ZAxis } from "../objects/z-axis";

import { Transform } from "../maths/transform";

@NgModule({
    imports: [ WebGLModule ],
    declarations: [ MainCanvasComponent, CanvasController ],
    providers: [ Camera, XAxis, YAxis, ZAxis, { provide: "axis-transform", useValue: new Transform() } ],
    exports: [ MainCanvasComponent ]
})
export class CanvasModule { };