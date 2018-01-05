import { Injectable } from "@angular/core";

@Injectable()
export class WebGLContextService {

    get context() { return this.context_; };
    
    constructor() { }

    create (canvas: HTMLCanvasElement) {
        this.context_ = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        return this.context_;
    };

    private context_: WebGLRenderingContext;
}