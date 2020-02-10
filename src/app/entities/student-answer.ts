export class StudentAnswer {
    questionId: number;
    suspended: boolean;
    answers: boolean[];
    notes: string;
    date: Date;

    constructor(questionId: number) {
        this.questionId = questionId;
        this.answers = [];
        this.notes = null;
        this.suspended = false;
    }
}

export class StudentAnswers {
    name: string;
    startTime: number;
    endTime: number;
    studentAnswers: StudentAnswer[];

    constructor(name: string, startTime: number, endTime: number, studentAnswers: StudentAnswer[]) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.studentAnswers = studentAnswers;
    }
}
