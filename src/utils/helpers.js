/**
 * Funções auxiliares (Helpers) do Sistema OP
 * 
 * Contém funções utilitárias para formatação, validação,
 * conversão e manipulação de dados.
 */

/**
 * FORMATAÇÃO DE DADOS
 */

/**
 * Formata data e hora para o padrão brasileiro
 * @param {Date|string} data - Data a ser formatada
 * @returns {string} Data formatada (DD/MM/YYYY HH:MM)
 */
export function formatarDataHora(data) {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  if (isNaN(dataObj.getTime())) return '';
  
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  const hora = String(dataObj.getHours()).padStart(2, '0');
  const minuto = String(dataObj.getMinutes()).padStart(2, '0');
  
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

/**
 * Formata apenas a data para o padrão brasileiro
 * @param {Date|string} data - Data a ser formatada
 * @returns {string} Data formatada (DD/MM/YYYY)
 */
export function formatarData(data) {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  if (isNaN(dataObj.getTime())) return '';
  
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata número com casas decimais
 * @param {number} numero - Número a ser formatado
 * @param {number} casasDecimais - Quantidade de casas decimais (padrão: 2)
 * @returns {string} Número formatado
 */
export function formatarNumero(numero, casasDecimais = 2) {
  if (numero === null || numero === undefined) return '0';
  return Number(numero).toFixed(casasDecimais);
}

/**
 * Formata número como moeda brasileira
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado (R$ 1.234,56)
 */
export function formatarMoeda(valor) {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

/**
 * CONVERSÕES
 */

/**
 * Converte rocas para quilogramas
 * @param {number} rocas - Quantidade em rocas
 * @param {number} pesoPorRoca - Peso de cada roca em KG
 * @returns {number} Quantidade em quilogramas
 */
export function rocasParaKg(rocas, pesoPorRoca) {
  if (!rocas || !pesoPorRoca) return 0;
  return Number((rocas * pesoPorRoca).toFixed(2));
}

/**
 * Converte quilogramas para rocas
 * @param {number} kg - Quantidade em quilogramas
 * @param {number} pesoPorRoca - Peso de cada roca em KG
 * @returns {number} Quantidade em rocas
 */
export function kgParaRocas(kg, pesoPorRoca) {
  if (!kg || !pesoPorRoca) return 0;
  return Number((kg / pesoPorRoca).toFixed(2));
}

/**
 * VALIDAÇÕES
 */

/**
 * Valida se um código de barras EAN-13 é válido
 * @param {string} codigoBarras - Código de barras a ser validado
 * @returns {boolean} true se válido, false se inválido
 */
export function validarEAN13(codigoBarras) {
  if (!codigoBarras || codigoBarras.length !== 13) return false;
  
  // Verificar se contém apenas números
  if (!/^\d+$/.test(codigoBarras)) return false;
  
  // Calcular dígito verificador
  const digitos = codigoBarras.split('').map(Number);
  const soma = digitos.slice(0, 12).reduce((acc, digito, index) => {
    return acc + digito * (index % 2 === 0 ? 1 : 3);
  }, 0);
  
  const digitoVerificador = (10 - (soma % 10)) % 10;
  
  return digitoVerificador === digitos[12];
}

/**
 * Valida se um SKU é válido
 * @param {string} sku - SKU a ser validado
 * @returns {boolean} true se válido, false se inválido
 */
export function validarSKU(sku) {
  if (!sku || typeof sku !== 'string') return false;
  
  // SKU deve ter entre 3 e 20 caracteres alfanuméricos
  return /^[A-Z0-9]{3,20}$/i.test(sku.trim());
}

/**
 * Valida se uma quantidade é válida
 * @param {number} quantidade - Quantidade a ser validada
 * @returns {boolean} true se válida, false se inválida
 */
export function validarQuantidade(quantidade) {
  return quantidade !== null && 
         quantidade !== undefined && 
         !isNaN(quantidade) && 
         quantidade > 0;
}

/**
 * GERAÇÃO DE DADOS
 */

/**
 * Gera um número de OP sequencial
 * @param {number} numero - Número sequencial
 * @returns {string} Número da OP formatado (ex: OP00001)
 */
export function gerarNumeroOP(numero) {
  return `OP${String(numero).padStart(5, '0')}`;
}

/**
 * Gera um código de barras EAN-13 válido
 * @param {string} prefixo - Prefixo do código (3 dígitos)
 * @param {string} produto - Código do produto (9 dígitos)
 * @returns {string} Código EAN-13 completo com dígito verificador
 */
export function gerarEAN13(prefixo, produto) {
  // Garantir que prefixo tem 3 dígitos e produto tem 9
  const prefixoFormatado = String(prefixo).padStart(3, '0').slice(0, 3);
  const produtoFormatado = String(produto).padStart(9, '0').slice(0, 9);
  
  const codigoSemDigito = prefixoFormatado + produtoFormatado;
  
  // Calcular dígito verificador
  const digitos = codigoSemDigito.split('').map(Number);
  const soma = digitos.reduce((acc, digito, index) => {
    return acc + digito * (index % 2 === 0 ? 1 : 3);
  }, 0);
  
  const digitoVerificador = (10 - (soma % 10)) % 10;
  
  return codigoSemDigito + digitoVerificador;
}

/**
 * FILTROS E BUSCA
 */

/**
 * Filtra uma lista de objetos por múltiplos critérios
 * @param {Array} lista - Lista de objetos a ser filtrada
 * @param {Object} filtros - Objeto com os filtros a aplicar
 * @returns {Array} Lista filtrada
 */
export function filtrarLista(lista, filtros) {
  if (!lista || !Array.isArray(lista)) return [];
  if (!filtros || Object.keys(filtros).length === 0) return lista;
  
  return lista.filter(item => {
    return Object.entries(filtros).every(([chave, valor]) => {
      // Se o valor do filtro for vazio, ignorar
      if (valor === '' || valor === null || valor === undefined) return true;
      
      // Se for 'todos', ignorar
      if (valor === 'todos') return true;
      
      // Comparação case-insensitive para strings
      if (typeof valor === 'string' && typeof item[chave] === 'string') {
        return item[chave].toLowerCase().includes(valor.toLowerCase());
      }
      
      // Comparação direta para outros tipos
      return item[chave] === valor;
    });
  });
}

/**
 * Busca um item em uma lista pelo ID
 * @param {Array} lista - Lista de objetos
 * @param {string} id - ID a buscar
 * @param {string} campoId - Nome do campo que contém o ID (padrão: 'id')
 * @returns {Object|null} Item encontrado ou null
 */
export function buscarPorId(lista, id, campoId = 'id') {
  if (!lista || !Array.isArray(lista)) return null;
  return lista.find(item => item[campoId] === id) || null;
}

/**
 * ESTATÍSTICAS
 */

/**
 * Calcula estatísticas de uma lista de OPs
 * @param {Array} ops - Lista de ordens de produção
 * @returns {Object} Objeto com as estatísticas
 */
export function calcularEstatisticasOPs(ops) {
  if (!ops || !Array.isArray(ops)) {
    return {
      total: 0,
      pendentes: 0,
      separadasTotal: 0,
      separadasParcial: 0,
      naoSeparadas: 0,
      impressas: 0,
      ativas: 0
    };
  }
  
  return {
    total: ops.length,
    pendentes: ops.filter(op => op.statusSeparacao === 'Pendente').length,
    separadasTotal: ops.filter(op => op.statusSeparacao === 'Total').length,
    separadasParcial: ops.filter(op => op.statusSeparacao === 'Parcial').length,
    naoSeparadas: ops.filter(op => op.statusSeparacao === 'NaoSeparou').length,
    impressas: ops.filter(op => op.statusImpressao === 'Impressa').length,
    ativas: ops.filter(op => op.statusOP === 'Ativa').length
  };
}

/**
 * Calcula o percentual de separação de uma OP
 * @param {number} qtdSeparada - Quantidade separada
 * @param {number} qtdTotal - Quantidade total
 * @returns {number} Percentual de 0 a 100
 */
export function calcularPercentualSeparacao(qtdSeparada, qtdTotal) {
  if (!qtdTotal || qtdTotal === 0) return 0;
  return Math.round((qtdSeparada / qtdTotal) * 100);
}

/**
 * ORDENAÇÃO
 */

/**
 * Ordena lista de OPs por data
 * @param {Array} ops - Lista de OPs
 * @param {string} ordem - 'asc' ou 'desc' (padrão: 'desc')
 * @returns {Array} Lista ordenada
 */
export function ordenarOPsPorData(ops, ordem = 'desc') {
  if (!ops || !Array.isArray(ops)) return [];
  
  return [...ops].sort((a, b) => {
    const dataA = new Date(a.dataCriacao.split(' ').reverse().join(' '));
    const dataB = new Date(b.dataCriacao.split(' ').reverse().join(' '));
    
    return ordem === 'asc' ? dataA - dataB : dataB - dataA;
  });
}

/**
 * Ordena lista por campo específico
 * @param {Array} lista - Lista a ser ordenada
 * @param {string} campo - Campo para ordenar
 * @param {string} ordem - 'asc' ou 'desc' (padrão: 'asc')
 * @returns {Array} Lista ordenada
 */
export function ordenarPorCampo(lista, campo, ordem = 'asc') {
  if (!lista || !Array.isArray(lista)) return [];
  
  return [...lista].sort((a, b) => {
    const valorA = a[campo];
    const valorB = b[campo];
    
    if (typeof valorA === 'string' && typeof valorB === 'string') {
      return ordem === 'asc' 
        ? valorA.localeCompare(valorB)
        : valorB.localeCompare(valorA);
    }
    
    return ordem === 'asc' 
      ? valorA - valorB
      : valorB - valorA;
  });
}

/**
 * EXPORTAÇÃO
 */

/**
 * Converte lista de objetos para CSV
 * @param {Array} dados - Lista de objetos
 * @param {Array} colunas - Array com nomes das colunas a exportar
 * @returns {string} String CSV
 */
export function converterParaCSV(dados, colunas) {
  if (!dados || !Array.isArray(dados) || dados.length === 0) {
    return '';
  }
  
  // Cabeçalho
  const header = colunas.join(';');
  
  // Linhas
  const linhas = dados.map(item => {
    return colunas.map(coluna => {
      const valor = item[coluna];
      // Escapar aspas e adicionar aspas se contiver ponto e vírgula
      if (typeof valor === 'string' && valor.includes(';')) {
        return `"${valor.replace(/"/g, '""')}"`;
      }
      return valor || '';
    }).join(';');
  });
  
  return [header, ...linhas].join('\n');
}

/**
 * Faz download de um arquivo
 * @param {string} conteudo - Conteúdo do arquivo
 * @param {string} nomeArquivo - Nome do arquivo
 * @param {string} tipo - Tipo MIME do arquivo (padrão: 'text/csv')
 */
export function downloadArquivo(conteudo, nomeArquivo, tipo = 'text/csv') {
  const blob = new Blob([conteudo], { type: tipo });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * IMPRESSÃO
 */

/**
 * Abre janela de impressão para um elemento específico
 * @param {string} elementoId - ID do elemento a ser impresso
 */
export function imprimirElemento(elementoId) {
  const elemento = document.getElementById(elementoId);
  
  if (!elemento) {
    console.error(`Elemento ${elementoId} não encontrado`);
    return;
  }
  
  const janelaImpressao = window.open('', '', 'height=600,width=800');
  
  janelaImpressao.document.write('<html><head><title>Impressão</title>');
  janelaImpressao.document.write('<style>');
  janelaImpressao.document.write('body { font-family: Arial, sans-serif; }');
  janelaImpressao.document.write('@media print { .no-print { display: none; } }');
  janelaImpressao.document.write('</style>');
  janelaImpressao.document.write('</head><body>');
  janelaImpressao.document.write(elemento.innerHTML);
  janelaImpressao.document.write('</body></html>');
  
  janelaImpressao.document.close();
  janelaImpressao.focus();
  
  setTimeout(() => {
    janelaImpressao.print();
    janelaImpressao.close();
  }, 250);
}

/**
 * DEBOUNCE (útil para buscas)
 */

/**
 * Cria uma função debounced
 * @param {Function} func - Função a ser executada
 * @param {number} delay - Delay em milissegundos (padrão: 300)
 * @returns {Function} Função debounced
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * NOTIFICAÇÕES
 */

/**
 * Exibe notificação de sucesso
 * @param {string} mensagem - Mensagem a ser exibida
 */
export function notificarSucesso(mensagem) {
  // Implementação básica com alert
  // Em produção, usar biblioteca como react-toastify
  console.log('✅ Sucesso:', mensagem);
  alert(`✅ ${mensagem}`);
}

/**
 * Exibe notificação de erro
 * @param {string} mensagem - Mensagem a ser exibida
 */
export function notificarErro(mensagem) {
  console.error('❌ Erro:', mensagem);
  alert(`❌ ${mensagem}`);
}

/**
 * Exibe notificação de aviso
 * @param {string} mensagem - Mensagem a ser exibida
 */
export function notificarAviso(mensagem) {
  console.warn('⚠️ Aviso:', mensagem);
  alert(`⚠️ ${mensagem}`);
}
