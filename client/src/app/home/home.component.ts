import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../environments/environment';
import { DbDeleteConfirmDialogComponent } from './db-delete-confirm-dialog.component';

/** Home : DB 一覧画面 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /** 成功メッセージ (少ししたら非表示にする) */
  public successMessage: string = '';
  /** 成功メッセージを非表示にする (コレにより CSS クラスを付与して非表示のアニメーションを発生させる) */
  public isHideSuccessMessage: boolean = false;
  /** ロード中かどうか */
  public isLoading: boolean = true;
  /** エラーメッセージ */
  public errorMessage: string = '';
  /** DB リスト */
  public dbList: Array<string> = [];
  
  constructor(private activatedRoute: ActivatedRoute, private httpClient: HttpClient, private matDialog: MatDialog) { }
  
  /**
   * 画面初期表示時
   */
  public async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParamMap.subscribe(async (params: ParamMap) => {
      const successMessage = params.get('successMessage');
      if(!successMessage) return;
      this.successMessage = successMessage;
      setTimeout(() => { this.isHideSuccessMessage = true; }, 4000);  // 成功メッセージを非表示にする CSS クラスを付与する
    });
    await this.getDbList();
  }
  
  /**
   * DB を削除するか確認のダイアログをを表示する
   * 
   * @param dbName 削除対象となる DB 物理名
   */
  public openDeleteConfirmDialog(dbName: string): void {
    const dialogRef = this.matDialog.open(DbDeleteConfirmDialogComponent, {
      data: { dbName }
    });
    dialogRef.afterClosed().subscribe(async (isDeleteConfirmed) => {
      if(!isDeleteConfirmed) return console.log('DB Delete Confirm Dialog Was Closed. Nothing To Do');
      await this.deleteDb(dbName);  // DB を削除し一覧を再描画する
    });
  }
  
  /**
   * DB リストを取得する
   */
  private async getDbList(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.dbList = [];
    try {
      const result: any = await this.httpClient.get(`${environment.apiRootPath}/db`).toPromise();
      this.dbList = result.result.sort();
    }
    catch(error) {
      console.error('List DB : Failed', error);
      this.errorMessage = error.error?.error || error.error || error.toString();
    }
    finally {
      this.isLoading = false;
    }
  }
  
  /**
   * DB を削除し一覧を再描画する
   * 
   * @param dbName 削除対象の DB 物理名
   */
  private async deleteDb(dbName: string): Promise<void> {
    this.errorMessage = '';
    try {
      const result: any = await this.httpClient.delete(`${environment.apiRootPath}/db`, { params: { dbName } }).toPromise();
      console.log('Delete DB : Success', result);
      this.successMessage = 'DB Deleted.';
      this.isHideSuccessMessage = false;
      setTimeout(() => { this.isHideSuccessMessage = true; }, 4000);
      await this.getDbList();  // DB リストを再取得する
    }
    catch(error) {
      console.error('Delete DB : Failed', error);
      this.errorMessage = error.error?.error || error.error || error.toString();
    }
  }
}
