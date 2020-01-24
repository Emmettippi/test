import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';

import { BaseComponent } from 'src/app/services/basic.component';
import { JsonGetterService } from 'src/app/services/json-getter.service';
import { IdGetterService } from 'src/app/services/id-getter.service';

import { Question } from 'src/app/entities/Question';
import { Answer } from 'src/app/entities/answer';

@Component({
    selector: 'question-generator',
    templateUrl: './question-generator.component.html',
    styleUrls: ['./question-generator.component.css']
})
export class QuestionGeneratorComponent extends BaseComponent implements OnInit {

    questions: Question[];
    answers: Answer[];

    questionsFile: File;
    answersFile: File;

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
        , private idGetterService: IdGetterService
        , router: Router
    ) {
        super(router);
    }

    ngOnInit() {
        this.questions = new Array<Question>();
        this.answers = new Array<Answer>();
    }

    add() {
        const q = new Question(this.idGetterService.questionId);
        this.questions.push(q);

        const a = new Answer(q.id);
        this.answers.push(a);
    }

    delete(index: number) {
        this.questions.splice(index, 1);
        this.answers.splice(index, 1);
    }

    onAnswerTypeChange(event: 'multi' | 'open', index: number) {
        const q = this.questions[index];
        q.type = event;
        q.answers = [];

        this.answers[index].values = [];
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
        ]).subscribe((subscription: Array<Question[] | Answer[]>) => {
            this.questions = <Question[]>subscription[0];
            this.answers = <Answer[]>subscription[1];
        }, (error) => {
            console.log(error);
        });
    }

    save() {
        const strQ = JSON.stringify(this.questions);
        saveAs(new Blob([strQ], { type: 'text/csv;charset=UTF-8' }), 'questions.json');

        const strA = JSON.stringify(this.answers);
        saveAs(new Blob([strA], { type: 'text/csv;charset=UTF-8' }), 'answers.json');
    }
}
