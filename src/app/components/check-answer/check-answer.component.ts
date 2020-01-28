import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/services/basic.component';
import { forkJoin, Observable } from 'rxjs';
import { saveAs } from 'file-saver';

import { JsonGetterService } from 'src/app/services/json-getter.service';

import { Question, Questions } from 'src/app/entities/Question';
import { Answer, Answers } from 'src/app/entities/answer';
import { StudentAnswer, StudentAnswers } from 'src/app/entities/student-answer';
import { FullQuestionAnswer, FinalMark } from 'src/app/entities/final-mark';
import { flatten } from '@angular/core/src/render3/util';

type MultiCheck = 'correct' | 'avoided' | 'wrong';

@Component({
    selector: 'check-answer',
    templateUrl: './check-answer.component.html',
    styleUrls: ['./check-answer.component.css']
})
export class CheckAnswersComponent extends BaseComponent implements OnInit {

    questionsObj: Questions;
    answersObj: Answers;
    studentAnswersObj: StudentAnswers;

    newQ: boolean;
    newA: boolean;

    questionsFile: File;
    answersFile: File;
    studentAnswersFile: File;

    adjustment: number;

    get questions(): Question[] {
        return this.questionsObj.questions;
    }

    get answers(): Answer[] {
        return this.answersObj.answers;
    }

    get studentAnswers(): StudentAnswer[] {
        return this.studentAnswersObj.studentAnswers;
    }

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
        return points + (this.adjustment || 0);
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
        this.adjustment = 0;
    }

    getStringifiedBonus() {
        let ret = '';
        if (this.adjustment) {
            ret = '(+' + this.adjustment + ')';
        }
        return ret;
    }

    getStringifiedTime(timeInMillis: number) {
        const date = new Date(timeInMillis);
        let ret = '';
        ret += date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
        ret += ' ' + date.getHours() + ' : ' + date.getMinutes() + ' : ' + date.getSeconds();
        return ret;
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
            .subscribe((subscription: Array<Questions | Answers | StudentAnswers>) => {
                this.studentAnswersObj = <StudentAnswers>subscription[0];
                if (this.newQ || this.newA) {
                    if (this.newQ && this.newA) {
                        this.questionsObj = <Questions>subscription[1];
                        this.answersObj = <Answers>subscription[2];
                    } else if (this.newQ) {
                        this.questionsObj = <Questions>subscription[1];
                    } else if (this.newA) {
                        this.answersObj = <Answers>subscription[1];
                    }
                }
                this.newQ = false;
                this.newA = false;
            }, (error) => {
                console.log(error);
            });
    }

    isNotes(qId: number): boolean {
        return !!this.getStudentAnswerByQuestionId(qId).notes;
    }

    getAlertClass(qIndex: number, aIndex: number) {
        let ret: string = null;
        const correct = this.checkedCorrect(qIndex, aIndex);
        switch (correct) {
            case 'correct':
                ret = 'alert-success';
                break;
            case 'avoided':
                ret = 'alert-info';
                break;
            case 'wrong':
                ret = 'alert-danger';
                break;
        }
        return ret;
    }

    getGlyphiconClass(qIndex: number, aIndex: number) {
        let ret: string = null;
        const correct = this.checkedCorrect(qIndex, aIndex);
        switch (correct) {
            case 'correct':
            case 'avoided':
                ret = 'glyphicon-ok';
                break;
            case 'wrong':
                ret = 'glyphicon-remove';
                break;
        }
        return ret;
    }

    checkedCorrect(qIndex: number, aIndex: number): 'correct' | 'avoided' | 'wrong' {
        let correct: MultiCheck = 'wrong';
        if (this.answers[qIndex].values[aIndex] > 0
            && this.getStudentAnswerByQuestionId(this.questions[qIndex].id).answers[aIndex]) {
            correct = 'correct';
        } else if (this.answers[qIndex].values[aIndex] <= 0
            && !this.getStudentAnswerByQuestionId(this.questions[qIndex].id).answers[aIndex]) {
            correct = 'avoided';
        }
        return correct;
    }

    confirmMark() {
        const marks = new Array<FullQuestionAnswer>();
        for (let qIndex = 0; qIndex < this.questions.length; qIndex++) {
            const sa = this.getStudentAnswerByQuestionId(this.questions[qIndex].id);
            marks.push(new FullQuestionAnswer(this.questions[qIndex], this.answers[qIndex], sa));
        }
        const finalMark = new FinalMark(
            marks
            , this.adjustment
            , this.questionsObj.hash
            , this.studentAnswersObj.startTime
            , this.studentAnswersObj.endTime
            , this.questionsObj.expectedTime);
        finalMark.adjustment = this.adjustment;
        const str = JSON.stringify(finalMark);
        saveAs(new Blob([str], { type: 'text/csv;charset=UTF-8' }), 'student.json');
    }
}
