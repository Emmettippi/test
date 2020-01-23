import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { QuestionComponent } from './components/question/question.component';
import { JumperComponent } from './components/jumper/jumper.component';
import { JsonGetterService } from './services/json-getter.service';
import { QuestionGeneratorComponent } from './components/question-generator/question-generator.component';
import { IdGetterService } from './services/id-getter.service';

import { routes } from './app.route';

@NgModule({
    declarations: [
        AppComponent
        , QuestionComponent
        , JumperComponent
        , QuestionGeneratorComponent
    ],
    imports: [
        BrowserModule
        , FormsModule
        , RouterModule.forRoot(routes, { enableTracing: true })
    ],
    providers: [
        HttpClient
        , JsonGetterService
        , IdGetterService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
