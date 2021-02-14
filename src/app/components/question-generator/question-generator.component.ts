import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';

import { BaseComponent } from '../../services/basic.component';
import { JsonGetterService } from '../../services/json-getter.service';
import { StandardService } from '../../services/standard.service';

import { Question, Questions } from '../../entities/Question';
import { Answer, Answers } from '../../entities/answer';

@Component({
    selector: 'question-generator',
    templateUrl: './question-generator.component.html',
    styleUrls: ['./question-generator.component.css']
})
export class QuestionGeneratorComponent extends BaseComponent implements OnInit {

    questionsObj: Questions;
    answersObj: Answers;

    questionsFile: File;
    answersFile: File;

    get questions(): Question[] {
        return this.questionsObj.questions;
    }

    get answers(): Answer[] {
        return this.answersObj.answers;
    }

    readonly FILE = 'File';

    get total(): number {
        let total = 0;
        for (let qIndex = 0; qIndex < this.questions.length; qIndex++) {
            for (let aIndex = 0; aIndex < this.answers[qIndex].values.length; aIndex++) {
                if (this.answers[qIndex].values[aIndex] > 0) {
                    total += this.answers[qIndex].values[aIndex];
                }
            }
        }
        return total;
    }

    get tmpArray(): number[][] {
        const array = new Array<Array<number>>();
        for (let q = 0; q < this.questions.length; q++) {
            const tmp = new Array<number>();
            for (let a = 0; a < this.answers[q].values.length; a++) {
                tmp.push(a);
            }
            array.push(tmp);
        }
        return array;
    }

    constructor(
        private jsonGetterService: JsonGetterService
        , standardService: StandardService
        , router: Router
    ) {
        super(router, standardService);
    }

    ngOnInit() {
        this.questionsObj = new Questions([]);
        this.questionsObj.expectedTime = 0;
        this.answersObj = new Answers([]);
    }

    add() {
        const q = new Question(this.standardService.questionId);
        this.questions.push(q);

        const a = new Answer(q.id);
        this.answers.push(a);
    }

    delete(index: number) {
        this.questions.splice(index, 1);
        this.answers.splice(index, 1);
    }

    onAnswerTypeChange(event: 'multi' | 'open', index: number) {
        this.questions[index].type = event;
        this.questions[index].answers = [];

        this.answers[index].values = [];
        if (this.questions[index].type === 'open') {
            this.questions[index].answers.push('');
            this.answers[index].values.push(0);
        }
    }

    addSelectableAnswer(index: number) {
        const q = this.questions[index];
        q.answers.push('');
        this.answers[index].values[q.answers.length - 1] = 0;

        // const a = this.answers[index];
        // a.answers.push(answerId);
    }

    deleteSelectableAnswer(qIndex: number, aIndex: number) {
        this.questions[qIndex].answers.splice(aIndex, 1);

        this.answers[qIndex].values.splice(aIndex, 1);
    }

    move(index: number, movement: 'up' | 'down') {
        const i = movement === 'up' ? -1 : 1;

        const tmpQ = this.questions[index];
        this.questions[index] = this.questions[index + i];
        this.questions[index + i] = tmpQ;

        const tmpA = this.answers[index];
        this.answers[index] = this.answers[index + i];
        this.answers[index + i] = tmpA;
    }

    loadQFile(event: any) {
        this.questionsFile = event.target.files.item(0);
    }

    loadAFile(event: any) {
        this.answersFile = event.target.files.item(0);
    }

    import() {
        forkJoin([
            this.jsonGetterService.getJSON(this.questionsFile['path'])
            , this.jsonGetterService.getJSON(this.answersFile['path'])
        ]).subscribe((subscription: Array<Questions | Answers>) => {
            this.questionsObj = <Questions>subscription[0];
            this.answersObj = <Answers>subscription[1];
            let maxId: number;
            for (const q of this.questions) {
                if (!maxId || q.id > maxId) {
                    maxId = q.id;
                }
            }
            this.standardService.fixIds(maxId);
        }, (error) => {
            console.log(error);
        });
    }

    save() {
        const questionsObj = this.questionsObj;
        const answersObj = this.answersObj;

        const hash = this.hash(JSON.stringify(questionsObj));
        questionsObj.hash = hash;
        answersObj.hash = hash;

        const strQ = JSON.stringify(questionsObj);
        saveAs(new Blob([strQ], { type: 'text/csv;charset=UTF-8' }), 'questions.json');

        const strA = JSON.stringify(answersObj);
        saveAs(new Blob([strA], { type: 'text/csv;charset=UTF-8' }), 'answers.json');
    }
}
