import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private cacheService: CacheService) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error?.error?.message) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  public get(reqObj: any) {
    reqObj.params.network = this.cacheService.get('network');
    const options = { params: reqObj.params }
    return this.http.get(`${environment.HOST}${reqObj.uri}`, options).pipe(catchError(this.handleError));
  }

  public post(reqObj: any) {
    reqObj.body.network = this.cacheService.get('network');
    const options = { params: reqObj.params ? reqObj.params : {} }
    return this.http.post(`${environment.HOST}${reqObj.uri}`, reqObj.body, options).pipe(catchError(this.handleError));
  }
}
