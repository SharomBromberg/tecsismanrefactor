import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  submitting = false;
  submitted = false;
  successMessage = '';
  errorMsg = '';
  private readonly leadsStorageKey = 'tecsisman_contact_leads';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    company: [''],
    serviceType: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(20)]],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  get f() {
    return this.form.controls;
  }

  async onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMsg = '';
    if (this.form.invalid) return;
    this.submitting = true;

    try {
      const current = this.readLeads();
      current.push({
        ...this.form.getRawValue(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(this.leadsStorageKey, JSON.stringify(current));

      this.form.reset();
      this.successMessage =
        'Gracias. Recibimos tu solicitud y te contactaremos pronto.';
      this.submitted = false;
    } catch (e) {
      this.errorMsg = 'No pudimos enviar tu mensaje. Intenta más tarde.';
    } finally {
      this.submitting = false;
    }
  }

  private readLeads(): Array<Record<string, unknown>> {
    const raw = localStorage.getItem(this.leadsStorageKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Array<Record<string, unknown>>;
    } catch {
      return [];
    }
  }
}
