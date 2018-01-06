import { NgModule } from "@angular/core";

// Services
import { MeshLoader } from "./mesh-loader";
import { PngDecoder } from "./png-decoder";
import { RenderBatch } from "./render-batch";
import { TextureLoader } from "./texture-loader";

@NgModule({
    providers: [ MeshLoader, PngDecoder, RenderBatch, TextureLoader ]
})
export class RenderModule { };