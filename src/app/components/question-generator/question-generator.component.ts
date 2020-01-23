import { Component, OnInit } from '@angular/core';

import { JsonGetterService } from 'src/app/services/json-getter.service';
import { IdGetterService } from 'src/app/services/id-getter.service';

import { Question } from 'src/app/entities/Question';
import { Answer } from 'src/app/entities/answer';

@Component({
    selector: 'question-generator',
    templateUrl: './question-generator.component.html',
    styleUrls: ['./question-generator.component.css']
})
export class QuestionGeneratorComponent implements OnInit {

    questions: Question[];
    answers: Answer[];

    constructor(
        private jsonGetterService: JsonGetterService
        , private idGetterService: IdGetterService
    ) {
    }

    ngOnInit() {
        this.questions = new Array<Question>();
    }

    private doForQuestion(id: number, callback: (i?: number) => void) {
        for (let i = 0; i < this.questions.length; i++) {
            if (this.questions[i].id === id) {
                callback(i);
                break;
            }
        }
    }

    private doForAnswer(id: number, callback: (i?: number) => void) {
        for (let i = 0; i < this.answers.length; i++) {
            if (this.answers[i].id === id) {
                callback(i);
                break;
            }
        }
    }

    add() {
        const q = new Question(this.idGetterService.questionId);
        this.questions.push(q);

        const a = new Answer(q.id);
        this.answers.push(a);
    }

    delete(id: number) {
        let index: number = null;
        const callback = (i: number) => {
            index = i;
        };
        this.doForQuestion(id, callback);
        this.questions.splice(index, 1);
        this.answers.splice(index, 1);
    }

    onAnswerTypeChange(id: number) {
        const callback = (i: number) => {
            const q = this.questions[i];
            q.answers = [];
            q.answersId = [];
            if (q.type === 'open') {
                q.answersId = [this.idGetterService.answerId];
            }
        };
        this.doForQuestion(id, callback);
    }

    addSelectableAnswer(id: number) {
        const answerId = this.idGetterService.answerId;

        const questionCallback = (i: number) => {
            const q = this.questions[i];
            q.answers.push('');
            q.answersId.push(answerId);
        };
        this.doForQuestion(id, questionCallback);

        const answerCallback = (i: number) => {
            const a = this.answers[i];
            a.answers.push(answerId);
        };
        this.doForAnswer(id, answerCallback);
    }

    onCorrectAnswerChange(questionId: number, answerId: number, checked: boolean) {
        let answerCallback: (i: number) => void = null;
        if (checked) {
            answerCallback = (i: number) => {
                const a = this.answers[i];
                a.answers.push(answerId);
            };
        } else {
            answerCallback = (i: number) => {
                const a = this.answers[i];
                let index: number = null;
                for (let j = 0; j < this.answers[i].answers.length; j++) {
                    index = j;
                    break;
                }
                if (index) {
                    this.answers[i].answers.splice(index, 1);
                }
            }
        }

        this.doForAnswer(questionId, answerCallback);
    }

    deleteSelectableAnswer(questionId: number, answerId: number) {
        let index: number = null;
        const callback = (i: number) => {
            index = i;
        };
        this.doForAnswer(questionId, callback);
        this.answers.splice(index, 1);
    }
}
