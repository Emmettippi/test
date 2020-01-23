import { Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { QuestionGeneratorComponent } from './components/question-generator/question-generator.component';
import { QuestionComponent } from './components/question/question.component';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent
    },
    {
        path: 'admin-tools',
        component: QuestionGeneratorComponent
    },
    // {
    //     path: 'read',
    //     component: ExternalRedirectComponent
    // },
    {
        path: 'question/:id',
        component: QuestionComponent
    },
    {
        path: 'question',
        component: QuestionComponent
    }
];
