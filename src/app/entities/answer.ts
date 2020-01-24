export class Answer {
    id: number;
    answers: number[];
    values: number[];

    constructor(id?: number) {
        this.id = id || null;
        this.answers = [];
        this.values = [];
    }
}