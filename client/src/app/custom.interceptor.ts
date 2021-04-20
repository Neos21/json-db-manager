import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

/** クッキーによるセッション管理を有効にするためのインタセプタ */
@Injectable()
export class CustomInterceptor implements HttpInterceptor {
/**
   * クッキーによるセッション管理とリクエストタイムアウトを有効にする
   * 
   * @param request リクエスト
   * @param next ハンドラ
   * @return HttpEvent の Observable
   */
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({ withCredentials: true });
    return next.handle(request).pipe(timeout(15000));
  }
}
