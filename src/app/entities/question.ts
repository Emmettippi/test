export class Question {
    id: number;
    question: string;
    type: 'multi' | 'open';
    answers: string[];

    constructor(id?: number) {
        this.id = id || null;
        this.question = '';
        this.type = 'multi';
        this.answers = [];
    }
}

export class Questions {
    hash: number;
    expectedTime: number;
    questions: Question[];

    constructor(questions: Question[]) {
        this.questions = questions;
        this.hash = null;
    }
}
