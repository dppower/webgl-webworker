import {Injectable} from "angular2/core";
import {Subject} from "rxjs/Rx";
import {InputState} from "./input-manager";

declare function postMessage(data: any, transferables?: [ArrayBuffer]): void;

@Injectable()
export class RenderMessenger {

    private inputs$ = new Subject<InputState>();
    private modelChanges$ = new Subject<ArrayBuffer>();

    constructor() {
        addEventListener("message", this.handleMessages);

        this.inputs$.subscribe((inputs: InputState) => {
            postMessage(inputs);
        });
    };

    private handleMessages: EventListener = (event: MessageEvent) => {
        this.modelChanges$.next(event.data);
    };

    dispose() {
        removeEventListener("message", this.handleMessages);
        this.modelChanges$.complete();
        this.inputs$.complete();
    };

    getChanges(onNext: (array: ArrayBuffer) => void) {
        return this.modelChanges$.subscribe(onNext);
    };

    sendInputs(inputs: InputState) {
        this.inputs$.next(inputs);
    };

};