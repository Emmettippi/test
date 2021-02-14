import { StandardService } from './../../services/standard.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../../services/basic.component';

@Component({
    selector: 'rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css']
})
export class RulesComponent extends BaseComponent implements OnInit {

    constructor(
        router: Router
        , standardService: StandardService
    ) {
        super(router, standardService);
    }

    ngOnInit() {

    }
}
