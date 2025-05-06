import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
    passwordForm: FormGroup;
  
    constructor(private fb: FormBuilder) {
  
      this.passwordForm = this.fb.group({
        currentPassword: [''],
        newPassword: ['']
      });
    }
  
    updatePassword() {
      console.log('Password Updated:', this.passwordForm.value);
    }

    deleteAccount() {
      console.warn('Account deletion requested!');
    }
}
