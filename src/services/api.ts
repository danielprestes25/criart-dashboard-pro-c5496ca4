import { supabase } from '@/integrations/supabase/client';
import { Employee, Revenue, Expense, Lead, Budget, Campaign, Cobranca } from '@/types/database';

class ApiService {
  // Employees
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Employee[];
  }

  async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();
    
    if (error) throw error;
    return data as Employee;
  }

  async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .update({ ...employee, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Employee;
  }

  async deleteEmployee(id: number): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Revenues
  async getRevenues(): Promise<Revenue[]> {
    const { data, error } = await supabase
      .from('revenues')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Revenue[];
  }

  async createRevenue(revenue: Omit<Revenue, 'id' | 'created_at' | 'updated_at'>): Promise<Revenue> {
    const { data, error } = await supabase
      .from('revenues')
      .insert(revenue)
      .select()
      .single();
    
    if (error) throw error;
    return data as Revenue;
  }

  async updateRevenue(id: number, revenue: Partial<Revenue>): Promise<Revenue> {
    const { data, error } = await supabase
      .from('revenues')
      .update({ ...revenue, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Revenue;
  }

  async deleteRevenue(id: number): Promise<void> {
    const { error } = await supabase
      .from('revenues')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Expense[];
  }

  async createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();
    
    if (error) throw error;
    return data as Expense;
  }

  async updateExpense(id: number, expense: Partial<Expense>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update({ ...expense, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Expense;
  }

  async deleteExpense(id: number): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Leads
  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Lead[];
  }

  async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lead;
  }

  async updateLead(id: number, lead: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...lead, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lead;
  }

  async deleteLead(id: number): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Budget[];
  }

  async createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select()
      .single();
    
    if (error) throw error;
    return data as Budget;
  }

  async updateBudget(id: number, budget: Partial<Budget>): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .update({ ...budget, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Budget;
  }

  async deleteBudget(id: number): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Campaign[];
  }

  async createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single();
    
    if (error) throw error;
    return data as Campaign;
  }

  async updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ ...campaign, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Campaign;
  }

  async deleteCampaign(id: number): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Cobranças
  async getCobrancas(): Promise<Cobranca[]> {
    const { data, error } = await supabase
      .from('cobrancas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Map the database response to our Cobranca interface
    return (data || []).map((item: any) => ({
      id: item.id,
      cliente: item.cliente,
      valor: item.valor,
      status: item.status as 'Pago' | 'Pendente' | 'Vencido',
      data: item.data,
      linkPagamento: item.linkpagamento,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  }

  async createCobranca(cobranca: Omit<Cobranca, 'id' | 'created_at' | 'updated_at'>): Promise<Cobranca> {
    // Map our interface to database column names
    const dbData = {
      cliente: cobranca.cliente,
      valor: cobranca.valor,
      status: cobranca.status,
      data: cobranca.data,
      linkpagamento: cobranca.linkPagamento
    };

    const { data, error } = await supabase
      .from('cobrancas')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map response back to our interface
    return {
      id: data.id,
      cliente: data.cliente,
      valor: data.valor,
      status: data.status as 'Pago' | 'Pendente' | 'Vencido',
      data: data.data,
      linkPagamento: data.linkpagamento,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  async updateCobranca(id: number, cobranca: Partial<Cobranca>): Promise<Cobranca> {
    // Map our interface to database column names
    const dbData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (cobranca.cliente) dbData.cliente = cobranca.cliente;
    if (cobranca.valor) dbData.valor = cobranca.valor;
    if (cobranca.status) dbData.status = cobranca.status;
    if (cobranca.data) dbData.data = cobranca.data;
    if (cobranca.linkPagamento !== undefined) dbData.linkpagamento = cobranca.linkPagamento;

    const { data, error } = await supabase
      .from('cobrancas')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map response back to our interface
    return {
      id: data.id,
      cliente: data.cliente,
      valor: data.valor,
      status: data.status as 'Pago' | 'Pendente' | 'Vencido',
      data: data.data,
      linkPagamento: data.linkpagamento,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  async deleteCobranca(id: number): Promise<void> {
    const { error } = await supabase
      .from('cobrancas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Add missing financial analysis method
  async getFinancialAnalysis() {
    try {
      // Get revenues and expenses for analysis
      const [revenues, expenses] = await Promise.all([
        this.getRevenues(),
        this.getExpenses()
      ]);

      const totalRevenue = revenues.reduce((sum, rev) => sum + Number(rev.amount), 0);
      const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
      const profit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      // Calculate monthly trends
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyRevenue = revenues
        .filter(rev => {
          const revDate = new Date(rev.date);
          return revDate.getMonth() === currentMonth && revDate.getFullYear() === currentYear;
        })
        .reduce((sum, rev) => sum + Number(rev.amount), 0);

      const monthlyExpenses = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        })
        .reduce((sum, exp) => sum + Number(exp.amount), 0);

      return {
        totalRevenue,
        totalExpenses,
        profit,
        profitMargin: Number(profitMargin.toFixed(2)),
        monthlyRevenue,
        monthlyExpenses,
        monthlyProfit: monthlyRevenue - monthlyExpenses,
        insights: this.generateInsights(profit, profitMargin, monthlyRevenue, monthlyExpenses)
      };
    } catch (error) {
      console.error('Error getting financial analysis:', error);
      throw error;
    }
  }

  private generateInsights(profit: number, profitMargin: number, monthlyRevenue: number, monthlyExpenses: number) {
    const insights = [];

    if (profit > 0) {
      insights.push("Sua empresa está gerando lucro! Continue monitorando para manter o crescimento.");
    } else if (profit < 0) {
      insights.push("Atenção: Suas despesas estão superando as receitas. Considere revisar os custos.");
    }

    if (profitMargin > 20) {
      insights.push("Excelente margem de lucro! Sua empresa está muito saudável financeiramente.");
    } else if (profitMargin < 10 && profitMargin > 0) {
      insights.push("Margem de lucro baixa. Considere otimizar custos ou aumentar preços.");
    }

    if (monthlyExpenses > monthlyRevenue) {
      insights.push("Este mês as despesas estão altas. Revise gastos desnecessários.");
    }

    return insights;
  }
}

export const apiService = new ApiService();
