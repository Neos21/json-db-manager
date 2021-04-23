import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

/** DB 作成画面 */
@Component({
  selector: 'app-db-create',
  templateUrl: './db-create.component.html',
  styleUrls: ['./db-create.component.scss']
})
export class DbCreateComponent implements OnInit {
  /** 登録フォーム */
  public form: FormGroup;
  /** 「Create」ボタン押下後のエラーメッセージ */
  public errorMessage: string = '';
  /** API 通信中かどうか */
  public isSubmitting: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) { }
  
  /**
   * 画面初期表示時
   */
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      dbName       : ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      dbDisplayName: ['', [Validators.required]]
      // 子コンポーネント `column-form` にて FormArray `columns` を追加する
    });
  }
  
  /**
   * 「Create」ボタン押下時
   */
  public async onSubmit(): Promise<void> {
    try {
      this.errorMessage = '';
      this.isSubmitting = true;
      const data = this.form.getRawValue();  // Disabled な項目も含めて取得する
      const result: any = await this.httpClient.post(`${environment.apiRootPath}/db`, data).toPromise();
      console.log('Create DB : Success', result);
      this.router.navigate(['/home'], { queryParams: { successMessage: 'DB Created.' } });  // DB 一覧画面に遷移する
    }
    catch(error) {
      console.error('Create DB : Failed', error);
      this.errorMessage = error.error?.error || error.error || error.toString();
      this.isSubmitting = false;
    }
  }
}
