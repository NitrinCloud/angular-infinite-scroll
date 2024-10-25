import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ], imports: [BrowserModule,
        InfiniteScrollModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
