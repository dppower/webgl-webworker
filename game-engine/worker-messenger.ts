import {Injectable} from "angular2/core";
import {Subject} from "rxjs/Rx";
import {InputState} from "./input-state";

declare function postMessage(data: any, transferables?: [ArrayBuffer]): void;

@Injectable()
export class WorkerMessenger {
    private inputs$ = new Subject<InputState>();
    private modelChanges$ = new Subject<ArrayBuffer>();

    constructor() { 
        addEventListener("message", this.handleMessages);

        this.modelChanges$.subscribe((data: ArrayBuffer) => {
            postMessage(data, [data]);
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

    pushChanges(buffer: ArrayBuffer) {
        this.modelChanges$.next(buffer);
    };

    getInputs(onNext: (inputs: InputState) => void) {
        return this.inputs$.subscribe(onNext);
    };
      
};