import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { InputState } from "./input-state";

export class WorkerMessenger {

    private input_changes_ = new Subject<InputState>();
    private model_changes_ = new Subject<ArrayBuffer>();
    private model_changes_subscription_: Subscription;

    constructor() { 
        addEventListener("message", this.handleMessages);

        this.model_changes_subscription_ = this.model_changes_.subscribe((data: ArrayBuffer) => {
            postMessage(data, [data]);
        });
    };

    private handleMessages: EventListener = (event: MessageEvent) => {
        this.input_changes_.next(event.data);
    };

    dispose() {
        removeEventListener("message", this.handleMessages);
        this.model_changes_.complete();
        this.input_changes_.complete();
        this.model_changes_subscription_.unsubscribe();
    };

    pushChanges(buffer: ArrayBuffer) {
        this.model_changes_.next(buffer);
    };

    getInputs() {
        return this.input_changes_.asObservable();
    };
      
};