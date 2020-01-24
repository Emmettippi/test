export class Answer {
    questionId: number;
    values: number[];

    constructor(questionId?: number) {
        this.questionId = questionId || null;
        this.values = [];
    }
}