import { Router } from "@angular/router";

export class BaseComponent {
    readonly TODAY = new Date();

    constructor(
        private router: Router
    ) { }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }
}