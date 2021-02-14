import { StandardService } from './../../services/standard.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../../services/basic.component';
import { JsonGetterService } from '../../services/json-getter.service';

import { QuestionAnswer, FinalMark } from '../../entities/final-mark';

type MultiCheck = 'correct' | 'avoided' | 'wrong';

@Component({
    selector: 'results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})
export class ResultsComponent extends BaseComponent implements OnInit {

    finalMark: FinalMark;

    finalMarkFile: File;

    get adjustment(): number {
        return this.finalMark.adjustment;
    }

    get total(): number {
        return this.finalMark.total;
    }

    get points(): number {
        return this.finalMark.points + this.adjustment;
    }

    get mark(): number {
        return this.finalMark.mark;
    }

    get teahcerExtraNotes(): string {
        return this.finalMark.teahcerExtraNotes;
    }

    get questionsAndAnswers(): QuestionAnswer[] {
        return this.finalMark.questionsAndAnswers;
    }

    get startTime(): number {
        return this.finalMark.startTime;
    }

    get endTime(): number {
        return this.finalMark.endTime;
    }

    get expectedTime(): number {
        return this.finalMark.expectedTime;
    }

    constructor(
        private jsonGetterService: JsonGetterService
        , standardService: StandardService
        , router: Router
    ) {
        super(router, standardService);
    }

    ngOnInit() {
    }

    loadMarkFile(event: any) {
        this.finalMarkFile = event.target.files.item(0);
    }

    import() {
        this.jsonGetterService.getJSON(this.finalMarkFile['path'])
            .subscribe((subscription: FinalMark) => {
                this.finalMark = subscription;
            }, (error) => {
                console.log(error);
            });
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

    isNotes(qIndex): boolean {
        return !!this.questionsAndAnswers[qIndex].studentAnswer.notes;
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
        if (this.questionsAndAnswers[qIndex].answer.values[aIndex] > 0
            && this.questionsAndAnswers[qIndex].studentAnswer.answers[aIndex]) {
            correct = 'correct';
        } else if (this.questionsAndAnswers[qIndex].answer.values[aIndex] <= 0
            && !this.questionsAndAnswers[qIndex].studentAnswer.answers[aIndex]) {
            correct = 'avoided';
        }
        return correct;
    }
}
