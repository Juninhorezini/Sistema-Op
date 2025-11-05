import React, { useState, useEffect, useRef } from 'react';
import { Package, Filter, CheckCircle, XCircle, AlertCircle, Printer, Search, Eye, BarChart3, RefreshCw } from 'lucide-react';
import ModalSeparacao from './components/ModalSeparacao';
import ModalVisualizacao from './components/ModalVisualizacao';
import StatusBadge from './components/StatusBadge';
import { sheetsService } from './services/sheetsService';

export default function App() {
  const [usuario, setUsuario] = useState('separador');
  const [ops, setOps] = useState([]);
  const [filtroGrupo, setFiltroGrupo] = useState('todos');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [opSelecionada, setOpSelecionada] = useState(null);
  
  // Estados para Google Sheets
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [useGoogleSheets, setUseGoogleSheets] = useState(false);
  
  // Estados para sincronização em tempo real
  const [ultimaSincronizacao, setUltimaSincronizacao] = useState(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const intervalRef = useRef(null);
  
  // Carregar dados iniciais mockados
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  // Inicializar Google Sheets API
  useEffect(() => {
    async function initGoogle() {
      try {
        console.log('🔄 Inicializando Google Sheets API...');
        await sheetsService.initialize();
        setIsGoogleReady(true);
        console.log('✅ Google Sheets API pronta!');
        
        if (sheetsService.isUserAuthenticated()) {
          setIsAuthenticated(true);
          console.log('✅ Usuário já autenticado');
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar Google Sheets:', error);
      }
    }
    initGoogle();
  }, []);

  // Auto-sync: Sincronizar automaticamente a cada 30 segundos
  useEffect(() => {
    if (useGoogleSheets && isAuthenticated && autoSyncEnabled) {
      console.log('🔄 Auto-sync ativado (30 segundos)');
      
      sincronizarDados();
      
      intervalRef.current = setInterval(() => {
        sincronizarDados();
      }, 30000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          console.log('🛑 Auto-sync desativado');
        }
      };
    }
  }, [useGoogleSheets, isAuthenticated, autoSyncEnabled]);

  function carregarDadosIniciais() {
    const dadosSimulados = [
      {
        numeroOP: 'OP00001',
        dataCriacao: '02/11/2025 09:30',
        grupo: 'Ffilotex',
        sku_materiaPrima: 'FO273',
        cor_materiaPrima: 'Azul Royal',
        quantidade_rocas: 100,
        quantidade_kg: 50,
        sku_produtoAcabado: 'LH048',
        descricao_produtoAcabado: 'Linha Hortolândia 48 Tex',
        quantidade_produtoAcabado: 500,
        codigoBarras: '7891234567890',
        statusSeparacao: 'Pendente',
        qtd_separada_rocas: 0,
        qtd_separada_kg: 0,
        observacao: '',
        statusImpressao: 'NaoImpressa',
        statusOP: 'Ativa'
      },
      {
        numeroOP: 'OP00002',
        dataCriacao: '02/11/2025 10:15',
        grupo: 'CC Fios',
        sku_materiaPrima: 'FO310',
        cor_materiaPrima: 'Vermelho',
        quantidade_rocas: 80,
        quantidade_kg: 40,
        sku_produtoAcabado: 'LH310',
        descricao_produtoAcabado: 'Linha Premium 310',
        quantidade_produtoAcabado: 400,
        codigoBarras: '7891234567891',
        statusSeparacao: 'Total',
        qtd_separada_rocas: 80,
        qtd_separada_kg: 40,
        observacao: 'Separação completa',
        dataSeparacao: '02/11/2025 11:00',
        statusImpressao: 'Impressa',
        statusOP: 'Ativa'
      },
      {
        numeroOP: 'OP00003',
        dataCriacao: '02/11/2025 11:00',
        grupo: 'Ffilotex',
        sku_materiaPrima: 'FO273',
        cor_materiaPrima: 'Verde Limão',
        quantidade_rocas: 120,
        quantidade_kg: 60,
        sku_produtoAcabado: 'LH048',
        descricao_produtoAcabado: 'Linha Hortolândia 48 Tex',
        quantidade_produtoAcabado: 600,
        codigoBarras: '7891234567890',
        statusSeparacao: 'Parcial',
        qtd_separada_rocas: 80,
        qtd_separada_kg: 40,
        observacao: 'Faltam 40 rocas no estoque',
        dataSeparacao: '02/11/2025 12:30',
        statusImpressao: 'NaoImpressa',
        statusOP: 'Ativa'
      }
    ];
    setOps(dadosSimulados);
  }

  async function handleGoogleLogin() {
    try {
      setIsLoadingSheets(true);
      await sheetsService.login();
      setIsAuthenticated(true);
      setUseGoogleSheets(true);
      await carregarOPsDaPlanilha();
    } catch (error) {
      console.error('❌ Erro no login:', error);
      alert('Erro ao fazer login. Verifique o console.');
    } finally {
      setIsLoadingSheets(false);
    }
  }

  function handleGoogleLogout() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    sheetsService.logout();
    setIsAuthenticated(false);
    setUseGoogleSheets(false);
    setUltimaSincronizacao(null);
    carregarDadosIniciais();
  }

  async function carregarOPsDaPlanilha() {
    try {
      setIsLoadingSheets(true);
      const opsFromSheet = await sheetsService.buscarOPs();
      setOps(opsFromSheet);
      setUltimaSincronizacao(new Date());
      console.log(`✅ ${opsFromSheet.length} OPs carregadas!`);
    } catch (error) {
      console.error('❌ Erro ao carregar OPs:', error);
      alert('Erro ao carregar dados da planilha.');
      carregarDadosIniciais();
    } finally {
      setIsLoadingSheets(false);
    }
  }

  async function sincronizarDados() {
    if (!useGoogleSheets || !isAuthenticated) return;
    try {
      const opsFromSheet = await sheetsService.buscarOPs();
      setOps(opsFromSheet);
      setUltimaSincronizacao(new Date());
      console.log(`✅ Sincronizado: ${opsFromSheet.length} OPs`);
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
    }
  }

  async function handleAtualizarManual() {
    await carregarOPsDaPlanilha();
  }

  function formatarTempoSincronizacao() {
    if (!ultimaSincronizacao) return '';
    const diff = Math.floor((new Date() - ultimaSincronizacao) / 1000);
    if (diff < 60) return `há ${diff}s`;
    if (diff < 3600) return `há ${Math.floor(diff / 60)}min`;
    return `há ${Math.floor(diff / 3600)}h`;
  }

  const opsFiltradas = ops.filter(op => {
    if (filtroGrupo !== 'todos' && op.grupo !== filtroGrupo) return false;
    if (filtroProduto && !op.sku_materiaPrima.toLowerCase().includes(filtroProduto.toLowerCase())) return false;
    if (filtroStatus !== 'todos' && op.statusSeparacao !== filtroStatus) return false;
    if (usuario === 'gestor' && op.statusSeparacao === 'Pendente') return false;
    return true;
  });

  function handleImprimirOP(op) {
    alert(`Abrindo impressão da ${op.numeroOP}...`);
    if (useGoogleSheets && isAuthenticated) {
      sheetsService.marcarComoImpressa(op.numeroOP)
        .then(() => sincronizarDados())
        .catch(error => console.error(error));
    }
  }

  function handleSalvarSeparacao(dados) {
    const opAtualizada = {
      ...opSelecionada,
      ...dados,
      dataSeparacao: new Date().toLocaleString('pt-BR')
    };

    setOps(ops.map(o => 
      o.numeroOP === opSelecionada.numeroOP ? opAtualizada : o
    ));

    if (useGoogleSheets && isAuthenticated) {
      sheetsService.atualizarSeparacao(opSelecionada.numeroOP, {
        ...dados,
        usuario: usuario === 'separador' ? 'Separador' : 'Gestor'
      })
        .then(() => {
          alert(`Separação salva com sucesso!`);
          sincronizarDados();
        })
        .catch(error => {
          console.error(error);
          alert('Erro ao salvar na planilha.');
        });
    } else {
      alert(`Separação atualizada! (Modo local)`);
    }

    setOpSelecionada(null);
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package size={32} className="text-blue-200" />
              <div>
                <h1 className="text-2xl font-bold">Sistema de Ordem de Produção</h1>
                <p className="text-blue-200 text-sm">Ffilotex & CC Fios</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isGoogleReady && (
                <div className="flex items-center gap-2">
                  {!isAuthenticated ? (
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoadingSheets}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoadingSheets ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Conectando...
                        </>
                      ) : (
                        <>📊 Conectar Google Sheets</>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium flex items-center gap-1">
                        <CheckCircle size={16} />
                        Conectado
                        {ultimaSincronizacao && (
                          <span className="text-xs text-green-600 ml-1">
                            {formatarTempoSincronizacao()}
                          </span>
                        )}
                      </span>
                      
                      <button
                        onClick={handleAtualizarManual}
                        disabled={isLoadingSheets}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors flex items-center gap-1 disabled:bg-gray-400"
                        title="Atualizar dados da planilha"
                      >
                        <RefreshCw size={16} className={isLoadingSheets ? 'animate-spin' : ''} />
                        Atualizar
                      </button>
                      
                      <button
                        onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          autoSyncEnabled 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : 'bg-gray-400 hover:bg-gray-500 text-white'
                        }`}
                        title={autoSyncEnabled ? 'Auto-sync ativado' : 'Auto-sync desativado'}
                      >
                        {autoSyncEnabled ? '🔄 Auto' : '⏸️ Manual'}
                      </button>
                      
                      <button
                        onClick={handleGoogleLogout}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition-colors"
                      >
                        Desconectar
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex bg-blue-700 rounded-lg p-1">
                <button
                  onClick={() => setUsuario('separador')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    usuario === 'separador' 
                      ? 'bg-white text-blue-600 font-semibold shadow' 
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  👤 Separador
                </button>
                <button
                  onClick={() => setUsuario('gestor')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    usuario === 'gestor' 
                      ? 'bg-white text-blue-600 font-semibold shadow' 
                      : 'text-blue-100 hover:text-white'
                  }`}
                >
                  👔 Gestor
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

<div className="container mx-auto px-4 py-3">
  {/* Estatísticas - MOVIDO PARA CIMA */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Pendentes</p>
          <p className="text-2xl font-bold text-gray-900">
            {ops.filter(op => op.statusSeparacao === 'Pendente').length}
          </p>
        </div>
        <AlertCircle className="text-yellow-500" size={32} />
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Parciais</p>
          <p className="text-2xl font-bold text-gray-900">
            {ops.filter(op => op.statusSeparacao === 'Parcial').length}
          </p>
        </div>
        <AlertCircle className="text-orange-500" size={32} />
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Completas</p>
          <p className="text-2xl font-bold text-gray-900">
            {ops.filter(op => op.statusSeparacao === 'Total').length}
          </p>
        </div>
        <CheckCircle className="text-green-500" size={32} />
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Não Separadas</p>
          <p className="text-2xl font-bold text-gray-900">
            {ops.filter(op => op.statusSeparacao === 'NaoSeparou').length}
          </p>
        </div>
        <XCircle className="text-red-500" size={32} />
      </div>
    </div>
  </div>

  {/* Filtros - MOVIDO PARA BAIXO */}
  <div className="bg-white rounded-lg shadow-md p-3 mb-3">
    <div className="flex items-center space-x-2 mb-3">
      <Filter className="text-gray-600" size={20} />
      <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
        <select
          value={filtroGrupo}
          onChange={(e) => setFiltroGrupo(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos os Grupos</option>
          <option value="Ffilotex">Ffilotex</option>
          <option value="CC Fios">CC Fios</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Matéria-Prima</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            value={filtroProduto}
            onChange={(e) => setFiltroProduto(e.target.value)}
            placeholder="Digite o SKU..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status Separação</label>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos os Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Parcial">Parcial</option>
          <option value="Total">Total</option>
          <option value="NaoSeparou">Não Separou</option>
        </select>
      </div>
    </div>
  </div>

  {/* Loading indicator */}
  {isLoadingSheets && (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
      <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-blue-700 font-medium">Sincronizando com Google Sheets...</span>
    </div>
  )}

  {/* Indicador de auto-sync */}
  {useGoogleSheets && isAuthenticated && autoSyncEnabled && (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-green-700">
        Sincronização automática ativa • Atualiza a cada 30 segundos
      </span>
    </div>
  )}

{/* Tabela de OPs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grupo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matéria-Prima</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Separado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto Acabado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {opsFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Package size={48} className="text-gray-300 mb-2" />
                        <p className="text-lg font-medium">Nenhuma OP encontrada</p>
                        <p className="text-sm">Ajuste os filtros ou aguarde o carregamento dos dados</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  opsFiltradas.map(op => (
                    <tr key={op.numeroOP} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{op.numeroOP}</div>
                        <div className="text-xs text-gray-500">{op.dataCriacao}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          op.grupo === 'Ffilotex' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {op.grupo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{op.sku_materiaPrima}</div>
                        <div className="text-sm text-gray-600">{op.cor_materiaPrima}</div>
                        <div className="text-xs text-gray-500">{op.quantidade_rocas} rocas / {op.quantidade_kg} kg</div>
                      </td>
                      <td className="px-4 py-3">
                        {op.statusSeparacao === 'Pendente' ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <div>
                            <div className="text-sm font-medium">
                              {op.qtd_separada_rocas} / {op.quantidade_rocas} rocas
                            </div>
                            <div className="text-xs text-gray-500">
                              {op.qtd_separada_kg} / {op.quantidade_kg} kg
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{op.sku_produtoAcabado}</div>
                        <div className="text-sm text-gray-600">{op.descricao_produtoAcabado}</div>
                        <div className="text-xs text-gray-500">Qtd: {op.quantidade_produtoAcabado}</div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={op.statusSeparacao} />
                        {op.statusImpressao === 'Impressa' && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              <Printer size={12} className="mr-1" />
                              Impressa
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {usuario === 'separador' && op.statusSeparacao === 'Pendente' && (
                          <button
                            onClick={() => setOpSelecionada(op)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm font-medium"
                          >
                            Separar
                          </button>
                        )}
                        {usuario === 'gestor' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleImprimirOP(op)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm font-medium flex items-center space-x-1"
                            >
                              <Printer size={14} />
                              <span>Imprimir</span>
                            </button>
                            <button
                              onClick={() => setOpSelecionada(op)}
                              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {opSelecionada && usuario === 'separador' && opSelecionada.statusSeparacao === 'Pendente' && (
        <ModalSeparacao 
          op={opSelecionada} 
          onClose={() => setOpSelecionada(null)}
          onSalvar={handleSalvarSeparacao}
        />
      )}

      {opSelecionada && (usuario === 'gestor' || opSelecionada.statusSeparacao !== 'Pendente') && (
        <ModalVisualizacao 
          op={opSelecionada}
          onClose={() => setOpSelecionada(null)}
        />
      )}
    </div>
  );
}