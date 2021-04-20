import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

/** ログイン済かどうかチェックするガード */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /** ログイン試行したかどうか (セッションの有無) */
  public isLogined: boolean = false;
  
  constructor(private router: Router, private authService: AuthService) { }
  
  /**
   * 遷移前の認証チェック
   * 
   * @param _route ActivatedRouteSnapshot
   * @param _state RouterStateSnapshot
   * @returns 遷移してよければ `true`、遷移させたくなければ `false` を返す
   */
  public canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // ログイン済・セッション設定ができているようなので遷移を許可する
    if(this.isLogined) return true;
    
    return this.authService.autoReLogin()
      .then(() => {
        // 認証成功・対象の画面への遷移を許可する
        this.isLogined = true;
        return true;
      })
      .catch((error) => {
        console.warn('Auth Guard : Failed To Auto Re Login, Go To Login Page', error);
        this.isLogined = false;
        this.router.navigate(['/login']);
        return false;
      });
  }
}
