import React from 'react';
import { AlertCircle, CheckCircle, Package, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const configs = {
    'Pendente': { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      icon: AlertCircle 
    },
    'Total': { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      icon: CheckCircle 
    },
    'Parcial': { 
      bg: 'bg-orange-100', 
      text: 'text-orange-800', 
      icon: Package 
    },
    'NaoSeparou': { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      icon: XCircle 
    }
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
