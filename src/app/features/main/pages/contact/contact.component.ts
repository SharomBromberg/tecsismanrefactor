import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactLeadService } from '@core/services/contact-lead.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private readonly contactLeadService = inject(ContactLeadService);

  submitting = false;
  submitted = false;
  successMessage = '';
  errorMsg = '';

  form = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(80)],
    ],
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^[0-9+()\s-]{7,20}$/)],
    ],
    company: ['', [Validators.maxLength(120)]],
    serviceType: ['', [Validators.required]],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(1200),
      ],
    ],
  });

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
      this.contactLeadService.submitLead({
        name: this.form.controls.name.value ?? '',
        email: this.form.controls.email.value ?? '',
        phone: this.form.controls.phone.value ?? '',
        company: this.form.controls.company.value ?? '',
        serviceType: this.form.controls.serviceType.value ?? '',
        message: this.form.controls.message.value ?? '',
      });

      this.form.reset();
      this.successMessage =
        'Gracias. Recibimos tu solicitud y te contactaremos pronto.';
      this.submitted = false;
    } catch {
      this.errorMsg = 'No pudimos enviar tu mensaje. Intenta más tarde.';
    } finally {
      this.submitting = false;
    }
  }
}
