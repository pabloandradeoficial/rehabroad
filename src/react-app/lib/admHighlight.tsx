import React from 'react';

// Reference ROM values (normal ranges)
const ROM_REFERENCES: Record<string, { max: number; warning: number; label: string }> = {
  // Ombro
  'flexão ombro': { max: 180, warning: 120, label: 'Flexão Ombro' },
  'extensão ombro': { max: 45, warning: 30, label: 'Extensão Ombro' },
  'abdução ombro': { max: 180, warning: 120, label: 'Abdução Ombro' },
  'rotação externa ombro': { max: 90, warning: 60, label: 'RE Ombro' },
  'rotação interna ombro': { max: 70, warning: 45, label: 'RI Ombro' },
  're ombro': { max: 90, warning: 60, label: 'RE Ombro' },
  'ri ombro': { max: 70, warning: 45, label: 'RI Ombro' },
  
  // Cotovelo
  'flexão cotovelo': { max: 145, warning: 100, label: 'Flexão Cotovelo' },
  'extensão cotovelo': { max: 0, warning: -10, label: 'Extensão Cotovelo' },
  'pronação': { max: 80, warning: 50, label: 'Pronação' },
  'supinação': { max: 85, warning: 55, label: 'Supinação' },
  
  // Punho
  'flexão punho': { max: 80, warning: 50, label: 'Flexão Punho' },
  'extensão punho': { max: 70, warning: 45, label: 'Extensão Punho' },
  
  // Quadril
  'flexão quadril': { max: 120, warning: 80, label: 'Flexão Quadril' },
  'extensão quadril': { max: 30, warning: 15, label: 'Extensão Quadril' },
  'abdução quadril': { max: 45, warning: 30, label: 'Abdução Quadril' },
  'adução quadril': { max: 30, warning: 20, label: 'Adução Quadril' },
  'rotação externa quadril': { max: 45, warning: 30, label: 'RE Quadril' },
  'rotação interna quadril': { max: 45, warning: 30, label: 'RI Quadril' },
  're quadril': { max: 45, warning: 30, label: 'RE Quadril' },
  'ri quadril': { max: 45, warning: 30, label: 'RI Quadril' },
  
  // Joelho
  'flexão joelho': { max: 140, warning: 90, label: 'Flexão Joelho' },
  'extensão joelho': { max: 0, warning: -5, label: 'Extensão Joelho' },
  'flexão': { max: 140, warning: 90, label: 'Flexão' },
  'extensão': { max: 45, warning: 30, label: 'Extensão' },
  
  // Tornozelo
  'dorsiflexão': { max: 20, warning: 10, label: 'Dorsiflexão' },
  'plantiflexão': { max: 50, warning: 30, label: 'Plantiflexão' },
  'inversão': { max: 35, warning: 20, label: 'Inversão' },
  'eversão': { max: 20, warning: 10, label: 'Eversão' },
  
  // Cervical
  'flexão cervical': { max: 45, warning: 30, label: 'Flexão Cervical' },
  'extensão cervical': { max: 45, warning: 30, label: 'Extensão Cervical' },
  'rotação cervical': { max: 80, warning: 50, label: 'Rotação Cervical' },
  'inclinação lateral': { max: 45, warning: 30, label: 'Inclinação Lat.' },
  
  // Lombar
  'flexão lombar': { max: 60, warning: 40, label: 'Flexão Lombar' },
  'extensão lombar': { max: 25, warning: 15, label: 'Extensão Lombar' },
  'rotação lombar': { max: 15, warning: 10, label: 'Rotação Lombar' },
  
  // Generic ADM patterns
  'adm': { max: 180, warning: 100, label: 'ADM' },
};

// Parse ADM value from text - returns value and context
interface ADMMatch {
  fullMatch: string;
  value: number;
  context: string;
  startIndex: number;
  endIndex: number;
}

function parseADMValues(text: string): ADMMatch[] {
  const matches: ADMMatch[] = [];
  
  // Patterns to match:
  // "flexão 120°", "ADM 90°", "flexão: 120°", "flexão de 120 graus"
  // "ombro flexão 100°", "joelho: flexão 90°"
  const patterns = [
    // Pattern: [movement] [value]° or [value] graus
    /(\b(?:flexão|extensão|abdução|adução|rotação\s*(?:externa|interna)|re|ri|pronação|supinação|dorsiflexão|plantiflexão|inversão|eversão|inclinação\s*lateral|adm)\b[^0-9]*?)(\d+)\s*(?:°|graus?|º)/gi,
    // Pattern: [joint] [movement] [value]°
    /(\b(?:ombro|cotovelo|punho|quadril|joelho|tornozelo|cervical|lombar)\b[^0-9]*?(?:flexão|extensão|abdução|adução|rotação\s*(?:externa|interna)|re|ri)[^0-9]*?)(\d+)\s*(?:°|graus?|º)/gi,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = parseInt(match[2], 10);
      const context = match[1].toLowerCase().trim().replace(/[:\s]+$/, '');
      
      // Avoid duplicates
      const isDuplicate = matches.some(m => 
        Math.abs(m.startIndex - match!.index) < 5 && m.value === value
      );
      
      if (!isDuplicate && !isNaN(value)) {
        matches.push({
          fullMatch: match[0],
          value,
          context,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }
    }
  }
  
  return matches.sort((a, b) => a.startIndex - b.startIndex);
}

// Find the best matching reference for a context
function findReference(context: string): { max: number; warning: number; label: string } | null {
  const normalized = context.toLowerCase();
  
  // Try to find exact or partial match
  for (const [key, ref] of Object.entries(ROM_REFERENCES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return ref;
    }
  }
  
  // Check individual keywords
  const keywords = ['flexão', 'extensão', 'abdução', 'adução', 'rotação', 'dorsiflexão', 'plantiflexão'];
  for (const keyword of keywords) {
    if (normalized.includes(keyword)) {
      return ROM_REFERENCES[keyword] || ROM_REFERENCES['adm'];
    }
  }
  
  return null;
}

// Get status for an ADM value
export type ADMStatus = 'normal' | 'warning' | 'critical';

export function getADMStatus(value: number, context: string): ADMStatus {
  const ref = findReference(context);
  if (!ref) return 'normal';
  
  // For extension values that should be 0 or close to it
  if (context.includes('extensão') && ref.max <= 0) {
    if (value > 10) return 'critical';
    if (value > 5) return 'warning';
    return 'normal';
  }
  
  const percentage = (value / ref.max) * 100;
  
  if (percentage < 50) return 'critical';
  if (percentage < 75) return 'warning';
  return 'normal';
}

// Component to render text with highlighted ADM values
interface HighlightedADMProps {
  text: string;
  className?: string;
}

export function HighlightedADM({ text, className = '' }: HighlightedADMProps) {
  if (!text) return null;
  
  const matches = parseADMValues(text);
  
  if (matches.length === 0) {
    return <span className={className}>{text}</span>;
  }
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  matches.forEach((match, idx) => {
    // Add text before match
    if (match.startIndex > lastIndex) {
      parts.push(
        <span key={`text-${idx}`}>
          {text.slice(lastIndex, match.startIndex)}
        </span>
      );
    }
    
    // Add highlighted match
    const status = getADMStatus(match.value, match.context);
    const ref = findReference(match.context);
    
    let bgColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    let icon = '✓';
    let tooltip = 'Dentro do esperado';
    
    if (status === 'warning') {
      bgColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      icon = '⚠';
      tooltip = ref ? `Abaixo do ideal (esperado: ${ref.max}°)` : 'Valor abaixo do esperado';
    } else if (status === 'critical') {
      bgColor = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      icon = '↓';
      tooltip = ref ? `Limitação significativa (normal: ${ref.max}°)` : 'Limitação significativa';
    }
    
    parts.push(
      <span
        key={`match-${idx}`}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium text-xs ${bgColor}`}
        title={tooltip}
      >
        <span>{icon}</span>
        <span>{match.fullMatch}</span>
      </span>
    );
    
    lastIndex = match.endIndex;
  });
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key="text-end">{text.slice(lastIndex)}</span>
    );
  }
  
  return <span className={className}>{parts}</span>;
}

