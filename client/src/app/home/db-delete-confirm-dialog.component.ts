import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/** DB 削除確認ダイアログ */
@Component({
  selector: 'app-db-delete-confirm-dialog',
  templateUrl: './db-delete-confirm-dialog.component.html',
  styleUrls: ['./db-delete-confirm-dialog.component.scss']
})
export class DbDeleteConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) { }
}
