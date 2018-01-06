import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { of as rxOf } from "rxjs/observable/of";
import { concatMap, map, catchError } from "rxjs/operators";

import { RenderContext } from "../webgl/webgl-context";
import { PngDecoder } from "./png-decoder";

export class Texture {

    texture: WebGLTexture;

    initialised = false;

    init(gl: WebGLRenderingContext, image: ImageData) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image.data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //TODO additional texture setup.

        this.initialised = true;
    };
};

@Injectable()
export class TextureLoader {
    private texture_cache_: { [texture_id: string]: Texture } = {};

    constructor(private http_client_: HttpClient, private gl_: RenderContext, private decoder_: PngDecoder) { };

    loadTexture(file_name: string) {
        let texture: Texture = this.texture_cache_[file_name];
        if (texture) {
            return rxOf(texture);
        }

        let url = "texture/" + file_name;
        this.http_client_.get(url, { responseType: "blob" })
            .pipe(
                concatMap((blob) => this.decoder_.decode(blob)),
                map(image => {
                    let texture = new Texture();
                    texture.init(this.gl_.context, image);
                    return texture;
                }),
                catchError(this.handleError)
            );
    };

    handleError(err: Response) {
        return rxOf(new Texture());
    };
};