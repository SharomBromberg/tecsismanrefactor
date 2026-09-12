import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactLeadService } from '@core/services/contact-lead.service';
import { InputComponent } from '@shared/atoms/input/input.component';
import { TextareaComponent } from '@shared/atoms/textarea/textarea.component';
import { SelectComponent, SelectOption } from '@shared/atoms/select/select.component';
import { ButtonComponent } from '@shared/atoms/button/button.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    InputComponent, 
    TextareaComponent, 
    SelectComponent, 
    ButtonComponent
  ],
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

  serviceOptions: SelectOption[] = [
    { value: '', label: 'Selecciona una opcion' },
    { value: 'Desarrollo web', label: 'Desarrollo web' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Redes y seguridad', label: 'Redes y seguridad' },
    { value: 'Soporte tecnico', label: 'Soporte tecnico' },
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+()\s-]{7,20}$/)]],
    company: ['', [Validators.maxLength(120)]],
    serviceType: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1200)]],
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
      this.successMessage = 'Gracias. Recibimos tu solicitud y te contactaremos pronto.';
      this.submitted = false;
    } catch {
      this.errorMsg = 'No pudimos enviar tu mensaje. Intenta más tarde.';
    } finally {
      this.submitting = false;
    }
  }

  sendWhatsApp() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMsg = '';
    
    if (this.form.invalid) return;

    const { name, email, phone, company, serviceType, message } = this.form.value;
    
    const text = `Hola Tecsisman, mi nombre es ${name}.
${company ? `Empresa: ${company}\n` : ''}Email: ${email}
Teléfono: ${phone}
Servicio de interés: ${serviceType}

Mensaje:
${message}`;

    const phoneNumber = '573000000000'; // Número por defecto
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    this.form.reset();
    this.successMessage = 'Se ha abierto WhatsApp para continuar con la comunicación.';
    this.submitted = false;
  }
}
