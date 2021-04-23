import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { environment } from '../../environments/environment';
import { ColumnData } from '../shared/classes/column-data';

/** DB 表示・編集画面 */
@Component({
  selector: 'app-db-table',
  templateUrl: './db-table.component.html',
  styleUrls: ['./db-table.component.scss']
})
export class DbTableComponent implements OnInit {
  /** 表示対象の DB 名 */
  public dbName: string = '';
  
  /** 成功メッセージ (少ししたら非表示にする) */
  public successMessage: string = '';
  /** 成功メッセージを非表示にする (コレにより CSS クラスを付与して非表示のアニメーションを発生させる) */
  public isHideSuccessMessage: boolean = false;
  /** ロード中かどうか */
  public isLoading: boolean = true;
  /** エラーメッセージ */
  public errorMessage: string = '';
  
  /** 取得したままの DB 全量 */
  public originalDb: Db = null;
  /** テーブルのカラム定義 */
  public columns: ColumnData[] = [];
  /** テーブルのカラム名称の定義 */
  public displayedColumnNames: Array<string> = [];
  /** テーブルのデータ */
  public dataSource: MatTableDataSource<any> = null;
  /** フォーム部品 */
  public form: FormGroup;
  /** ID のシーケンス値 */
  public seq: number = 0;
  
  constructor(private activatedRoute: ActivatedRoute, private httpClient: HttpClient, private formBuilder: FormBuilder) { }
  
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
      this.isHideSuccessMessage = false;
      const body = {
        db        : this.form.getRawValue(),
        originalDb: this.originalDb,
        seq       : this.seq
      };
      const result: any = await this.httpClient.put(`${environment.apiRootPath}/db-data`, body).toPromise();
      console.log('Update DB Data : Success', result);
      this.successMessage = 'DB Data Updated.';
      setTimeout(() => { this.isHideSuccessMessage = true; }, 4000);
    }
    catch(error) {
      console.error('Update DB Data : Failed', error);
      this.errorMessage = error.error?.error || error.error || error.toString();
    }
  }
  
  /**
   * 指定の行を1行上げる
   * 
   * @param rowIndex ボタンをクリックした行の添字
   */
  public onUp(rowIndex: number): void {
    const data = (this.form.get('data') as FormArray);
    const newValues = this.swap(data.value, rowIndex, rowIndex - 1);
    data.setValue(newValues);
  }
  
  /**
   * 指定の行を1行下げる
   * 
   * @param rowIndex ボタンをクリックした行の添字
   */
  public onDown(rowIndex: number): void {
    const data = (this.form.get('data') as FormArray);
    const newValues = this.swap(data.value, rowIndex, rowIndex + 1);
    data.setValue(newValues);
  }
  
  /**
   * 指定の行の下に空行を追加する
   * 
   * @param rowIndex ボタンをクリックした行の添字
   */
  public onAdd(rowIndex: number): void {
    const newDataRow = this.columns.reduce((formGroupData, column) => {
      if(column.type === 'id') {
        this.seq = this.seq + 1;
        formGroupData[column.name] = [this.seq, [Validators.required]];
      }
      else if(column.required) {
        formGroupData[column.name] = ['', [Validators.required]];
      }
      else {
        formGroupData[column.name] = [''];
      }
      return formGroupData;
    }, {});
    // フォーム部品を追加する
    (this.form.get('data') as FormArray).insert(rowIndex + 1, this.formBuilder.group(newDataRow));
    // 表示用の配列にも同様に追加し、強制再描画させる
    this.dataSource.data.splice(rowIndex + 1, 0, newDataRow);
    (this.dataSource as any)._data?.next(this.dataSource.data);
  }
  
  /**
   * 指定の行を削除する
   * 
   * @param rowIndex ボタンをクリックした行の添字
   */
  public onRemove(rowIndex: number): void {
    // フォーム部品を削除する
    (this.form.get('data') as FormArray).removeAt(rowIndex);
    // 表示用の配列も同様に削除し、強制再描画させる
    this.dataSource.data.splice(rowIndex, 1);
    (this.dataSource as any)._data?.next(this.dataSource.data);
  }
  
  /**
   * DB を取得する
   */
  private async getDb(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.originalDb = null;
    try {
      const result: any = await this.httpClient.get(`${environment.apiRootPath}/db/${this.dbName}`, { params: { dbName: this.dbName }}).toPromise();
      this.originalDb = result.result;  // 控えておく
      
      this.createColumns();  // カラム定義を作る
      this.dataSource = new MatTableDataSource<any>([...this.originalDb.data]);  // データ定義を用意する
      this.seq = this.originalDb.seq;
      this.createForm();  // カラム定義とデータ定義を元にフォーム部品を作る
    }
    catch(error) {
      console.error('Get DB : Failed', error);
      this.errorMessage = error.error?.error || error.error || error.toString();
    }
    finally {
      this.isLoading = false;
    }
  }
  
  /**
   * `this.originalDb` を元にカラム定義を作る
   */
  private createColumns(): void {
    this.columns = [
      ...this.originalDb.columns,
      { name: '_system-up_'    , originalName: '_system-up_'    , displayName: 'Up'    , type: '_system_', required: false },
      { name: '_system-down_'  , originalName: '_system-down_'  , displayName: 'Down'  , type: '_system_', required: false },
      { name: '_system-add_'   , originalName: '_system-add_'   , displayName: 'Add'   , type: '_system_', required: false },
      { name: '_system-remove_', originalName: '_system-remove_', displayName: 'Remove', type: '_system_', required: false },
    ];
    this.displayedColumnNames = this.columns.map((column) => column.name);
  }
  
  /**
   * `this.originalDb` と `this.dataSource` からフォームを新規作成する
   */
  private createForm(): void {
    this.form = this.formBuilder.group({
      dbName       : [this.originalDb.dbName       , [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      dbDisplayName: [this.originalDb.dbDisplayName, [Validators.required]],
      data         : this.formBuilder.array([])
    });
    
    const formData = this.form.get('data') as FormArray;
    this.dataSource.data.forEach((dataRow) => {
      const formGroup = this.columns.reduce((formGroupData, column) => {
        formGroupData[column.name] = (column.required) ? [dataRow[column.name], [Validators.required]] : [dataRow[column.name]];
        return formGroupData;
      }, {});
      formData.push(this.formBuilder.group(formGroup));
    });
  }
  
  /**
   * 配列の要素を入れ替える
   * 
   * @param formArrayValues `FormArray#value()` の配列
   * @param indexA 要素を入れ替える一方の添字
   * @param indexB 要素を入れ替えるもう一方の添字
   * @returns 要素を入れ替えた配列
   */
  private swap(formArrayValues: Array<any>, indexA: number, indexB: number): Array<any> {
    const newFormArrayValues = [...formArrayValues];
    const tempRow = newFormArrayValues[indexA];
    newFormArrayValues[indexA] = newFormArrayValues[indexB];
    newFormArrayValues[indexB] = tempRow;
    return newFormArrayValues;
  }
}

/** DB */
interface Db {
  dbName: string;
  dbDisplayName: string;
  seq: number;
  columns: ColumnData[];
  data: Array<any>;
}
