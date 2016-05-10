import {Injectable} from "angular2/core";
import {Subject} from "rxjs/Rx";

declare function postMessage(data: any, transferables?: [ArrayBuffer]): void;

@Injectable()
export class PostMessageService {
    private inputs$ = new Subject<Float32Array>();
    private modelChanges$ = new Subject<Float32Array>();

    constructor() { 
        addEventListener("message", this.handleMessages);

        this.modelChanges$.subscribe((data: Float32Array) => {
            postMessage(data.buffer, [data.buffer]);
        });
    };

    private handleMessages: EventListener = (event: MessageEvent) => {
        this.inputs$.next(event.data);
    };

    dispose() {
        removeEventListener("message", this.handleMessages);
        this.modelChanges$.complete();
        this.inputs$.complete();
    };

    pushChanges(array: Float32Array) {
        this.modelChanges$.next(array);
    };

    getInputs(onNext: (array: Float32Array) => void) {
        return this.inputs$.subscribe(onNext);
    };
      
};