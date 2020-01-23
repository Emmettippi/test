import { Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { QuestionGeneratorComponent } from './components/question-generator/question-generator.component';
import { QuestionComponent } from './components/question/question.component';
import { EntryComponent } from './components/entry/entry.component';

const subroutes: Routes = [
    {
        path: 'entry',
        component: EntryComponent,
        outlet: 'content'
    },
    {
        path: 'admin-tools',
        component: QuestionGeneratorComponent,
        outlet: 'content'
    },
    // {
    //     path: 'read',
    //     component: ExternalRedirectComponent
    // },
    {
        path: 'question/:id',
        component: QuestionComponent,
        outlet: 'content'
    },
    {
        path: 'question',
        component: QuestionComponent,
        outlet: 'content'
    }
];

export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            ...subroutes
        ]
    }
];
