import {Injectable} from "angular2/core";

@Injectable()
export class PngDecoder {   

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D; 

    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = <CanvasRenderingContext2D>(this.canvas.getContext("2D"));
    };

    decode(data: Blob) {
        let dataLoaded = new Promise<ImageData>((resolve, reject) => {

            let img = new Image();

            img.onload = (event: Event) => {
                this.canvas.height = img.height;
                this.canvas.width = img.width;

                this.context.drawImage(img, 0, 0);

                let decodedData = this.context.getImageData(0, 0, img.width, img.height);

                window.URL.revokeObjectURL(img.src);
                
                resolve(decodedData);
            };

            img.src = window.URL.createObjectURL(data);
        });

        return dataLoaded;
    };
};