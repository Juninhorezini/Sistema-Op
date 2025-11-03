import React, { useState } from 'react';

export default function ModalSeparacao({ op, onClose, onSalvar }) {
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
                <label 
                  key={tipo} 
                  className="flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
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
