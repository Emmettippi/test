import { Question } from './Question';
import { Answer } from './answer';
import { StudentAnswer } from './student-answer';

export class FullQuestionAnswer {
    question: Question;
    answer: Answer;
    studentAnswer: StudentAnswer;
    constructor(
        question?: Question
        , answer?: Answer
        , studentAnswer?: StudentAnswer
    ) {
        this.question = question;
        this.answer = answer;
        this.studentAnswer = studentAnswer;
    }
}

export class FinalMark {
    questionsAndAnswers: FullQuestionAnswer[];
    adjustment: number;
    questionAnswerHash: number;
    startTime: number;
    endTime: number;
    expectedTime: number;

    constructor(
        questionsAndAnswers: FullQuestionAnswer[]
        , adjustment: number
        , questionAnswerHash: number
        , startTime: number
        , endTime: number
        , expectedTime: number
    ) {
        this.questionsAndAnswers = questionsAndAnswers;
        this.adjustment = adjustment;
        this.questionAnswerHash = questionAnswerHash;
        this.startTime = startTime;
        this.endTime = endTime;
        this.expectedTime = expectedTime;
    }
}
