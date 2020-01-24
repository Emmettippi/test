import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

import { JsonGetterService } from 'src/app/services/json-getter.service';
import { BaseComponent } from 'src/app/services/basic.component';

import { Question } from 'src/app/entities/Question';
import { StudentAnswer } from 'src/app/entities/student-answer';

@Component({
    selector: 'question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent extends BaseComponent implements OnInit {

    selected: number;
    questions: Question[];

    studentAnswers: StudentAnswer[];

    isLoaded: boolean;

    get question(): Question {
        return this.questions[this.selected];
    }

    get studentAnswer(): StudentAnswer {
        return this.studentAnswers[this.selected];
    }

    constructor(
        private jsonGetterService: JsonGetterService
        , router: Router
    ) {
        super(router);
    }

    ngOnInit() {
        this.selected = 0;
        this.isLoaded = false;
        this.jsonGetterService.getJSON('./assets/json/questions.json')
            .subscribe((subscription: Array<Question>) => {
                this.questions = subscription;
                this.studentAnswers = new Array<StudentAnswer>();
                for (const q of this.questions) {
                    const sa = new StudentAnswer(q.id);
                    const answers = new Array<boolean>();
                    for (const a of q.answers) {
                        answers.push(false);
                    }
                    sa.answers = answers;

                    this.studentAnswers.push(sa);
                }

                this.isLoaded = true;
            });
    }

    changeQuestion(qIndex: number) {
        this.selected = qIndex;
    }

    save() {
        const str = JSON.stringify(this.studentAnswers);
        saveAs(new Blob([str], { type: 'text/csv;charset=UTF-8' }), 'student.json');
    }

    back() {
        if(confirm('Attenzione! Tornando indietro perderai tutte le risposte. Continuare?')) {
            this.navigateTo('/entry');
        }
    }
}
