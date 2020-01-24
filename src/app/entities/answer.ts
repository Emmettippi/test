export class Answer {
    questionId: number;
    values: number[];
    teacherNotes: string;

    constructor(questionId?: number) {
        this.questionId = questionId || null;
        this.values = [];
        this.teacherNotes = null;
    }
}