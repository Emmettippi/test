import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntryComponent } from './components/entry/entry.component';
import { QuestionGeneratorComponent } from './components/question-generator/question-generator.component';
import { QuestionComponent } from './components/question/question.component';
import { CheckAnswersComponent } from './components/check-answer/check-answer.component';
import { ResultsComponent } from './components/results/results.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: "entry",
                component: EntryComponent
            },
            {
                path: "admin-tools",
                component: QuestionGeneratorComponent
            },
            {
                path: "question",
                component: QuestionComponent
            },
            {
                path: "check",
                component: CheckAnswersComponent
            },
            {
                path: "results",
                component: ResultsComponent
            }
            // {
            //     path: 'read',
            //     component: ExternalRedirectComponent
            // },
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
