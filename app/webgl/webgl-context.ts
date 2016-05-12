import {Injectable} from "angular2/core";

@Injectable()
export class RenderContext {

    get context() { return this.context_; };
    
    constructor() { }

    create (canvas: HTMLCanvasElement) {
        this.context_ = <WebGLRenderingContext>(canvas.getContext("webgl")) || canvas.getContext("experimental-webgl");
        return this.context_;
    };

    private context_: WebGLRenderingContext;
}