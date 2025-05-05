import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {NotificationService} from '../../service/notification.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.createRegisterForm();
  }

  createRegisterForm(): FormGroup {
    return this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.compose([Validators.required,
        Validators.pattern('^[a-zA-Z0-9]*$')])],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      password2: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  submit(): void {
    if (this.registerForm.valid && this.registerForm.value.password === this.registerForm.value.password2) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.notificationService.showSnackBar("Success register")
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.notificationService.showSnackBar("User with such username exists")
        }
      });
    } else {
      this.notificationService.showSnackBar("Form is invalid or passwords are not matched")
    }
  }

}
