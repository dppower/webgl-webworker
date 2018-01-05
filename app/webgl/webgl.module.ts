import { NgModule } from "@angular/core";

// Services
import { RenderContext } from "./webgl-context";
import { ShaderProgram } from "./webgl-program";
import { FragmentShader } from "./fragment-shader";
import { VertexShader } from "./vertex-shader";

@NgModule({
    providers: [ RenderContext, ShaderProgram, FragmentShader, VertexShader ]
})
export class WebGLModule { }