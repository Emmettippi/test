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
    adjustment: number;
    questionAnswerHash: number;
    startTime: number;
    endTime: number;
    expectedTime: number;
    questionsAndAnswers: QuestionAnswer[];

    constructor(
        questionsAndAnswers: QuestionAnswer[]
        , adjustment: number
        , questionAnswerHash: number
        , startTime: number
        , endTime: number
        , expectedTime: number
        , name: string
        , mark: number
    ) {
        this.questionsAndAnswers = questionsAndAnswers;
        this.adjustment = adjustment;
        this.questionAnswerHash = questionAnswerHash;
        this.startTime = startTime;
        this.endTime = endTime;
        this.expectedTime = expectedTime;
        this.name = name;
        this.mark = mark;
    }
}
