import { Injectable } from '@angular/core';

export interface ContactLeadInput {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  message: string;
}

export interface ContactLeadRecord extends ContactLeadInput {
  createdAt: string;
  source: 'web-form';
}

@Injectable({ providedIn: 'root' })
export class ContactLeadService {
  private readonly leadsStorageKey = 'tecsisman_contact_leads';

  submitLead(input: ContactLeadInput): void {
    const current = this.readLeads();
    current.push({
      ...this.normalizeLead(input),
      createdAt: new Date().toISOString(),
      source: 'web-form',
    });

    localStorage.setItem(this.leadsStorageKey, JSON.stringify(current));
  }

  private readLeads(): ContactLeadRecord[] {
    const raw = localStorage.getItem(this.leadsStorageKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as ContactLeadRecord[];
    } catch {
      return [];
    }
  }

  private normalizeLead(input: ContactLeadInput): ContactLeadInput {
    return {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      company: input.company?.trim() ?? '',
      serviceType: input.serviceType.trim(),
      message: input.message.trim().replace(/\s+/g, ' '),
    };
  }
}
