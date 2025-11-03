import React from 'react';
import { Package } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ModalVisualizacao({ op, onClose }) {
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
                <p className="font-bold text-lg">{op.sku_materiaPrima}</p>
              </div>
              <div>
                <span className="text-gray-600">Cor:</span>
                <p className="font-medium">{op.cor_materiaPrima}</p>
              </div>
              <div>
                <span className="text-gray-600">Qtd Solicitada:</span>
                <p className="font-medium">{op.quantidade_rocas} rocas / {op.quantidade_kg} kg</p>
              </div>
              <div>
                <span className="text-gray-600">Qtd Separada:</span>
                <p className="font-bold text-green-700">
                  {op.qtd_separada_rocas} rocas / {op.qtd_separada_kg} kg
                </p>
              </div>
            </div>
            <div className="mt-3">
              <StatusBadge status={op.statusSeparacao} />
            </div>
          </div>

          {/* Produto Acabado */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Produto Acabado</h3>
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
