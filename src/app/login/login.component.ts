// Spencer Lommel 4/25/25

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private auth: Auth = inject(Auth);
  authForm!: FormGroup;
  isLoginMode = true;
  loading = false;
  submitted = false;
  error = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    console.log('LoginComponent initialized');
    this.initForm();
  }

  get f() {
    return this.authForm.controls;
  }

  initForm(): void {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: [''],
    });

    this.updateFormValidators();
  }

  updateFormValidators(): void {
    const usernameControl = this.f['username'];

    if (this.isLoginMode) {
      usernameControl.removeValidators(Validators.required);
    } else {
      usernameControl.addValidators(Validators.required);
    }

    usernameControl.updateValueAndValidity();
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.updateFormValidators();
    this.error = '';
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.authForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.isLoginMode) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login(): void {
    signInWithEmailAndPassword(
      this.auth,
      this.f['email'].value,
      this.f['password'].value
    )
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.error = this.getFirebaseErrorMessage(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  signUp(): void {
    createUserWithEmailAndPassword(
      this.auth,
      this.f['email'].value,
      this.f['password'].value
    )
      .then((result) => {
        if (result.user) {
          return updateProfile(result.user, {
            displayName: this.f['username'].value,
          });
        }
        return Promise.resolve();
      })
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.error = this.getFirebaseErrorMessage(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Email is already in use.';
      case 'auth/invalid-email':
        return 'Email address is invalid.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}
