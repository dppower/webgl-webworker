import {Inject, Injectable} from "angular2/core";
import {WebGLProgramService} from "./webgl-program";
import {Transform} from "./transform";
import {GameObject} from "./game-object";
import {MeshLoader} from "./mesh-loader";

@Injectable()
export class XAxis extends GameObject {

    constructor( @Inject("axis-transform") transform: Transform, meshLoader_: MeshLoader) {
        super(transform, "x-axis.json", new Float32Array([1.0, 0.0, 0.0, 1.0]), meshLoader_);
    };
};