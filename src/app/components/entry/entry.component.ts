import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../../services/basic.component';

@Component({
    selector: 'entry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.css']
})
export class EntryComponent extends BaseComponent implements OnInit {
    password: string;

    readonly HASH_PASSWORD = -194417027;

    constructor(
        router: Router
    ) {
        super(router);
    }

    ngOnInit() {
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
