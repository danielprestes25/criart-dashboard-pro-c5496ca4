
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
  client_name: string;
  category: string;
  date: string;
  status: 'pending' | 'received';
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  source: string;
  notes?: string;
  score: number;
  status: 'novo' | 'contato_iniciado' | 'em_negociacao' | 'ganhou' | 'perdido';
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: number;
  client_name: string;
  description: string;
  amount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
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
  created_at: string;
  updated_at: string;
}
