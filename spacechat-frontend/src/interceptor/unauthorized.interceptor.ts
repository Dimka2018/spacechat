import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest, HttpStatusCode
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(public router: Router) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError(error => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['welcome'])
        }
        return throwError(error.message);
      })
    );
  }
}
