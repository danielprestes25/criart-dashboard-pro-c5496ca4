
export const generatePropostaPDF = (proposta: any) => {
  // Simulação de geração de PDF para proposta
  const pdfContent = `
    CRIART - PROPOSTA COMERCIAL
    
    Cliente: ${proposta.cliente}
    Valor Proposto: R$ ${proposta.valorProposto.toLocaleString()}
    Descrição: ${proposta.descricao}
    Data de Envio: ${new Date(proposta.dataEnvio).toLocaleDateString('pt-BR')}
    Validade: ${new Date(proposta.validade).toLocaleDateString('pt-BR')}
    Status: ${proposta.status}
    
    Criart - Soluções Criativas
    contato@criart.com
  `;
  
  // Simular download do PDF
  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `proposta-${proposta.cliente}-${proposta.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateCobrancaPDF = (cobranca: any) => {
  // Simulação de geração de PDF para cobrança
  const pdfContent = `
    CRIART - COBRANÇA
    
    Cliente: ${cobranca.cliente}
    Valor: R$ ${cobranca.valor.toLocaleString()}
    Data de Vencimento: ${new Date(cobranca.data).toLocaleDateString('pt-BR')}
    Status: ${cobranca.status}
    Link de Pagamento: ${cobranca.linkPagamento}
    
    Criart - Soluções Criativas
    contato@criart.com
  `;
  
  // Simular download do PDF
  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cobranca-${cobranca.cliente}-${cobranca.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
