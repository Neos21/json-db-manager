import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';

import { ColumnData } from '../shared/classes/column-data';

/** カラム定義フォーム */
@Component({
  selector: 'app-column-form',
  templateUrl: './column-form.component.html',
  styleUrls: ['./column-form.component.scss']
})
export class ColumnFormComponent implements OnInit {
  /** カラム定義フォーム */
  @Input() public columnForm: FormGroup;
  /** カラム定義データ */
  @Input() public dataSource: MatTableDataSource<ColumnData>;
  /** カラム定義1行あたりの入力項目 */
  public displayedColumns: Array<string> = ['name', 'displayName', 'type', 'required', 'row-up', 'row-down', 'row-add', 'row-remove'];
  
  constructor(private formBuilder: FormBuilder) { }
  
  /**
   * 画面初期表示時
   */
  public ngOnInit(): void {
    this.columnForm.addControl('columns', this.formBuilder.array([]));  // `this.columnForm` に代入すると親コンポーネントのフォームを上書きしておかしくなる
    
    if(this.dataSource == null) {  // TODO : 新規作成時のデータを定義しておく・更新時は別途取得する
      const initialColumns: ColumnData[] = [
        { name: 'id'        , originalName: 'id'        , displayName: 'ID'        , type: 'id'  , required: true  },
        { name: 'name'      , originalName: 'name'      , displayName: 'Name'      , type: 'text', required: true  },
        { name: 'created-at', originalName: 'created-at', displayName: 'Created At', type: 'date', required: false },
        { name: 'updated-at', originalName: 'updated-at', displayName: 'Updated At', type: 'date', required: false }
      ];
      this.dataSource = new MatTableDataSource<ColumnData>(initialColumns);
    }
    
    // データを元にフォーム部品を作る
    this.dataSource.data.forEach((columnData) => {
      (this.columnForm.get('columns') as FormArray).push(this.createColumnRow(columnData));
    });
  }
  
  /**
   * 指定の行を1行上げる
   * 
   * @param rowIndex ボタンをクリックした行の添字
   */
  public onUp(rowIndex: number): void {
    const columns = (this.columnForm.get('columns') as FormArray);
    this.enableColumnRows(columns);
    const newValues = this.swap(columns.value, rowIndex, rowIndex - 1);
    columns.setValue(newValues);
    this.disableColumnRows(columns);
  }
  
  /**
   * 指定の行を1行下げる
   * 
   * @param rowIndex ボタンをクリックした行の添字
   */
  public onDown(rowIndex: number): void {
    const columns = (this.columnForm.get('columns') as FormArray);
    this.enableColumnRows(columns);
    const newValues = this.swap(columns.value, rowIndex, rowIndex + 1);
    columns.setValue(newValues);
    this.disableColumnRows(columns);
  }
  
  /**
   * 指定の行の下に空行を追加する
   * 
   * @param rowIndex ボタンをクリックした行の添字
   */
  public onAdd(rowIndex: number): void {
    const newRowData = { name: '', originalName: '', displayName: '', type: 'text', required: false };  // 新規行のデータ
    // フォーム部品を追加する
    (this.columnForm.get('columns') as FormArray).insert(rowIndex + 1, this.createColumnRow(newRowData));
    // 表示用の配列にも同様に追加し、強制再描画させる
    this.dataSource.data.splice(rowIndex + 1, 0, newRowData);
    (this.dataSource as any)._data?.next(this.dataSource.data);
  }
  
  /**
   * 指定の行を削除する
   * 
   * @param rowIndex ボタンをクリックした行の添字
   */
  public onRemove(rowIndex: number): void {
    // フォーム部品を削除する
    (this.columnForm.get('columns') as FormArray).removeAt(rowIndex);
    // 表示用の配列も同様に削除し、強制再描画させる
    this.dataSource.data.splice(rowIndex, 1);
    (this.dataSource as any)._data?.next(this.dataSource.data);
  }
  
  /**
   * フォームの1行を作成する
   * 
   * @param columnData カラムデータ
   * @returns カラムデータを設定したフォーム1行
   */
  private createColumnRow(columnData: ColumnData): FormGroup {
    return this.formBuilder.group({
      name        : [{ value: columnData.name        , disabled: (columnData.type === 'id') }, [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      originalName: [         columnData.originalName                                                               ],
      displayName : [         columnData.displayName                                         , [Validators.required]],
      type        : [{ value: columnData.type        , disabled: (columnData.type === 'id') }, [Validators.required]],
      required    : [{ value: columnData.required    , disabled: (columnData.type === 'id') }, [Validators.required]]
    });
  }
  
  /**
   * 行入替の際に Disabled な項目があると失敗するので、一時的に全て活性化する
   * 
   * @param columns カラムフォーム
   */
  private enableColumnRows(columns: FormArray): void {
    columns.controls.forEach((rowControl: FormGroup) => {
      Object.keys(rowControl.controls).forEach((key) => rowControl.controls[key].enable());
    });
  }
  
  /**
   * 行入替のために `this.enableColumnRows()` で活性化した項目を非活性に戻す
   * 
   * @param columns カラムフォーム
   */
  private disableColumnRows(columns: FormArray): void {
    columns.controls.forEach((rowControl: FormGroup) => {
      const type = rowControl.controls['type'].value;
      if(type === 'id') ['name', 'type', 'required'].forEach((key) => rowControl.controls[key].disable());
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
