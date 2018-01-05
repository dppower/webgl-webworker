import { NgModule } from "@angular/core";

// Services
import { WebGLContextService } from "./webgl-context";
import { WebGLProgramService } from "./webgl-program";
import { FragmentShader } from "./fragment-shader";
import { VertexShader } from "./vertex-shader";
import { MeshLoader } from "./mesh-loader";

@NgModule({
    providers: [ WebGLContextService, WebGLProgramService, FragmentShader, VertexShader, MeshLoader ]
})
export class WebGLModule { }