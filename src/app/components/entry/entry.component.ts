import { StandardService } from './../../services/standard.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../../services/basic.component';
import { JsonGetterService } from 'src/app/services/json-getter.service';
import { Questions } from 'src/app/entities/question';

@Component({
    selector: 'entry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.css']
})
export class EntryComponent extends BaseComponent implements OnInit {
    password: string;

    readonly HASH_PASSWORD = -194417027;

    get standardServicePub() {
        return this.standardService;
    }

    constructor(
        protected router: Router
        , protected standardService: StandardService
        , private jsonService: JsonGetterService
    ) {
        super(router, standardService);
    }

    ngOnInit() {
    }

    loadQFile(event: any) {
        const file = event.target.files.item(0);
        this.jsonService.readFileAsJson(file).then((jackson) => {
            this.standardService.questions = <Questions>jackson;
        });
    }

    onClickToNavigate(type: 'start' | 'read' | 'admin' | 'check' | 'results') {
        const admin = this.hash(this.password) === this.HASH_PASSWORD;
        switch (type) {
            case 'admin':
                if (admin) {
                    this.navigateTo('admin-tools');
                }
                break;
            case 'read':
                this.navigateTo('read');
                break;
            case 'start':
                this.navigateTo('question');
                break;
            case 'check':
                if (admin) {
                    this.navigateTo('check');
                }
                break;
            case 'results':
                this.navigateTo('results');
                break;
        }
    }
}
