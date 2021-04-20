import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

/** 認証サービス */
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private httpClient: HttpClient) { }
  
  /**
   * API サーバと通信してログインする
   * 
   * @param userName ユーザ名
   * @param password パスワード
   */
  public async login(userName: string, password: string): Promise<void> {
    try {
      const auth = { userName, password };
      const result: any = await this.httpClient.post(`${environment.apiRootPath}/login`, auth).toPromise();
      console.log('Auth Service : Login : Success', result);
      window.localStorage.setItem('auth', JSON.stringify(auth));  // 成功・LocalStorage にログイン情報を保存する
    }
    catch(error) {
      console.error('Auth Service : Login : Error', error);
      throw error;
    }
  }
  
  /**
   * LocalStorage のデータを利用して自動で再ログインする
   */
  public async autoReLogin(): Promise<void> {
    const rawAuth = window.localStorage.getItem('auth');
    if(!rawAuth) throw new Error('Auth Service : Auto Re Login : Error : LocalStorage Is Empty');
    try {
      const auth = JSON.parse(rawAuth);
      await this.login(auth.userName, auth.password);
      console.log('Auth Service : Auto Re Login : Success');
    }
    catch(error) {
      console.error('Auth Service : Auto Re Login : Error', error);
      throw error;
    }
  }
}
