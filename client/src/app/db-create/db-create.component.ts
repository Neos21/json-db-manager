import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) { }
  
  /**
   * 画面初期表示時
   */
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      dbName       : ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      dbDisplayName: ['', [Validators.required]]
      // 子コンポーネント `column-form` にて、FormArray `columns` を追加する
    });
  }
  
  /**
   * 「Create」ボタン押下時
   */
  public async onSubmit(): Promise<void> {
    try {
      this.errorMessage = '';
      const data = this.form.value;
      const result: any = await this.httpClient.post(`${environment.apiRootPath}/db`, data).toPromise();
      console.log(result);
      // TODO : 一覧に遷移するか
    }
    catch(error) {
      console.warn('Create DB : Failed', error, error.error);
      this.errorMessage = error.error || error.toString();
    }
  }
}
