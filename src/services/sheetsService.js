/**
 * Serviço de Integração com Google Sheets API
 * 
 * Este serviço gerencia toda a comunicação com a planilha Google Sheets
 * incluindo autenticação, leitura e escrita de dados.
 */

import { GOOGLE_CONFIG } from '../config.js';

class SheetsService {
  constructor() {
    this.gapiLoaded = false;
    this.gisLoaded = false;
    this.tokenClient = null;
    this.accessToken = null;
    this.isAuthenticated = false;
  }

  /**
   * Inicializa as APIs do Google (gapi e GIS)
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      // Carregar Google API Client Library (gapi)
      const gapiScript = document.createElement('script');
      gapiScript.src = 'https://apis.google.com/js/api.js';
      gapiScript.onload = () => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: GOOGLE_CONFIG.API_KEY,
              discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS,
            });
            this.gapiLoaded = true;
            console.log('✅ Google API Client carregado');
            this.checkAndResolve(resolve);
          } catch (error) {
            console.error('❌ Erro ao inicializar gapi:', error);
            reject(error);
          }
        });
      };
      gapiScript.onerror = (error) => {
        console.error('❌ Erro ao carregar gapi script:', error);
        reject(error);
      };
      document.body.appendChild(gapiScript);

      // Carregar Google Identity Services (GIS)
      const gisScript = document.createElement('script');
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.onload = () => {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          scope: GOOGLE_CONFIG.SCOPES,
          callback: '', // Será definido no método login()
        });
        this.gisLoaded = true;
        console.log('✅ Google Identity Services carregado');
        this.checkAndResolve(resolve);
      };
      gisScript.onerror = (error) => {
        console.error('❌ Erro ao carregar GIS script:', error);
        reject(error);
      };
      document.body.appendChild(gisScript);
    });
  }

  /**
   * Verifica se ambas as APIs foram carregadas e resolve a Promise
   */
  checkAndResolve(resolve) {
    if (this.gapiLoaded && this.gisLoaded) {
      resolve();
    }
  }

  /**
   * Realiza login do usuário com Google OAuth
   */
  async login() {
    return new Promise((resolve, reject) => {
      this.tokenClient.callback = async (response) => {
        if (response.error !== undefined) {
          console.error('❌ Erro no login:', response);
          reject(response);
          return;
        }
        this.accessToken = response.access_token;
        this.isAuthenticated = true;
        console.log('✅ Login realizado com sucesso');
        resolve(response);
      };

      // Solicitar token de acesso
      if (this.accessToken === null) {
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        this.tokenClient.requestAccessToken({ prompt: '' });
      }
    });
  }

  /**
   * Faz logout do usuário
   */
  logout() {
    if (this.accessToken) {
      window.google.accounts.oauth2.revoke(this.accessToken);
      this.accessToken = null;
      this.isAuthenticated = false;
      console.log('✅ Logout realizado');
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isUserAuthenticated() {
    return this.isAuthenticated && this.accessToken !== null;
  }

  /**
   * Lê dados de uma aba da planilha
   * @param {string} sheetName - Nome da aba
   * @param {string} range - Range opcional (ex: "A1:Z100")
   * @returns {Promise<Array>} Array com os dados
   */
  async readSheet(sheetName, range = '') {
    try {
      const fullRange = range ? `${sheetName}!${range}` : sheetName;
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
        range: fullRange,
      });
      
      console.log(`✅ Leitura da aba "${sheetName}" concluída`);
      return response.result.values || [];
    } catch (error) {
      console.error(`❌ Erro ao ler aba "${sheetName}":`, error);
      throw error;
    }
  }

  /**
   * Escreve dados em uma aba da planilha
   * @param {string} sheetName - Nome da aba
   * @param {string} range - Range (ex: "A1:D10")
   * @param {Array} values - Array de arrays com os dados
   * @returns {Promise<Object>} Resultado da operação
   */
  async writeSheet(sheetName, range, values) {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!${range}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });
      
      console.log(`✅ Escrita na aba "${sheetName}" concluída`);
      return response.result;
    } catch (error) {
      console.error(`❌ Erro ao escrever na aba "${sheetName}":`, error);
      throw error;
    }
  }

  /**
   * Adiciona linha(s) no final de uma aba
   * @param {string} sheetName - Nome da aba
   * @param {Array} values - Array de arrays com os dados
   * @returns {Promise<Object>} Resultado da operação
   */
  async appendSheet(sheetName, values) {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });
      
      console.log(`✅ Linhas adicionadas na aba "${sheetName}"`);
      return response.result;
    } catch (error) {
      console.error(`❌ Erro ao adicionar linhas na aba "${sheetName}":`, error);
      throw error;
    }
  }

  /**
   * Busca todas as Ordens de Produção
   * @returns {Promise<Array>} Array com as OPs
   */
  async buscarOPs() {
    try {
      const data = await this.readSheet('OPs', 'A2:R1000');
      
      return data.map(row => ({
        numeroOP: row[0] || '',
        dataCriacao: row[1] || '',
        grupo: row[2] || '',
        sku_materiaPrima: row[3] || '',
        cor_materiaPrima: row[4] || '',
        quantidade_rocas: parseFloat(row[5]) || 0,
        quantidade_kg: parseFloat(row[6]) || 0,
        sku_produtoAcabado: row[7] || '',
        quantidade_produtoAcabado: parseFloat(row[8]) || 0,
        statusSeparacao: row[9] || 'Pendente',
        qtd_separada_rocas: parseFloat(row[10]) || 0,
        qtd_separada_kg: parseFloat(row[11]) || 0,
        observacao: row[12] || '',
        dataSeparacao: row[13] || '',
        usuarioSeparador: row[14] || '',
        statusImpressao: row[15] || 'NaoImpressa',
        dataImpressao: row[16] || '',
        statusOP: row[17] || 'Ativa',
        _rowIndex: data.indexOf(row) + 2 // +2 porque começa na linha 2
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar OPs:', error);
      throw error;
    }
  }

  /**
   * Busca uma OP específica pelo número
   * @param {string} numeroOP - Número da OP
   * @returns {Promise<Object|null>} OP encontrada ou null
   */
  async buscarOPPorNumero(numeroOP) {
    const ops = await this.buscarOPs();
    return ops.find(op => op.numeroOP === numeroOP) || null;
  }

  /**
   * Atualiza a separação de uma OP
   * @param {string} numeroOP - Número da OP
   * @param {Object} dados - Dados da separação
   * @returns {Promise<Object>} Resultado da operação
   */
  async atualizarSeparacao(numeroOP, dados) {
    try {
      // Buscar a OP para encontrar o índice da linha
      const op = await this.buscarOPPorNumero(numeroOP);
      
      if (!op) {
        throw new Error(`OP ${numeroOP} não encontrada`);
      }

      const rowIndex = op._rowIndex;

      // Atualizar colunas de separação (J, K, L, M, N, O)
      const values = [[
        dados.statusSeparacao,                    // J - StatusSeparacao
        dados.qtd_separada_rocas,                 // K - Qtd_Separada_Rocas
        dados.qtd_separada_kg,                    // L - Qtd_Separada_KG
        dados.observacao,                         // M - Observacao_Separacao
        new Date().toLocaleString('pt-BR'),       // N - Data_Separacao
        dados.usuario || 'Sistema'                // O - Usuario_Separador
      ]];

      await this.writeSheet('OPs', `J${rowIndex}:O${rowIndex}`, values);

      // Registrar no histórico
      await this.registrarHistorico(
        numeroOP,
        `SeparacaoAtualizada: ${dados.statusSeparacao}`,
        dados.usuario || 'Sistema',
        `Status anterior: ${op.statusSeparacao}`,
        `Novo status: ${dados.statusSeparacao} - ${dados.qtd_separada_rocas} rocas`
      );

      console.log(`✅ Separação da ${numeroOP} atualizada`);
      return { success: true, numeroOP };
    } catch (error) {
      console.error('❌ Erro ao atualizar separação:', error);
      throw error;
    }
  }

  /**
   * Marca uma OP como impressa
   * @param {string} numeroOP - Número da OP
   * @returns {Promise<Object>} Resultado da operação
   */
  async marcarComoImpressa(numeroOP) {
    try {
      const op = await this.buscarOPPorNumero(numeroOP);
      
      if (!op) {
        throw new Error(`OP ${numeroOP} não encontrada`);
      }

      const rowIndex = op._rowIndex;

      // Atualizar colunas P e Q
      await this.writeSheet('OPs', `P${rowIndex}:Q${rowIndex}`, [[
        'Impressa',                               // P - StatusImpressao
        new Date().toLocaleString('pt-BR')        // Q - Data_Impressao
      ]]);

      await this.registrarHistorico(
        numeroOP,
        'OPImpressa',
        'Sistema',
        'StatusImpressao: NaoImpressa',
        'StatusImpressao: Impressa'
      );

      console.log(`✅ ${numeroOP} marcada como impressa`);
      return { success: true, numeroOP };
    } catch (error) {
      console.error('❌ Erro ao marcar como impressa:', error);
      throw error;
    }
  }

  /**
   * Busca todas as matérias-primas
   * @returns {Promise<Array>} Array com as matérias-primas
   */
  async buscarMateriasPrimas() {
    try {
      const data = await this.readSheet('MateriaPrima', 'A2:G1000');
      
      return data.map(row => ({
        sku: row[0] || '',
        descricao: row[1] || '',
        pesoPorRoca: parseFloat(row[2]) || 0,
        estoqueRocas: parseFloat(row[3]) || 0,
        estoqueKG: parseFloat(row[4]) || 0,
        unidadePadrao: row[5] || 'Rocas',
        grupo: row[6] || ''
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar matérias-primas:', error);
      throw error;
    }
  }

  /**
   * Busca todos os produtos acabados
   * @returns {Promise<Array>} Array com os produtos
   */
  async buscarProdutosAcabados() {
    try {
      const data = await this.readSheet('ProdutosAcabados', 'A2:F1000');
      
      return data.map(row => ({
        sku: row[0] || '',
        descricao: row[1] || '',
        codigoBarras: row[2] || '',
        grupo: row[3] || '',
        skuMateriaPrimaPrincipal: row[4] || '',
        ativo: row[5] || 'SIM'
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar produtos acabados:', error);
      throw error;
    }
  }

  /**
   * Registra uma ação no histórico de alterações
   * @param {string} numeroOP - Número da OP
   * @param {string} acao - Ação realizada
   * @param {string} usuario - Usuário que realizou
   * @param {string} dadosAnteriores - Estado anterior
   * @param {string} dadosNovos - Estado novo
   * @returns {Promise<Object>} Resultado da operação
   */
  async registrarHistorico(numeroOP, acao, usuario, dadosAnteriores, dadosNovos) {
    try {
      await this.appendSheet('HistoricoAlteracoes', [[
        new Date().toLocaleString('pt-BR'),
        numeroOP,
        acao,
        usuario,
        dadosAnteriores,
        dadosNovos
      ]]);
      
      console.log(`✅ Histórico registrado para ${numeroOP}`);
    } catch (error) {
      console.error('❌ Erro ao registrar histórico:', error);
      // Não lançar erro aqui para não interromper o fluxo principal
    }
  }

  /**
   * Busca o histórico de uma OP específica
   * @param {string} numeroOP - Número da OP
   * @returns {Promise<Array>} Array com o histórico
   */
  async buscarHistoricoOP(numeroOP) {
    try {
      const data = await this.readSheet('HistoricoAlteracoes', 'A2:F1000');
      
      return data
        .filter(row => row[1] === numeroOP)
        .map(row => ({
          timestamp: row[0] || '',
          numeroOP: row[1] || '',
          acao: row[2] || '',
          usuario: row[3] || '',
          dadosAnteriores: row[4] || '',
          dadosNovos: row[5] || ''
        }));
    } catch (error) {
      console.error('❌ Erro ao buscar histórico:', error);
      throw error;
    }
  }
}

// Exportar instância única (Singleton)
export const sheetsService = new SheetsService();

// Exportar também a classe para testes
export default SheetsService;
