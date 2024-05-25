import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JFlixAuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { JFlixAlertService } from '../../services/alert.service';
import { catchError, pipe, throwError } from 'rxjs';

@Component({
  selector: 'jflix-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required)
  });

  constructor(private auth: JFlixAuthService, private router: Router, private alertService: JFlixAlertService) { }

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe((isLoggedIn) => {
      if(isLoggedIn){
        this.router.navigate(['/']);
      }
    })
  }

  submit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password)
        .pipe(catchError((err) => {
          this.alertService.alert('Login Failed', 'warning', false, 5000);
          this.loginForm.controls.password.setValue(null);
          throw err;
        }))
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    }
  }
}
