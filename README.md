# 🏭 Sistema de Ordem de Produção

Sistema completo para gestão de ordens de produção, controle de matéria-prima, separação e rastreamento de processos produtivos.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-blue)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)

---

## 📋 Sobre o Projeto

Sistema desenvolvido para controlar todo o fluxo de produção das linhas **Ffilotex** e **CC Fios**, desde a criação da ordem de produção até a separação para pedidos.

### ✨ Funcionalidades Principais

- 📝 **Criação de Ordens de Produção** via Google Sheets
- 📦 **Controle de Separação de Matéria-Prima** (Total/Parcial/Não Separou)
- 🎨 **Gestão de Múltiplas Cores** e variações de produtos
- 🔄 **Conversão Automática** Rocas ↔ Quilogramas
- 🖨️ **Impressão de OPs** formatadas (2 por página A4)
- 📊 **Dashboard em Tempo Real** com estatísticas
- 🔍 **Filtros Avançados** por Grupo, Produto e Status
- 📱 **Interface Responsiva** (funciona em tablets e celulares)
- 🔐 **Controle de Acesso** por tipo de usuário
- 📈 **Histórico de Alterações** completo

---

## 🎯 Usuários do Sistema

### 👔 **Usuário 1 - Gestor/Planejamento**
- Cria Ordens de Produção na planilha Google Sheets
- Visualiza OPs separadas
- Imprime OPs com informações completas
- Acompanha status de separação

### 📦 **Usuário 2 - Separador/Estoque**
- Recebe lista de OPs pendentes
- Filtra por produto ou grupo
- Registra separação (Total/Parcial/Não Separou)
- Adiciona observações sobre falta de material

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **Vite** - Build tool rápido

### Backend/Database
- **Google Sheets API** - Banco de dados (100% gratuito)
- **Google OAuth 2.0** - Autenticação de usuários

### Hospedagem
- **Vercel** ou **Netlify** - Deploy gratuito

---

## 📦 Estrutura do Projeto

```
sistema-op/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── NovaOP.jsx
│   │   ├── ListaOPs.jsx
│   │   ├── ModalSeparacao.jsx
│   │   ├── ModalVisualizacao.jsx
│   │   └── ImpressaoOP.jsx
│   ├── services/
│   │   └── sheetsService.js
│   ├── utils/
│   │   └── helpers.js
│   ├── config.js
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── README.md
└── LICENSE
```

---

## 🚀 Como Instalar

### Pré-requisitos
- Node.js 18+ instalado
- Conta Google (para Google Sheets API)
- Git instalado

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/sistema-op.git
cd sistema-op
```

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Configurar Google Sheets API

1. **Criar Planilha**
   - Execute o script `scriptCriarPlanilha.js` no Google Apps Script
   - Copie o ID da planilha da URL

2. **Configurar API**
   - Acesse: https://console.cloud.google.com
   - Crie um novo projeto
   - Ative a Google Sheets API
   - Crie credenciais (API Key + OAuth 2.0)

3. **Configurar Credenciais**
   - Copie `src/config.example.js` para `src/config.js`
   - Adicione suas credenciais:
   ```javascript
   export const GOOGLE_CONFIG = {
     API_KEY: 'sua-api-key',
     CLIENT_ID: 'seu-client-id.apps.googleusercontent.com',
     SPREADSHEET_ID: 'id-da-sua-planilha'
   };
   ```

### Passo 4: Executar Localmente
```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 📊 Estrutura da Planilha Google Sheets

### Abas Necessárias:

1. **OPs** - Ordens de Produção
2. **MateriaPrima** - Catálogo de materiais
3. **ProdutosAcabados** - Produtos finais
4. **Usuarios** - Controle de acesso
5. **HistoricoAlteracoes** - Log de mudanças
6. **Configuracoes** - Parâmetros do sistema

> 📝 Use o script `scriptCriarPlanilha.js` para criar automaticamente!

---

## 🖨️ Sistema de Impressão

### Layout da OP Impressa

- **Formato:** A4 (2 OPs por página)
- **Seção 1:** Matéria-Prima
  - SKU, Cor, Quantidade solicitada
  - Quantidade separada
  - Status visual (✅ Total, ⚠️ Parcial, ❌ Não Separou)
- **Seção 2:** Produto Acabado
  - SKU, Descrição, Cor
  - Quantidade a produzir
  - Código de barras EAN-13
- **Seção 3:** Observações e Assinaturas

---

## 🔐 Segurança

### ⚠️ IMPORTANTE - Nunca commite credenciais!

O arquivo `src/config.js` está no `.gitignore` e NÃO deve ser commitado.

### Em Produção:

Use variáveis de ambiente:
```bash
# .env
VITE_GOOGLE_API_KEY=sua-api-key
VITE_GOOGLE_CLIENT_ID=seu-client-id
VITE_SPREADSHEET_ID=id-da-planilha
```

---

## 📱 Interface do Sistema

### Dashboard
- Cards com métricas (Total, Pendentes, Separadas, Parciais)
- Tabela de OPs com filtros
- Status visual por cores

### Filtros
- **Grupo:** Ffilotex | CC Fios
- **Produto:** Busca por SKU
- **Status:** Pendente | Total | Parcial | Não Separou

### Modal de Separação
- 3 opções de status
- Cálculo automático rocas → kg
- Campo de observações obrigatório para separação parcial

---

## 🤝 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

### Fase 1 - MVP ✅
- [x] Estrutura da planilha
- [x] Interface básica
- [x] Sistema de separação
- [x] Impressão de OPs

### Fase 2 - Produção (Em breve)
- [ ] Registro de início/fim de produção
- [ ] Controle de lotes
- [ ] Embalagem e etiquetas

### Fase 3 - Expedição (Futuro)
- [ ] Bipagem de produtos
- [ ] Separação para pedidos
- [ ] Rastreamento completo

### Fase 4 - Avançado (Futuro)
- [ ] Dashboard gerencial com gráficos
- [ ] Notificações por email
- [ ] App mobile nativo
- [ ] Integração com sistemas ERP

---

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: suporte@empresa.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/sistema-op/issues)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👏 Agradecimentos

- Time de Produção Ffilotex
- Time de Produção CC Fios
- Equipe de Desenvolvimento

---

**Desenvolvido com ❤️ para otimizar processos produtivos**

*Versão 1.0.0 - Novembro 2025*