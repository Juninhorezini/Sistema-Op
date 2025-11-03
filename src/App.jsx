// src/App.jsx - Arquivo principal do aplicativo
import React, { useState, useEffect } from 'react';
import { Package, Filter, CheckCircle, XCircle, AlertCircle, Printer, Search, Eye, BarChart3 } from 'lucide-react';

export default function SistemaOP() {
  const [usuario, setUsuario] = useState('separador'); // 'gestor' ou 'separador'
  const [ops, setOps] = useState([]);
  const [filtroGrupo, setFiltroGrupo] = useState('todos');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [opSelecionada, setOpSelecionada] = useState(null);
  
  // Dados simulados - depois conectaremos com Google Sheets via sheetsService
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

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

  // Filtrar OPs
  const opsFiltradas = ops.filter(op => {
    if (filtroGrupo !== 'todos' && op.grupo !== filtroGrupo) return false;
    if (filtroProduto && !op.sku_produtoAcabado.toLowerCase().includes(filtroProduto.toLowerCase())) return false;
    if (filtroStatus !== 'todos' && op.statusSeparacao !== filtroStatus) return false;
    if (usuario === 'gestor' && op.statusSeparacao === 'Pendente') return false;
    return true;
  });

  function handleImprimirOP(op) {
    alert(`Abrindo impressão da ${op.numeroOP}...\n\nEm produção, isso abrirá o layout de impressão formatado.`);
    // Aqui será implementada a função de impressão real
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Sistema de Ordem de Produção</h1>
              <p className="text-blue-100 text-sm">Ffilotex & CC Fios</p>
            </div>
            {/* Seletor de Usuário - REMOVER em produção */}
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <select 
                value={usuario} 
                onChange={(e) => setUsuario(e.target.value)}
                className="bg-transparent text-white font-medium outline-none cursor-pointer"
              >
                <option value="gestor" className="text-gray-900">👤 Gestor (Usuário 1)</option>
                <option value="separador" className="text-gray-900">📦 Separador (Usuário 2)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de OPs</p>
                <p className="text-2xl font-bold text-gray-900">{ops.length}</p>
              </div>
              <BarChart3 className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {ops.filter(o => o.statusSeparacao === 'Pendente').length}
                </p>
              </div>
              <AlertCircle className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Separadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {ops.filter(o => o.statusSeparacao === 'Total').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Parciais</p>
                <p className="text-2xl font-bold text-orange-600">
                  {ops.filter(o => o.statusSeparacao === 'Parcial').length}
                </p>
              </div>
              <Package className="text-orange-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Filter size={20} className="text-gray-600" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Produto Acabado</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os Status</option>
                <option value="Pendente">Pendente</option>
                <option value="Total">Separado Total</option>
                <option value="Parcial">Separado Parcial</option>
                <option value="NaoSeparou">Não Separou</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de OPs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              {usuario === 'gestor' ? 'Ordens Prontas para Impressão' : 'Ordens de Produção'}
            </h2>
            <p className="text-sm text-gray-600">
              {opsFiltradas.length} {opsFiltradas.length === 1 ? 'ordem encontrada' : 'ordens encontradas'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grupo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matéria-Prima</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto Acabado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {opsFiltradas.map(op => (
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
                      <div className="font-medium text-gray-900">{op.sku_produtoAcabado}</div>
                      <div className="text-sm text-gray-600">{op.descricao_produtoAcabado}</div>
                      <div className="text-xs text-gray-500">Qtd: {op.quantidade_produtoAcabado}</div>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Separação */}
      {opSelecionada && usuario === 'separador' && opSelecionada.statusSeparacao === 'Pendente' && (
        <ModalSeparacao 
          op={opSelecionada} 
          onClose={() => setOpSelecionada(null)}
          onSalvar={(dados) => {
            setOps(ops.map(o => 
              o.numeroOP === opSelecionada.numeroOP 
                ? { ...o, ...dados, dataSeparacao: new Date().toLocaleString('pt-BR') }
                : o
            ));
            setOpSelecionada(null);
          }}
        />
      )}

      {/* Modal de Visualização */}
      {opSelecionada && (usuario === 'gestor' || opSelecionada.statusSeparacao !== 'Pendente') && (
        <ModalVisualizacao 
          op={opSelecionada}
          onClose={() => setOpSelecionada(null)}
        />
      )}
    </div>
  );
}

// Componente de Badge de Status
function StatusBadge({ status }) {
  const configs = {
    'Pendente': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
    'Total': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    'Parcial': { bg: 'bg-orange-100', text: 'text-orange-800', icon: Package },
    'NaoSeparou': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
  };

  const config = configs[status] || configs['Pendente'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon size={12} className="mr-1" />
      {status === 'NaoSeparou' ? 'Não Separou' : status}
    </span>
  );
}

// Modal de Separação (Usuário 2)
function ModalSeparacao({ op, onClose, onSalvar }) {
  const [tipoSeparacao, setTipoSeparacao] = useState('Total');
  const [qtdRocas, setQtdRocas] = useState(op.quantidade_rocas);
  const [observacao, setObservacao] = useState('');

  const qtdKg = (qtdRocas * (op.quantidade_kg / op.quantidade_rocas)).toFixed(2);

  const handleSalvar = () => {
    onSalvar({
      statusSeparacao: tipoSeparacao,
      qtd_separada_rocas: tipoSeparacao === 'NaoSeparou' ? 0 : parseInt(qtdRocas),
      qtd_separada_kg: tipoSeparacao === 'NaoSeparou' ? 0 : parseFloat(qtdKg),
      observacao: observacao
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Separação de Matéria-Prima</h2>
          <p className="text-gray-600">OP: {op.numeroOP}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações da OP */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Informações da Ordem</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Matéria-Prima:</span>
                <p className="font-medium">{op.sku_materiaPrima} - {op.cor_materiaPrima}</p>
              </div>
              <div>
                <span className="text-gray-600">Quantidade Solicitada:</span>
                <p className="font-medium">{op.quantidade_rocas} rocas ({op.quantidade_kg} kg)</p>
              </div>
              <div>
                <span className="text-gray-600">Produto Acabado:</span>
                <p className="font-medium">{op.sku_produtoAcabado}</p>
              </div>
              <div>
                <span className="text-gray-600">Grupo:</span>
                <p className="font-medium">{op.grupo}</p>
              </div>
            </div>
          </div>

          {/* Tipo de Separação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status da Separação
            </label>
            <div className="space-y-2">
              {['Total', 'Parcial', 'NaoSeparou'].map(tipo => (
                <label key={tipo} className="flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderColor: tipoSeparacao === tipo ? '#2563eb' : '#e5e7eb' }}
                >
                  <input
                    type="radio"
                    value={tipo}
                    checked={tipoSeparacao === tipo}
                    onChange={(e) => setTipoSeparacao(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {tipo === 'Total' && '✅ Separado Total'}
                      {tipo === 'Parcial' && '⚠️ Separado Parcial'}
                      {tipo === 'NaoSeparou' && '❌ Não Consegui Separar'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tipo === 'Total' && 'Quantidade completa disponível'}
                      {tipo === 'Parcial' && 'Parte da quantidade está disponível'}
                      {tipo === 'NaoSeparou' && 'Material não disponível em estoque'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quantidade Separada */}
          {(tipoSeparacao === 'Total' || tipoSeparacao === 'Parcial') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade Separada (em rocas)
              </label>
              <input
                type="number"
                value={qtdRocas}
                onChange={(e) => setQtdRocas(e.target.value)}
                max={op.quantidade_rocas}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-600">
                Equivalente a <span className="font-bold">{qtdKg} kg</span>
              </p>
              {tipoSeparacao === 'Parcial' && qtdRocas < op.quantidade_rocas && (
                <p className="mt-2 text-sm text-orange-600 font-medium">
                  ⚠️ Faltam {op.quantidade_rocas - qtdRocas} rocas ({(op.quantidade_kg - qtdKg).toFixed(2)} kg)
                </p>
              )}
            </div>
          )}

          {/* Observação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações {tipoSeparacao !== 'Total' && '(obrigatório)'}
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o motivo da separação parcial ou falta de material..."
            />
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={tipoSeparacao !== 'Total' && !observacao}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirmar Separação
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de Visualização
function ModalVisualizacao({ op, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Detalhes da Ordem de Produção</h2>
          <p className="text-gray-600">OP: {op.numeroOP}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações Gerais */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Package className="mr-2" size={20} />
              Informações Gerais
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Data de Criação:</span>
                <p className="font-medium">{op.dataCriacao}</p>
              </div>
              <div>
                <span className="text-gray-600">Grupo:</span>
                <p className="font-medium">{op.grupo}</p>
              </div>
              <div>
                <span className="text-gray-600">Status OP:</span>
                <p className="font-medium">{op.statusOP}</p>
              </div>
              <div>
                <span className="text-gray-600">Status Impressão:</span>
                <p className="font-medium">{op.statusImpressao}</p>
              </div>
            </div>
          </div>

          {/* Matéria-Prima */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Matéria-Prima</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">SKU:</span>
                <p className="font-bold text-lg">{op.sku_produtoAcabado}</p>
              </div>
              <div>
                <span className="text-gray-600">Descrição:</span>
                <p className="font-medium">{op.descricao_produtoAcabado}</p>
              </div>
              <div>
                <span className="text-gray-600">Quantidade a Produzir:</span>
                <p className="font-bold text-lg">{op.quantidade_produtoAcabado} unidades</p>
              </div>
              <div>
                <span className="text-gray-600">Código de Barras EAN-13:</span>
                <p className="font-mono font-bold">{op.codigoBarras}</p>
              </div>
            </div>
          </div>

          {/* Informações de Separação */}
          {op.statusSeparacao !== 'Pendente' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Dados da Separação</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Data da Separação:</span>
                  <p className="font-medium">{op.dataSeparacao}</p>
                </div>
                {op.observacao && (
                  <div>
                    <span className="text-gray-600">Observações:</span>
                    <p className="font-medium bg-white p-2 rounded border">{op.observacao}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}