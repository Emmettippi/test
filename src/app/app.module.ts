import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { EntryComponent } from './components/entry/entry.component';
import { QuestionComponent } from './components/question/question.component';
import { JumperComponent } from './components/jumper/jumper.component';
import { QuestionGeneratorComponent } from './components/question-generator/question-generator.component';

import { JsonGetterService } from './services/json-getter.service';
import { IdGetterService } from './services/id-getter.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent
        , EntryComponent
        , QuestionComponent
        , JumperComponent
        , QuestionGeneratorComponent
    ],
    imports: [
        BrowserModule
        , FormsModule
        , AppRoutingModule
        , HttpClientModule
    ],
    providers: [
        JsonGetterService
        , IdGetterService
    ],
    exports: [
        RouterModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
