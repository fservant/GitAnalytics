import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataService {
    private source = new BehaviorSubject('default name');
    current = this.source.asObservable();

    constructor() { }

    changeValue(value: string) {
        this.source.next(value);
    }
}