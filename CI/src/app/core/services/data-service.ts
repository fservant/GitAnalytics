import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataService {
    private source = new BehaviorSubject('default name');
    username = this.source.asObservable();

    constructor() {}

    changeUsername(name: string) {
        debugger;
        this.source.next(name);
    }

    getUsername() {
        return this.source.getValue();
    }
}