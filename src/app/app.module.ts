import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ], imports: [BrowserModule,
        InfiniteScrollDirective], providers: [provideHttpClient(withInterceptorsFromDi(), withFetch()), provideClientHydration()] })
export class AppModule {}
