import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { PointerState } from "../canvas/input-manager";
import { GAME_ENGINE } from "../service-tokens";

@Injectable()
export class Messenger {

    private inputs$ = new Subject<PointerState>();
    private model_changes_ = new Subject<Float32Array>();

    constructor(@Inject(GAME_ENGINE) private worker_: Worker) {
        this.worker_.onmessage = this.handleMessages;

        this.inputs$.subscribe(inputs => {            
            this.worker_.postMessage(inputs);
        });
    };

    private handleMessages: EventListener = (event: MessageEvent) => {       
        let array = new Float32Array(event.data.buffer);
        this.model_changes_.next(array);
    };

    getChanges() {
        return this.model_changes_.asObservable();
    };

    sendInputs(inputs: PointerState) {
        this.inputs$.next(inputs);
    };

    dispose() {
        removeEventListener("message", this.handleMessages);
        this.model_changes_.complete();
        this.inputs$.complete();
    };
};