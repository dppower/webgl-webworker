import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { of as rxOf } from "rxjs/observable/of";
import { tap, map, catchError } from "rxjs/operators";

import { RenderContext } from "../webgl/webgl-context";

//interface MeshData {
//    vertices: number[];
//    indices: number[];
//    normals: number[];
//}

interface MeshData {
    vertex_count: number;
    vertex_positions: number[];
    vertex_normals: number[];
    texture_coordinates: number[];
}

export class Mesh {
    
    vertex_buffer: WebGLBuffer;
    //index_buffer: WebGLBuffer;
    normal_buffer: WebGLBuffer;
    //index_count = 0;
    vertex_count = 0;

    initialise(gl: WebGLRenderingContext, data: MeshData) {
        let vertices = new Float32Array(data.vertex_positions);
        this.vertex_buffer = gl.createBuffer();       
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);       
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        let normals = new Float32Array(data.vertex_normals);
        this.normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

        //this.index_buffer = gl.createBuffer();
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        //this.index_count = indices.length;
        this.vertex_count = data.vertex_count;
    };
};

@Injectable()
export class MeshLoader {

    private cached_meshes_: { [mesh_id: string]: Mesh } = {};

    constructor(private http_client_: HttpClient, private gl_: RenderContext) { };

    loadMesh(file_name: string) {
        let mesh = this.cached_meshes_[file_name]; //|| this.getMeshFromLocal(fileName);
        if (mesh) {            
            return rxOf(mesh);
        }

        return this.http_client_.get<MeshData>("mesh/" + file_name + ".json")
            .pipe(
                tap(data => {
                    return this.saveToLocalStorage(file_name, data)
                }),
                map(data => {
                    let mesh = new Mesh();
                    mesh.initialise(this.gl_.context, data);
                    this.cached_meshes_[file_name] = mesh;
                    return mesh;
                }),
                catchError(this.handleError)
            );
    };

    handleError(err: Response) {
        let mesh = new Mesh();
        return rxOf(mesh);
    };

    getMeshFromLocal(key: string) {
        let json = localStorage.getItem(key);
        let data = JSON.parse(json) as MeshData;

        let mesh = new Mesh();
        mesh.initialise(this.gl_.context, data);

        return mesh;
    };

    saveToLocalStorage(key: string, data: MeshData) {
        let value = JSON.stringify(data);
        localStorage.setItem(key, value);
    };
};