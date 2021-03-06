import { Injectable } from '@angular/core';

@Injectable()
export class StandardService {

    public darkTheme = true;

    private _questionId: number;
    private _answerId: number;

    get questionId() {
        this._questionId++;
        return this._questionId;
    }

    get answerId() {
        this._answerId++;
        return this._answerId;
    }

    constructor() {
        this._questionId = 0;
        this._answerId = 0;
    }

    fixIds(id: number) {
        this._questionId = id;
        this._answerId = id;
    }
}
