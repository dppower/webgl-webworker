import {Injectable} from "angular2/core";
import {Observable, Observer} from "rxjs/Rx";
import {Http, Response} from "angular2/http";
import {RenderContext} from "./webgl/webgl-context";

export class Mesh {
    vertexBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    normalBuffer: WebGLBuffer;
    length: number;

    initialise(gl: WebGLRenderingContext, vertices: Float32Array, normals: Float32Array, indices: Uint16Array) {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        this.length = indices.length;
    };
};

@Injectable()
export class MeshLoader {
    private cache_: { [meshId: string]: Mesh } = {};

    constructor(private http_: Http, private gl_: RenderContext) { };

    loadMesh(fileName: string): Observable<Mesh> {
        let mesh: Mesh = this.cache_[fileName] || this.getMeshFromLocal(fileName);
        if (mesh) {
            return Observable.of(mesh);
        }

        return this.http_.get("mesh/" + fileName)
            .map(response => response.json())
            .do(object => this.saveToLocal(fileName, object))
            .map(object => {
                let mesh = new Mesh();
                mesh.initialise(this.gl_.context, object.vertices, object.normals, object.indices);
                this.cache_[fileName] = mesh;
                return mesh;
            })
            .catch(this.handleError);
    };

    handleError(err: Response) {
        return Observable.throw(err.json() || "server error");
    };

    getMeshFromLocal(fileName: string) {
        let json = localStorage.getItem(fileName);
        let object = JSON.parse(json);

        let mesh = new Mesh();
        mesh.initialise(this.gl_.context, object.vertices, object.normals, object.indices);

        return mesh;
    };

    saveToLocal(fileName: string, object) {
        let json = JSON.stringify(object);
        localStorage.setItem(fileName, json);
    };
};