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
