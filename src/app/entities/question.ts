export class Question {
    id: number;
    question: string;
    type: 'multi' | 'open';
    answers: string[];
    answersId: number[];

    constructor(id?: number) {
        this.id = id || null;
        this.question = '';
        this.type = 'multi';
        this.answers = [];
        this.answersId = [];
    }
}