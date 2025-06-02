
export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  salary: number;
  hire_date: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Revenue {
  id: number;
  description: string;
  amount: number;
  client: string;
  category: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  supplier: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  notes?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: number;
  client_name: string;
  project_description: string;
  amount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  created_date: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  platform: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'paused' | 'completed';
  target_audience?: string;
  objective?: string;
  created_at: string;
  updated_at: string;
}

export interface Cobranca {
  id: number;
  cliente: string;
  valor: number;
  status: 'Pago' | 'Pendente' | 'Vencido';
  data: string;
  linkPagamento?: string;
  created_at: string;
  updated_at: string;
}
