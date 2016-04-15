import {Inject, Injectable} from "angular2/core";
import {WebGLProgramService} from "./webgl-program";
import {Transform, Vec3} from "./transform";
import {GameObject} from "./game-object";
import {MeshLoader} from "./mesh-loader";

@Injectable()
export class YAxis extends GameObject {

    constructor( @Inject("axis-transform") transform: Transform, meshLoader_: MeshLoader) {
        super(transform, "y-axis.json", new Float32Array([0.0, 1.0, 0.0, 1.0]), meshLoader_);
    };
};