import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { environment } from '../../environments/environment';

/** DB 表示・編集画面 */
@Component({
  selector: 'app-db-table',
  templateUrl: './db-table.component.html',
  styleUrls: ['./db-table.component.scss']
})
export class DbTableComponent implements OnInit {
  /** 表示対象の DB 名 */
  public dbName: string = '';
  /** DB 論理名 (取得でき次第タイトルにする) */
  public dbDisplayName: string = '';
  
  /** 成功メッセージ (少ししたら非表示にする) */
  public successMessage: string = '';
  /** 成功メッセージを非表示にする (コレにより CSS クラスを付与して非表示のアニメーションを発生させる) */
  public isHideSuccessMessage: boolean = false;
  /** ロード中かどうか */
  public isLoading: boolean = true;
  /** エラーメッセージ */
  public errorMessage: string = '';
  
  public test: any = null;  // TODO : 取得したデータそのままと、動的フォームを作っていく
  
  constructor(private activatedRoute: ActivatedRoute, private httpClient: HttpClient) { }
  
  public ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(async (params: ParamMap) => {
      this.dbName = params.get('dbName');
      // TODO : パラメータなしの場合
      await this.getDb();
    });
  }
  /**
   * DB を取得する
   */
  private async getDb(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.test = null;
    try {
      const result: any = await this.httpClient.get(`${environment.apiRootPath}/db/${this.dbName}`, { params: { dbName: this.dbName }}).toPromise();
      this.dbDisplayName = result.result.dbDisplayName;
      this.test = result.result;
    }
    catch(error) {
      console.error('Get DB : Failed', error);
      this.errorMessage = error.error?.error || error.error || error.toString();
    }
    finally {
      this.isLoading = false;
    }
  }
}
