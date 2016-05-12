import {Injectable} from "angular2/core";
import {Observable, Observer} from "rxjs/Rx";
import {Http, Response} from "angular2/http";
import {RenderContext} from "./webgl/webgl-context";
import {PngDecoder} from "./png-decoder";

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
    private cache_: { [textureId: string]: Texture } = {};

    constructor(private http_: Http, private gl_: RenderContext, private decoder_: PngDecoder) { };

    loadTexture(fileName: string): Observable<Texture> {
        let texture: Texture = this.cache_[fileName];
        if (texture) {
            return Observable.of(texture);
        }

        let loaded = new Observable<Texture>((observer: Observer<Texture>) => {

            let xhr = new XMLHttpRequest();
            xhr.open("GET", "texture/" + fileName, true);

            xhr.responseType = "blob";

            xhr.onload = (event: Event) => {
                let blob = <Blob>(xhr.response);
                let texture = new Texture();

                let data = this.decoder_.decode(blob).then((image) => {
                    texture.init(this.gl_.context, image);
                });

                observer.next(texture);
                observer.complete();
            };

            xhr.send();
        });

        return loaded;
        //return this.http_.get("texture/" + fileName)
        //    .map(response => {
        //        let data: Blob = response.blob();
        //        let texture = new Texture();
        //        this.decoder_.decode(data).then((image) => {
        //            texture.init(this.gl_.context, image);
        //        });
        //        this.cache_[fileName] = texture;
        //        return texture;
        //    })
        //    .catch(this.handleError);
    };

    handleError(err: Response) {
        return Observable.throw(err.json() || "server error");
    };
};