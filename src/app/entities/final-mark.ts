import { Question } from "./Question";
import { Answer } from "./answer";
import { StudentAnswer } from "./student-answer";

export class MarkPerQuestion {
    questions: Question;
    answers: Answer;
    studentAnswers: StudentAnswer;
    constructor(
        questions?: Question
        , answers?: Answer
        , studentAnswers?: StudentAnswer
    ) {
        this.questions = questions;
        this.answers = answers;
        this.studentAnswers = studentAnswers;
    }
}

export class FinalMark {
    questionsAndAnswers: MarkPerQuestion[];
    adjustment: number;

    constructor(
        questionsAndAnswers: MarkPerQuestion[]
    ) {
        this.questionsAndAnswers = questionsAndAnswers;
        this.adjustment = 0;
    }
}