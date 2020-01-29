import { Question } from './Question';
import { Answer } from './answer';
import { StudentAnswer } from './student-answer';

export class QuestionAnswer {
    question: Question;
    answer: Answer;
    studentAnswer: StudentAnswer;
    correctionNotes: string;
    answerPoints: number;

    constructor(
        question?: Question
        , answer?: Answer
        , studentAnswer?: StudentAnswer
    ) {
        this.question = question;
        this.answer = answer;
        this.studentAnswer = studentAnswer;
        this.correctionNotes = '';
        this.answerPoints = 0;
    }
}

export class FinalMark {
    name: string;
    mark: number;
    points: number;
    adjustment: number;
    total: number;
    startTime: number;
    endTime: number;
    expectedTime: number;
    teahcerExtraNotes: string;
    questionsAndAnswers: QuestionAnswer[];
    questionAnswerHash: number;

    constructor() {
        this.name = null;
        this.mark = null;
        this.points = null;
        this.adjustment = null;
        this.total = null;
        this.startTime = null;
        this.endTime = null;
        this.expectedTime = null;
        this.teahcerExtraNotes = null;
        this.questionsAndAnswers = [];
        this.questionAnswerHash = null;
    }
}
