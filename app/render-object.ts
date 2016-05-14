import {MeshLoader, Mesh} from "./mesh-loader";
//import {TextureLoader, Texture} from "./texture-loader";
import {ShaderProgram} from "./webgl/webgl-program";

export class RenderObject {
    private mesh_: Mesh;
    private meshLoaded_ = false;
    //private textureLoaded_ = false;

    //private texture_: Texture;

    private transform_ = new Float32Array(16);

    constructor(
        private meshFile_: string
        //private textureFile_: string,
    ) { };

    Start(meshLoader: MeshLoader) {
        console.log("start mesh file: " + this.meshFile_);
        meshLoader.loadMesh(this.meshFile_).subscribe(mesh => {
            console.log("mesh file: " + this.meshFile_);
            this.mesh_ = mesh;
            this.meshLoaded_ = true;
        });

        //this.textureLoader_.loadTexture(this.textureFile_).subscribe(texture => {
        //    this.texture_ = texture;
        //    this.meshLoaded_ = true;
        //});
    };
    
    Draw(gl: WebGLRenderingContext, program: ShaderProgram, array: Float32Array) {

        if (!this.meshLoaded_ /*|| !this.textureLoaded_*/) return;

        //gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, this.texture_.texture);
        //gl.uniform1i(program.uSampler, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh_.vertexBuffer);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh_.normalBuffer);
        gl.vertexAttribPointer(program.aNormals, 3, gl.FLOAT, false, 0, 0);
        
        this.transform_.set(array);

        gl.uniformMatrix4fv(program.uTransform, false, this.transform_);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh_.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.mesh_.length, gl.UNSIGNED_SHORT, 0);

    };
};