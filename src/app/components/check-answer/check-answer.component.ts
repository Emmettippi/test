import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/services/basic.component';
import { forkJoin, Observable } from 'rxjs';

import { JsonGetterService } from 'src/app/services/json-getter.service';

import { Question } from 'src/app/entities/Question';
import { Answer } from 'src/app/entities/answer';
import { StudentAnswer } from 'src/app/entities/student-answer';

@Component({
    selector: 'check-answer',
    templateUrl: './check-answer.component.html',
    styleUrls: ['./check-answer.component.css']
})
export class CheckAnswersComponent extends BaseComponent implements OnInit {

    questions: Question[];
    answers: Answer[];
    studentAnswers: StudentAnswer[];

    newQ: boolean;
    newA: boolean;

    questionsFile: File;
    answersFile: File;
    studentAnswersFile: File;

    get total(): number {
        let total = 0;
        if (this.questions && this.answers) {
            for (let qIndex = 0; qIndex < this.questions.length; qIndex++) {
                for (let aIndex = 0; aIndex < this.answers[qIndex].values.length; aIndex++) {
                    if (this.answers[qIndex].values[aIndex] > 0) {
                        total += this.answers[qIndex].values[aIndex];
                    }
                }
            }
        }
        return total;
    }

    get points(): number {
        let points = 0;
        if (this.questions && this.answers && this.studentAnswers) {
            for (let qIndex = 0; qIndex < this.questions.length; qIndex++) {
                const studentAnswer = this.getStudentAnswerByQuestionId(this.questions[qIndex].id);
                for (let aIndex = 0; aIndex < this.answers[qIndex].values.length; aIndex++) {
                    if (studentAnswer.answers[aIndex]) {
                        points += this.answers[qIndex].values[aIndex];
                    }
                }
            }
        }
        return points;
    }

    get mark(): number {
        if (this.total === 0) {
            return 0;
        }
        return Math.floor(100 * 30 * this.points / this.total) / 100;
    }

    constructor(
        private jsonGetterService: JsonGetterService
        , router: Router
    ) {
        super(router);
    }

    ngOnInit() {
        this.newQ = false;
        this.newA = false;
    }

    loadQFile(event: any) {
        this.questionsFile = event.target.files.item(0);
        this.newQ = true;
    }

    loadAFile(event: any) {
        this.answersFile = event.target.files.item(0);
        this.newA = true;
    }

    loadSAFile(event: any) {
        this.studentAnswersFile = event.target.files.item(0);
    }

    getStudentAnswerByQuestionId(questionId: number): StudentAnswer {
        return this.studentAnswers.find(sa => sa.questionId === questionId) || null;
    }

    readFilesAndConfront() {
        const observables = new Array<Observable<any>>();
        observables.push(this.jsonGetterService.getJSON(this.studentAnswersFile['path']));
        if (this.newQ) {
            observables.push(this.jsonGetterService.getJSON(this.questionsFile['path']));
        }
        if (this.newA) {
            observables.push(this.jsonGetterService.getJSON(this.answersFile['path']));
        }
        forkJoin(observables)
            .subscribe((subscription: Array<Question[] | Answer[] | StudentAnswer[]>) => {
                this.studentAnswers = <StudentAnswer[]>subscription[0];
                if (this.newQ || this.newA) {
                    if (this.newQ && this.newA) {
                        this.questions = <Question[]>subscription[1];
                        this.answers = <Answer[]>subscription[2];
                    } else if (this.newQ) {
                        this.questions = <Question[]>subscription[1];
                    } else if (this.newA) {
                        this.answers = <Answer[]>subscription[1];
                    }
                }
                this.newQ = false;
                this.newA = false;
            }, (error) => {
                console.log(error);
            });
    }
    
    checkedCorrect(qIndex: number, aIndex: number): boolean {
        return this.answers[qIndex].values[aIndex] > 0;
    }
}
