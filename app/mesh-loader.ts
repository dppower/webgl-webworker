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

        console.log("first vertex: " + vertices[0] + ", last: "  + vertices.length + ", " + vertices[vertices.length - 1]);
        console.log("first normal: " + normals[0] + ", last: " + normals.length + ", " + normals[normals.length - 1]);
        console.log("first index: " + indices[0] + ", last: " + indices.length + ", " + indices[indices.length - 1]);
        this.length = indices.length;
    };
};

@Injectable()
export class MeshLoader {
    private cache_: { [meshId: string]: Mesh } = {};

    constructor(private http_: Http, private gl_: RenderContext) { };

    loadMesh(fileName: string): Observable<Mesh> {
        let mesh: Mesh = this.cache_[fileName]; //|| this.getMeshFromLocal(fileName);
        if (mesh) {
            console.log("Found mesh in local storage or cache.");
            return Observable.of(mesh);
        }

        return this.http_.get("mesh/" + fileName)
            .map(response => {
                console.log("Received response from server.");
                return response.json();
                
            })
            .do(object => {
                console.log("Returned object vertices: " + object.vertices.length + ", normals: " + object.normals.length + ", indices: " + object.indices.length); 
                return this.saveToLocal(fileName, object)
            })
            .map(object => {
                let mesh = new Mesh();
                mesh.initialise(this.gl_.context, new Float32Array(object.vertices), new Float32Array(object.normals), new Uint16Array(object.indices));
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