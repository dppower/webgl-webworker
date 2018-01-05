import {Injectable, Inject} from "angular2/core";
import {Subject} from "rxjs/Rx";
import {InputState} from "./input-manager";
import {GAME_ENGINE} from "./service-tokens";

@Injectable()
export class RenderMessenger {

    private inputs$ = new Subject<InputState>();
    private modelChanges$ = new Subject<Float32Array>();

    constructor(@Inject(GAME_ENGINE)private worker_: Worker) {
        this.worker_.onmessage = this.handleMessages;

        this.inputs$.subscribe((inputs: InputState) => {            
            this.worker_.postMessage(inputs);
        });
    };

    counter = 0;

    private handleMessages: EventListener = (event: MessageEvent) => {
        let array = new Float32Array(event.data);
        this.modelChanges$.next(array);
    };

    dispose() {
        removeEventListener("message", this.handleMessages);
        this.modelChanges$.complete();
        this.inputs$.complete();
    };

    getChanges(onNext: (array: Float32Array) => void) {
        return this.modelChanges$.subscribe(onNext);
    };

    sendInputs(inputs: InputState) {
        this.inputs$.next(inputs);
    };

};