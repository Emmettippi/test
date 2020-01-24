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

    constructor(
        router: Router
    ) {
        super(router);
    }

    ngOnInit() {
    }

    onClickToNavigate(type: 'start' | 'read' | 'admin') {
        switch (type) {
            case 'admin':
                if (true || this.password === 'electronpassword') {
                    this.navigateTo('admin-tools');
                }
                break;
            case 'read':
                break;
            case 'start':
                this.navigateTo('question');
        }
    }
}
