import {Injectable} from "angular2/core";
import {Observable, Observer} from "rxjs/Rx";
import {Http, Response} from "angular2/http";

@Injectable()
export class MeshLoader {

    constructor(private http_: Http) { };

    loadMesh(fileName: string): Observable<any> {
        localStorage.clear();
        let json = localStorage.getItem(fileName);
        if (json) {
            let object = JSON.parse(json);
            return new Observable((observer: Observer<any>) => {
                observer.next(object);
                observer.complete();
            });
        }

        return this.http_.get("mesh/" + fileName)
            .map(response => response.json())
            .do(object => {
                this.saveToLocal(fileName, object);
            }).catch(this.handleError);
    };

    handleError(err: Response) {
        return Observable.throw(err.json() || "server error");
    };

    saveToLocal(fileName: string, object) {
        let json = JSON.stringify(object);
        localStorage.setItem(fileName, json);
    };
};