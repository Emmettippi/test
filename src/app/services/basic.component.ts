import { Router } from '@angular/router';

export class BaseComponent {
    readonly TODAY = new Date();

    constructor(
        private router: Router
    ) { }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    hash(s: string): number {
        let hash = 0;
        if (s) {
            for (let i = 0; i < s.length; i++) {
                hash = Math.imul(31, hash) + s.charCodeAt(i) | 0;
            }
        }
        return hash;
    }
}
