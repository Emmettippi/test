import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

import { JsonGetterService } from '../../services/json-getter.service';
import { StandardService } from '../../services/standard.service';
import { BaseComponent } from '../../services/basic.component';

import { Question, Questions } from '../../entities/Question';
import { StudentAnswer, StudentAnswers } from '../../entities/student-answer';

@Component({
    selector: 'question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent extends BaseComponent implements OnInit {

    selected: number;
    questionsObj: Questions;

    studentAnswersObj: StudentAnswers;

    isLoaded: boolean;

    expectedTimeInMillis: number;

    timer: any;
    timePasswedInMillis: number;

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
        , private standardService: StandardService
        , router: Router
    ) {
        super(router);
    }

    ngOnInit() {
        this.selected = 0;
        this.isLoaded = false;
        this.jsonGetterService.getJSON('./assets/json/questions.json')
            .subscribe((subscription: Questions) => {
                this.questionsObj = subscription;
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

                this.timer = setInterval(() => {
                    this.timePasswedInMillis = new Date().getTime() - this.studentAnswersObj.startTime;
                });

                this.isLoaded = true;
            });
    }

    changeQuestion(qIndex: number) {
        this.selected = qIndex;
    }

    markAnswer(aIndex: number) {
        this.studentAnswer.answers[aIndex] = !this.studentAnswer.answers[aIndex];
    }

    getCronometer(): string {
        const timeAsDate = new Date(this.timePasswedInMillis);
        const minutes = timeAsDate.getMinutes();
        const seconds = timeAsDate.getSeconds();
        return (timeAsDate.getHours() - 1)
            + ' : ' + (minutes < 10 ? '0' : '') + minutes
            + ' : ' + (seconds < 10 ? '0' : '') + seconds;
    }

    save() {
        const studentAnswersObj = this.studentAnswersObj;
        const endTime = (new Date()).getTime();
        studentAnswersObj.endTime = endTime;
        const str = JSON.stringify(studentAnswersObj);
        saveAs(new Blob([str], { type: 'text/csv;charset=UTF-8' }), this.studentAnswersObj.name + '.json');
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
}
