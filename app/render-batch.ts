import {Injectable} from "angular2/core";
import {RenderObject} from "./render-object";
import {MeshLoader} from "./mesh-loader";
import {ShaderProgram} from "./webgl/webgl-program";
import {RenderContext} from "./webgl/webgl-context";

@Injectable()
export class RenderBatch {
    objectMap: Map<string, RenderObject>;

    constructor(
        private meshLoader_: MeshLoader,
        private gl_: RenderContext,
        private program_: ShaderProgram
    ) { };

    Start(objectIds: string[]) {
        for (let id in objectIds) {
            this.objectMap[id] = new RenderObject(id);
        }

        this.objectMap.forEach((object, i, map) => {
            object.Start(this.meshLoader_);
        });
    };

    DrawAll(buffer: ArrayBuffer) {
        //TODO if objects share a texture, should bind texture once and draw all similar objects.
        let index = 2;
        this.objectMap.forEach((object, i, map) => {
            let transform = new Float32Array(buffer, index * 64, 64);
            object.Draw(this.gl_.context, this.program_, transform);
            index++;
        });
    };
}