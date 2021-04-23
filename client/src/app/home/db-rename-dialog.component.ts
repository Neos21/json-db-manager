import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/** DB リネームダイアログ */
@Component({
  selector: 'app-db-rename-dialog',
  templateUrl: './db-rename-dialog.component.html',
  styleUrls: ['./db-rename-dialog.component.scss']
})
export class DbRenameDialogComponent {
  /** 新 DB 物理名 */
  public newDbName: string = '';
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) { }
}
