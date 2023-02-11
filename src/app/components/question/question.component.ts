import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';

import { JsonGetterService } from '../../services/json-getter.service';
import { StandardService } from '../../services/standard.service';
import { BaseComponent } from '../../services/basic.component';

import { Question, Questions } from '../../entities/question';
import { StudentAnswer, StudentAnswers } from '../../entities/student-answer';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent extends BaseComponent implements OnInit, OnDestroy {

    selected: number;
    questionsObj: Questions;

    studentAnswersObj: StudentAnswers;

    isLoaded: boolean;

    expectedTimeInMillis: number;

    updateChronoTimer: Subscription;
    showChronometer: boolean;
    timePassedInMillis: number;
    timerStr: string;

    get questions(): Question[] {
        return this.questionsObj.questions;
    }

    get studentAnswers(): StudentAnswer[] {
        return this.studentAnswersObj.studentAnswers;
    }

    get question(): Question {
        return this.questions[this.selected];
    }

    get studentAnswer(): StudentAnswer {
        return this.studentAnswers[this.selected];
    }

    constructor(
        private jsonGetterService: JsonGetterService
        , standardService: StandardService
        , router: Router
    ) {
        super(router, standardService);
    }

    ngOnInit() {
        this.selected = 0;
        this.isLoaded = false;
        this.showChronometer = true;
        this.questionsObj = this.standardService.questions;
        this.expectedTimeInMillis = this.questionsObj.expectedTime * 60000;
        const startTime = (new Date()).getTime();
        this.studentAnswersObj = new StudentAnswers('', startTime, 0, []);
        for (const q of this.questions) {
            const sa = new StudentAnswer(q.id);
            const answers = new Array<boolean>();
            for (const a of q.answers) {
                answers.push(false);
            }
            sa.answers = answers;

            this.studentAnswers.push(sa);
        }

        this.updateChronoTimer = timer(0, 10).subscribe(() => {
            this.timePassedInMillis = new Date().getTime() - this.studentAnswersObj.startTime;
            this.timerStr = this.getCronometer();
        }); /*setInterval(() => {
                    this.timePassedInMillis = new Date().getTime() - this.studentAnswersObj.startTime;
                });*/

        this.isLoaded = true;
    }

    changeQuestion(qIndex: number) {
        this.selected = qIndex;
    }

    showHideChrono() {
        this.showChronometer = !this.showChronometer;
    }

    suspend() {
        this.studentAnswer.suspended = !this.studentAnswer.suspended;
    }

    markAnswer(aIndex: number) {
        this.studentAnswer.answers[aIndex] = !this.studentAnswer.answers[aIndex];
    }

    getCronometer(): string {
        const timeAsDate = new Date(this.timePassedInMillis);
        const minutes = timeAsDate.getMinutes();
        const seconds = timeAsDate.getSeconds();
        return (timeAsDate.getHours() - 1)
            + ' : ' + (minutes < 10 ? '0' : '') + minutes
            + ' : ' + (seconds < 10 ? '0' : '') + seconds;
    }

    getQuestionBtnClass(qIndex: number): string {
        let ret = '';
        if (qIndex === this.selected) {
            ret = 'btn-secondary';
        } else if (this.studentAnswers[qIndex].suspended) {
            ret = 'btn-warning';
        } else if (this.darkTheme) {
            ret = 'btn-info';
        } else {
            ret = 'btn-default';
        }
        return ret;
    }

    save() {
        if (!this.studentAnswersObj.name
            || !this.studentAnswersObj.name.trim()) {
            return;
        } else {
            const studentAnswersObj = this.studentAnswersObj;
            const endTime = (new Date()).getTime();
            studentAnswersObj.endTime = endTime;
            const str = JSON.stringify(studentAnswersObj);
            FileSaver.saveAs(new Blob([str], { type: 'text/csv;charset=UTF-8' }), this.studentAnswersObj.name + '.json');
        }
    }

    back() {
        if (confirm('Attenzione! Tornando indietro perderai tutte le risposte. Continuare?')) {
            this.navigateTo('/entry');
        }
    }

    getAlertClass(): string {
        let ret = '';
        const timePassed = new Date().getTime() - this.studentAnswersObj.startTime;
        if (this.expectedTimeInMillis - timePassed >= this.expectedTimeInMillis * 0.1) {
            ret = 'alert-info';
        } else if (this.expectedTimeInMillis - timePassed >= 0) {
            ret = 'alert-warning';
        } else {
            ret = 'alert-danger';
        }
        return ret;
    }

    ngOnDestroy() {
        if (this.updateChronoTimer) {
            this.updateChronoTimer.unsubscribe();
        }
    }
}
