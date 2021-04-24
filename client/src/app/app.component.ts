import { Component } from '@angular/core';

import { AuthGuard } from './auth.guard';

/** ルートコンポーネント */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private authGuard: AuthGuard) { }
  
  /**
   * ログインしているかどうか (再ログインボタンを表示するかどうか)
   * 
   * @return フロントエンドでログイン処理を通っていれば `true`
   */
  public isLogined(): boolean {
    return this.authGuard.isLogined;
  }
}
