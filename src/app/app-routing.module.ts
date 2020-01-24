import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EntryComponent } from "./components/entry/entry.component";
import { QuestionGeneratorComponent } from "./components/question-generator/question-generator.component";
import { QuestionComponent } from "./components/question/question.component";
import { CheckAnswersComponent } from "./components/check-answer/check-answer.component";

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
                path: "check",
                component: CheckAnswersComponent
            },
            // {
            //     path: 'read',
            //     component: ExternalRedirectComponent
            // },
            {
                path: "question",
                component: QuestionComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
