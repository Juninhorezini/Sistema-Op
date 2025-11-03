/**
 * CONFIGURAÇÃO DO GOOGLE SHEETS API
 * 
 * INSTRUÇÕES:
 * 1. Copie este arquivo para: src/config.js
 * 2. Preencha com suas credenciais reais
 * 3. NUNCA commite o arquivo config.js (está no .gitignore)
 * 
 * COMO OBTER AS CREDENCIAIS:
 * - Acesse: https://console.cloud.google.com
 * - Crie um projeto
 * - Ative a Google Sheets API
 * - Crie credenciais (API Key + OAuth 2.0 Client ID)
 */

export const GOOGLE_CONFIG = {
  // API Key - para leitura pública
  API_KEY: 'SUA_API_KEY_AQUI',
  
  // Client ID OAuth 2.0 - para autenticação de usuários
  CLIENT_ID: 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com',
  
  // ID da sua planilha Google Sheets
  // Copie da URL: https://docs.google.com/spreadsheets/d/[ESTE_ID]/edit
  SPREADSHEET_ID: 'SEU_SPREADSHEET_ID_AQUI',
  
  // Documentos de descoberta da API
  DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  
  // Escopos de permissão
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets'
};

/**
 * EXEMPLO DE CONFIGURAÇÃO PREENCHIDA:
 * 
 * export const GOOGLE_CONFIG = {
 *   API_KEY: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
 *   CLIENT_ID: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
 *   SPREADSHEET_ID: '1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T',
 *   DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
 *   SCOPES: 'https://www.googleapis.com/auth/spreadsheets'
 * };
 */