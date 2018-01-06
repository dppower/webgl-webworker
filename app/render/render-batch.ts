import { Injectable } from "@angular/core";

import { RenderObject } from "./render-object";
import { MeshLoader } from "./mesh-loader";
import { TextureLoader } from "./texture-loader";
import { ShaderProgram } from "../webgl/webgl-program";
import { RenderContext } from "../webgl/webgl-context";
import { PngDecoder } from "./png-decoder";

@Injectable()
export class RenderBatch {

    private render_objects_ = new Map<string, RenderObject>();

    constructor(
        private mesh_loader_: MeshLoader,
        private texture_loader_: TextureLoader,
        private gl_: RenderContext,
        private program_: ShaderProgram
    ) { };

    start(object_ids: string[]) {
        for (let id of object_ids) {
            this.render_objects_.set(id, new RenderObject(id));
        }

        this.render_objects_.forEach(object => {
            object.start(this.mesh_loader_);
        });
    };

    drawAll(models: Float32Array) {
        //TODO if objects share a texture, should bind texture once and draw all similar objects.
        let transform = new Float32Array(16);
        transform.set(models.subarray(32, 48));
        this.render_objects_.get("base-model").draw(this.gl_.context, this.program_, transform);
    };
}