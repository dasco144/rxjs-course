import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';

import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    ngOnInit() {
        const http$ = createHttpObservable('/api/courses');

        const courses$ = http$
            .pipe(
                tap(() => console.log('HTTP request executed')),
                map(res => Object.values(res['payload'])),
                shareReplay<Course[]>(),
                retryWhen(errors => errors.pipe(
                    delayWhen(() => timer(2000))
                ))
            );

        this.beginnerCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === 'BEGINNER'))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category === 'ADVANCED'))
            );
    }

}
