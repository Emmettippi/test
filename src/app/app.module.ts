import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { EntryComponent } from './components/entry/entry.component';
import { QuestionComponent } from './components/question/question.component';
import { QuestionGeneratorComponent } from './components/question-generator/question-generator.component';
import { CheckAnswersComponent } from './components/check-answer/check-answer.component';

import { JsonGetterService } from './services/json-getter.service';
import { StandardService } from './services/standard.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent
        , EntryComponent
        , QuestionComponent
        , QuestionGeneratorComponent
        , CheckAnswersComponent
    ],
    imports: [
        BrowserModule
        , FormsModule
        , AppRoutingModule
        , HttpClientModule
    ],
    providers: [
        JsonGetterService
        , StandardService
    ],
    exports: [
        RouterModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
