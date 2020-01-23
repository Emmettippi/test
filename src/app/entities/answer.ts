export class Answer {
    id: number;
    answers: number[];

    constructor(id?: number) {
        this.id = id || null;
        this.answers = [];
    }
}