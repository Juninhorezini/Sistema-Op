import React, { useState, useEffect } from 'react';
import { Package, Filter, CheckCircle, XCircle, AlertCircle, Printer, Search, Eye, BarChart3 } from 'lucide-react';
import ModalSeparacao from './components/ModalSeparacao';
import ModalVisualizacao from './components/ModalVisualizacao';
import StatusBadge from './components/StatusBadge';

export default function App() {
  const [usuario, setUsuario] = useState('separador');
  const [ops, setOps] = useState([]);
  const [filtroGrupo, setFiltroGrupo] = useState('todos');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [opSelecionada, setOpSelecionada] = useState(null);
  
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

  const opsFiltradas = ops.filter(op => {
    if (filtroGrupo !== 'todos' && op.grupo !== filtroGrupo) return false;
    if (filtroProduto && !op.sku_produtoAcabado.toLowerCase().includes(filtroProduto.toLowerCase())) return false;
    if (filtroStatus !== 'todos' && op.statusSeparacao !== filtroStatus) return false;
    if (usuario === 'gestor' && op.statusSeparacao === 'Pendente') return false;
    return true;
  });

  function handleImprimirOP(op) {
    alert(`Abrindo impressão da ${op.numeroOP}...\n\nEm produção, isso abrirá o layout de impressão.`);
  }

  function handleSalvarSeparacao(dados) {
    setOps(ops.map(o => 
      o.numeroOP === opSelecionada.numeroOP 
        ? { ...o, ...dados, dataSeparacao: new Date().toLocaleString('pt-BR') }
        : o
    ));
    setOpSelecionada(null);
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
        {/* Dashboard */}
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

        {/* Tabela de OPs */}
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

      {/* Modals */}
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
