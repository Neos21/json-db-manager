import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../environments/environment';
import { DbDeleteConfirmDialogComponent } from './db-delete-confirm-dialog.component';

/** Home 画面 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /** ロード中かどうか */
  public isLoading: boolean = true;
  /** エラーメッセージ */
  public errorMessage: string = '';
  /** DB リスト */
  public dbList: Array<string> = [];
  
  constructor(private httpClient: HttpClient, private matDialog: MatDialog) { }
  
  /**
   * 画面初期表示時
   */
  public async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.dbList = [];
    try {
      const result: any = await this.httpClient.get(`${environment.apiRootPath}/db`).toPromise();
      this.dbList = result.result.sort();
    }
    catch(error) {
      console.error('DB List : Error', error);
      this.errorMessage = error.error || error.toString();
    }
    finally {
      this.isLoading = false;
    }
  }
  
  public openDeleteConfirmDialog(dbName: string): void {
    const dialogRef = this.matDialog.open(DbDeleteConfirmDialogComponent, {
      data: { dbName }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(!result) return console.log('DB Delete Confirm Dialog Was Closed');
      console.log('TODO : Delete The DB', result);
    });
  }
}
