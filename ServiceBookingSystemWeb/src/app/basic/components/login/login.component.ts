import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../services/auth/auth.service';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  validateForm!:FormGroup;
  
  constructor(private fb:FormBuilder,
    private authService:AuthService,
    private notification:NzNotificationService,
    private router:Router
    ){}

    ngOnInit(){
      this.validateForm=this.fb.group({
        userName:[null,[Validators.required]],
        password:[null,[Validators.required]],

      })
    }

    submitForm() {
      if (this.validateForm.valid) {
        const loginData = {
          userName: this.validateForm.get('userName')!.value,
          password: this.validateForm.get('password')!.value
        };

        this.authService.login(loginData.userName, loginData.password)
          .subscribe({
            next: (res) => {
              console.log('Login response:', res);
              if (UserStorageService.isClientLoggedIn()) {
                this.notification.success('Thành công', 'Đăng nhập thành công', { nzDuration: 3000 });
                this.router.navigateByUrl("client/dashboard");
              } else if (UserStorageService.isCompanyLoggedIn()) {
                this.notification.success('Thành công', 'Đăng nhập thành công', { nzDuration: 3000 });
                this.router.navigateByUrl("company/dashboard");
              }
            },
            error: (error) => {
              console.error('Login error:', error);
              let errorMessage = 'Đăng nhập thất bại';
              if (error.status === 403) {
                errorMessage = 'Sai tên đăng nhập hoặc mật khẩu';
              } else if (error.error) {
                errorMessage = error.error;
              }
              this.notification.error('Lỗi', errorMessage, { nzDuration: 5000 });
            }
          });
      } else {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsTouched();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }

}
