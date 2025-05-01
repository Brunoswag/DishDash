// Spencer Lommel 4/25/25

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
} from '@angular/fire/auth';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  private auth: Auth = inject(Auth);
  private userSubscription?: Subscription;
  authForm!: FormGroup;
  isLoginMode = true;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('LoginComponent initialized');
    this.initForm();

    // Subscribe to user changes
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      if (user) {
        // If user is already logged in, redirect to home
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  get f() {
    return this.authForm.controls;
  }

  initForm(): void {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      username: [''],
    });

    this.updateFormValidators();
  }

  updateFormValidators(): void {
    const usernameControl = this.f['username'];
    
    if (this.isLoginMode) {
      usernameControl.clearValidators();
    } else {
      usernameControl.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_-]*$/)
      ]);
    }
    
    usernameControl.updateValueAndValidity();
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.updateFormValidators();
    this.error = '';
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.authForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      if (this.isLoginMode) {
        await this.login();
      } else {
        await this.signUp();
      }
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.error = this.getFirebaseErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  private async login(): Promise<void> {
    const { email, password } = this.authForm.value;
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    await this.userService.updateLastLogin(credential.user.uid);
  }

  private async signUp(): Promise<void> {
    const { email, password, username } = this.authForm.value;
    
    console.log('Attempting to sign up with:', {
      email,
      username,
      passwordLength: password?.length || 0
    });

    try {
      const credential = await createUserWithEmailAndPassword(
        this.auth, 
        email,
        password
      );
      
      console.log('Firebase auth user created:', credential.user.uid);

      try {
        await this.userService.createUserData(credential.user, username);
        console.log('User data created in Firestore');
      } catch (firestoreError) {
        console.error('Error creating user data:', firestoreError);
        await credential.user.delete();
        throw new Error('Failed to create user profile');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  getFirebaseErrorMessage(error: any): string {
    console.error('Firebase error details:', error);
    // Uhh this is hopefully all right but I may be wrong. 
    // TODO: Someone test these =D
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Email is already in use.';
      case 'auth/invalid-email':
        return 'Email address is invalid.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. It must be at least 6 characters.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      default:
        return `An unexpected error occurred (${error.code}). Please try again.`;
    }
  }
}
