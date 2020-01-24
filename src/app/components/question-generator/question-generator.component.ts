import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

import { JsonGetterService } from 'src/app/services/json-getter.service';
import { IdGetterService } from 'src/app/services/id-getter.service';

import { Question } from 'src/app/entities/Question';
import { Answer } from 'src/app/entities/answer';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'question-generator',
    templateUrl: './question-generator.component.html',
    styleUrls: ['./question-generator.component.css']
})
export class QuestionGeneratorComponent implements OnInit {

    questions: Question[];
    answers: Answer[];

    questionsFile: File;
    answersFile: File;

    readonly FILE = 'File';

    constructor(
        private jsonGetterService: JsonGetterService
        , private idGetterService: IdGetterService
        , private router: Router
    ) {
    }

    ngOnInit() {
        this.questions = new Array<Question>();
        this.answers = new Array<Answer>();
    }

    isChecked(qIndex: number, aId: number): boolean {
        const answer = this.answers.find((a, i) => {
            return i === qIndex && a.answers.includes(aId);
        });
        return !!answer;
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
        q.answersId = [];
        if (q.type === 'open') {
            q.answersId = [this.idGetterService.answerId];
        }
    }

    addSelectableAnswer(index: number) {
        const answerId = this.idGetterService.answerId;

        const q = this.questions[index];
        q.answers.push('');
        q.answersId.push(answerId);

        // const a = this.answers[index];
        // a.answers.push(answerId);
    }

    onCorrectAnswerChange(qIndex: number, aIndex: number, checked: boolean) {
        if (checked) {
            this.answers[qIndex].answers.push(this.questions[qIndex].answersId[aIndex]);
        } else {
            let rIndex: number = null;
            for (let i = 0; i < this.answers[qIndex].answers.length; i++) {
                if (this.questions[qIndex].answersId[aIndex] === this.answers[qIndex].answers[i]) {
                    rIndex = i;
                    break;
                }
            }
            if (rIndex || rIndex === 0) {
                this.answers[qIndex].answers.splice(rIndex, 1);
            }
        }
    }

    deleteSelectableAnswer(qIndex: number, aIndex: number) {
        if (this.isChecked(qIndex, this.questions[qIndex].answersId[aIndex])) {
            this.onCorrectAnswerChange(qIndex, aIndex, false);
        }
        this.questions[qIndex].answers.splice(aIndex, 1);
        this.questions[qIndex].answersId.splice(aIndex, 1);
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

    navigateTo(path: string) {
        this.router.navigate([path]);
    }
}
