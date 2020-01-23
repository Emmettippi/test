import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'entry',
    templateUrl: './entry.component.html',
    styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
    today: Date;
    password: string;
    constructor(
        private router: Router
        , private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.today = new Date();
    }

    onClickToNavigate(type: 'start' | 'read' | 'admin') {
        switch (type) {
            case 'admin':
                if (this.password === 'electronpassword') {
                    this.navigateTo('admin-tools');
                }
                break;
            case 'read':
                break;
            case 'start':
                this.navigateTo('question');
        }
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }
}
