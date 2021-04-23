import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';

/** Login 画面 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /** ログインフォーム */
  public form: FormGroup;
  /** 「Login」ボタン押下後のエラーメッセージ */
  public errorMessage: string = '';
  /** API 通信中かどうか */
  public isSubmitting: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private router: Router, private authGuard: AuthGuard, private authService: AuthService) { }
  
  /**
   * 画面初期表示時
   */
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    window.localStorage.removeItem('auth');  // ログイン画面に遷移した時はログインユーザ情報を削除しておく
    this.authGuard.isLogined = false;  // ログイン処理未済の状態としてガードを設定しておく
  }
  
  /**
   * HTML 側でユーザ名の Control を取得するための Getter
   */
  public get userName(): AbstractControl {
    return this.form.get('userName');
  }
  
  /**
   * HTML 側でパスワードの Control を取得するための Getter
   */
  public get password(): AbstractControl {
    return this.form.get('password');
  }
  
  /**
   * 「Login」ボタン押下時
   */
  public async onSubmit(): Promise<void> {
    try {
      this.errorMessage = '';
      this.isSubmitting = true;
      await this.authService.login(this.userName.value, this.password.value);
      this.authGuard.isLogined = true;  // 成功・二重にログイン処理がされないようガードを設定しておく (AuthService 内でやろうとすると AuthGuard と循環依存するためココで行う)
      this.router.navigate(['/home'], { queryParams: { successMessage: 'Login Succeeded.' } });
    }
    catch(error) {
      console.error('Login : Failed', error);
      this.errorMessage = error.error?.error || error.error || error.toString();  // ココだけ Passport 認証によるレスポンスなので、基本は `error.error` にメッセージが直接入っている
      this.isSubmitting = false;
    }
  }
}
