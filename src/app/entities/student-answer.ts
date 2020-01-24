export class StudentAnswer {
    questionId: number;
    answers: boolean[];
    notes: string;

    constructor(questionId: number) {
        this.questionId = questionId;
        this.answers = [];
        this.notes = null;
    }
}