import {Injectable} from "angular2/core";
import {Subject} from "rxjs/Rx";

@Injectable()
export class MainLoop {
    worker_: Worker;
    messages_: Subject<string>;

    constructor() {
        this.messages_ = new Subject<string>();
        this.worker_ = new Worker("app/mainthread.js");

        this.messages_.subscribe((data: string) => {
            console.log(data);
        });

        this.worker_.onmessage = (event: MessageEvent) => {
            this.messages_.next(event.data);
        };
    };

    init() {
        this.worker_.postMessage("initial message");
    };
    
    dispose() {
        this.worker_.terminate();
        this.messages_.complete();
    };
};