import {Injectable, provide} from "angular2/core";
import {RenderObject} from "./render-object";
import {MeshLoader} from "./mesh-loader";
import {TextureLoader} from "./texture-loader";
import {ShaderProgram} from "./webgl/webgl-program";
import {RenderContext} from "./webgl/webgl-context";
import {PngDecoder} from "./png-decoder";

@Injectable()
export class RenderBatch {
    objectMap = new Map<string, RenderObject>();

    constructor(
        private meshLoader_: MeshLoader,
        private textureLoader_: TextureLoader,
        private gl_: RenderContext,
        private program_: ShaderProgram
    ) { };

    Start(objectIds: string[]) {
        for (let i in objectIds) {
            let id = objectIds[i];
            this.objectMap[id] = new RenderObject(id);
            let object = (<RenderObject>this.objectMap[id]);
            console.log("for let i: " + JSON.stringify(object));
            object.Start(this.meshLoader_);
        }

        this.objectMap.forEach((object, i, map) => {
            console.log("for each object: " + JSON.stringify(object));
            object.Start(this.meshLoader_);
        });
    };

    DrawAll(models: Float32Array) {
        //TODO if objects share a texture, should bind texture once and draw all similar objects.
        let transform = new Float32Array(16);
        transform.set(models.subarray(32, 48));
        (<RenderObject>this.objectMap["base-model"]).Draw(this.gl_.context, this.program_, transform);
    };
}

export const RENDER_PROVIDERS = [
    MeshLoader,
    TextureLoader,
    PngDecoder,
    RenderBatch
];