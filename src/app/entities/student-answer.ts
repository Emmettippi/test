export class StudentAnswer {
    questionId: number;
    answers: boolean[];
    notes: string;
    teacherNotes: string;
    date: Date;

    constructor(questionId: number) {
        this.questionId = questionId;
        this.answers = [];
        this.notes = null;
        this.teacherNotes = null;
    }
}