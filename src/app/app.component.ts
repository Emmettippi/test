import { StandardService } from './services/standard.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    get darkTheme(): boolean {
        return this.standardService.darkTheme;
    }

    set darkTheme(value: boolean) {
        this.standardService.darkTheme = value;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private standardService: StandardService
    ) { }

    ngOnInit() {
        this.router.navigate(['/entry']);
    }
}
