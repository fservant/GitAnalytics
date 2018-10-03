import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

//This is ONLY for user to repo
@Injectable()
export class RepoSharedService {
    private source = new BehaviorSubject('default name');
    current = this.source.asObservable();

    constructor() { }

    changeValue(value: string) {
        this.source.next(value);
    }
}