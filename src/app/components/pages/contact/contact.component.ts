import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  submitting = false;
  submitted = false;
  errorMsg = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {}

  get f() { return this.form.controls; }

  async onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    if (this.form.invalid) return;
    this.submitting = true;
    try {
      await this.http.post(`${environment.apiUrl}/contact`, this.form.value).toPromise();
      this.form.reset();
    } catch (e) {
      this.errorMsg = 'No pudimos enviar tu mensaje. Intenta más tarde.';
    } finally {
      this.submitting = false;
    }
  }
}
