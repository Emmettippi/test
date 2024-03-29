import { StandardService } from './../../services/standard.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';

import { JsonGetterService } from '../../services/json-getter.service';
import { BaseComponent } from '../../services/basic.component';

import { Question, Questions } from '../../entities/question';
import { Answer, Answers } from '../../entities/answer';
import { StudentAnswer, StudentAnswers } from '../../entities/student-answer';
import { QuestionAnswer, FinalMark } from '../../entities/final-mark';

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
    correctionNotes: string[];
    answerPoints: number[];
    teacherExtraNotes: string;

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
                points += this.answerPoints[qIndex];
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
        , protected router: Router
        , protected standardService: StandardService
    ) {
        super(router, standardService);
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

    getStringifiedHoursTime(timeInMillis: number, reducehours = false) {
        const date = new Date(timeInMillis);
        let ret = '';
        ret += (date.getHours() - (reducehours ? 1 : 0))
            + ' : ' + date.getMinutes()
            + ' : ' + date.getSeconds();
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

    getStudentAnswerByQuestionId(questionId: number): StudentAnswer | null {
        return this.studentAnswers.find(sa => sa.questionId === questionId) || null;
    }

    readFilesAndConfront() {
        const promises = new Array<Promise<any>>();
        promises.push(this.jsonGetterService.readFileAsJson(this.studentAnswersFile));
        if (this.newQ) {
            promises.push(this.jsonGetterService.readFileAsJson(this.questionsFile));
        }
        if (this.newA) {
            promises.push(this.jsonGetterService.readFileAsJson(this.answersFile));
        }
        Promise.all(promises)
            .then((subscription: Array<any>) => {
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

                this.correctionNotes = [];
                this.answerPoints = [];
                for (const q of this.questions) {
                    this.correctionNotes.push('');
                    this.answerPoints.push(0);
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

    checkedCorrect(qIndex: number, aIndex: number): MultiCheck {
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
        const questionAnswers = new Array<QuestionAnswer>();
        for (let qIndex = 0; qIndex < this.questions.length; qIndex++) {
            const sa = this.getStudentAnswerByQuestionId(this.questions[qIndex].id);
            const qa = new QuestionAnswer(this.questions[qIndex], this.answers[qIndex], sa);
            qa.correctionNotes = this.correctionNotes[qIndex];
            qa.answerPoints = this.answerPoints[qIndex];
            questionAnswers.push(qa);
        }

        const finalMark = new FinalMark();
        finalMark.adjustment = this.adjustment;
        finalMark.endTime = this.studentAnswersObj.endTime;
        finalMark.expectedTime = this.questionsObj.expectedTime;
        finalMark.mark = this.mark;
        finalMark.name = this.studentAnswersObj.name;
        finalMark.points = this.points - this.adjustment;
        finalMark.questionAnswerHash = this.questionsObj.hash;
        finalMark.questionsAndAnswers = questionAnswers;
        finalMark.startTime = this.studentAnswersObj.startTime;
        finalMark.teahcerExtraNotes = this.teacherExtraNotes;
        finalMark.total = this.total;

        const str = JSON.stringify(finalMark);
        FileSaver.saveAs(new Blob([str], { type: 'text/csv;charset=UTF-8' }), this.studentAnswersObj.name + '-correzione.json');
    }
}
