import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { environment } from '../../environments/environment';

import Db from '../shared/classes/db';
import ColumnData from '../shared/classes/column-data';

/** カラム編集画面 */
@Component({
  selector: 'app-column-edit',
  templateUrl: './column-edit.component.html',
  styleUrls: ['./column-edit.component.scss']
})
export class ColumnEditComponent implements OnInit {
  /** 表示対象の DB 名 */
  public dbName: string = '';
  /** 表示対象の DB 論理名 */
  public dbDisplayName: string = '';
  
  /** ロード中かどうか */
  public isLoading: boolean = true;
  /** 編集対象のカラム定義 */
  public columns: Array<ColumnData> = null;
  /** 編集フォーム */
  public form: FormGroup = null;
  /** 「Update」ボタン押下後のエラーメッセージ */
  public errorMessage: string = '';
  /** API 通信中かどうか */
  public isSubmitting: boolean = false;
  
  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) { }
  
  /**
   * 画面初期表示時
   */
  public ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(async (params: ParamMap) => {
      const dbName = params.get('dbName');
      if(!dbName) {
        console.error('Query Parameter [DB Name] Does Not Provided', dbName);
        this.errorMessage = 'Query Parameter [DB Name] Does Not Provided';
        this.isLoading = false;
        return;
      }
      
      this.dbName = dbName;
      await this.getDb();
    });
  }
  
  /**
   * 「Update」ボタン押下時
   */
  public async onSubmit(): Promise<void> {
    try {
      this.errorMessage = '';
      this.isSubmitting = true;
      const data = this.form.getRawValue();  // Disabled な項目も含めて取得する
      const result: any = await this.httpClient.put(`${environment.apiRootPath}/db/${this.dbName}/column`, data).toPromise();
      console.log('Update DB Columns : Success', result);
      this.router.navigate(['/home'], { queryParams: { successMessage: 'DB Columns Updated.' } });  // DB 一覧画面に遷移する
    }
    catch(error) {
      console.error('Update DB Columns : Failed', error);
      this.errorMessage = error.error?.error || error.error || error.toString();
      this.isSubmitting = false;
    }
  }
  
  /**
   * DB を取得する
   */
  private async getDb(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.dbDisplayName = '';
    this.columns = null;
    this.form = null;
    try {
      const result: any = await this.httpClient.get(`${environment.apiRootPath}/db/${this.dbName}`, { params: { dbName: this.dbName }}).toPromise();
      const originalDb: Db = result.result;
      this.dbDisplayName = originalDb.dbDisplayName;
      this.columns = originalDb.columns;
      // フォームを用意する
      this.form = this.formBuilder.group({
        dbName: [this.dbName, [Validators.required]]
        // 子コンポーネント `column-form` にて FormArray `columns` を追加する
      });
    }
    catch(error) {
      console.error('Get DB : Failed', error);
      this.errorMessage = error.error?.error || error.error || error.toString();
      this.dbName = 'Edit Columns : Error';
    }
    finally {
      this.isLoading = false;
    }
  }
}
