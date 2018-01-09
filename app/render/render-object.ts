import { MeshLoader, Mesh } from "./mesh-loader";
//import {TextureLoader, Texture} from "./texture-loader";
import { ShaderProgram } from "../webgl/webgl-program";

export class RenderObject {
    private mesh_: Mesh;
    private mesh_loaded_ = false;
    //private textureLoaded_ = false;

    //private texture_: Texture;

    private transform_ = new Float32Array(16);

    constructor(
        private mesh_file_: string
        //private textureFile_: string,
    ) { };

    start(mesh_loader: MeshLoader) {
        //console.log("start mesh file: " + this.meshFile_);
        mesh_loader.loadMesh(this.mesh_file_).subscribe(mesh => {
            //console.log("mesh file: " + this.meshFile_);
            this.mesh_ = mesh;
            //this.mesh_loaded_ = this.mesh_.index_count > 0;
            this.mesh_loaded_ = this.mesh_.vertex_count > 0;
        });

        //this.textureLoader_.loadTexture(this.textureFile_).subscribe(texture => {
        //    this.texture_ = texture;
        //    this.meshLoaded_ = true;
        //});
    };
    
    draw(gl: WebGLRenderingContext, program: ShaderProgram, array: Float32Array) {

        if (!this.mesh_loaded_ /*|| !this.textureLoaded_*/) return;

        //gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, this.texture_.texture);
        //gl.uniform1i(program.uSampler, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh_.vertex_buffer);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh_.normal_buffer);
        gl.vertexAttribPointer(program.aNormals, 3, gl.FLOAT, false, 0, 0);
        
        this.transform_.set(array);

        gl.uniformMatrix4fv(program.uTransform, false, this.transform_);

        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh_.index_buffer);

        //gl.drawElements(gl.TRIANGLES, this.mesh_.index_count, gl.UNSIGNED_SHORT, 0);
        gl.drawArrays(gl.TRIANGLES, 0, this.mesh_.vertex_count);

    };
};