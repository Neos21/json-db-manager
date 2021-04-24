import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';

/** 強制再ログイン */
@Component({
  selector: 'app-re-login',
  templateUrl: './re-login.component.html',
  styleUrls: ['./re-login.component.scss']
})
export class ReLoginComponent implements OnInit {
  constructor(private router: Router, private authGuard: AuthGuard, private authService: AuthService) { }
  
  /**
   * 強制再ログイン : `AuthGuard#canActivate()` と同等の処理で再ログイン処理を行う
   */
  public ngOnInit(): void {
    this.authService.autoReLogin()
      .then(() => {
        console.log('Re Login : Success');
        this.authGuard.isLogined = true;
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.warn('Re Login : Failed To Re Login, Go To Login Page', error);
        this.authGuard.isLogined = false;
        this.router.navigate(['/login']);
      });
  }
}
