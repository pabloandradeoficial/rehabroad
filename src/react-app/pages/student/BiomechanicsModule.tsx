import { useState } from "react";
import { ArrowLeft, Search, Bone, ArrowUpDown, Target, Activity, AlertTriangle, BookOpen, ChevronRight } from "lucide-react";
import { jointBiomechanics, type JointBiomechanics } from "@/data/educationalModules";

interface BiomechanicsModuleProps {
  onBack: () => void;
}

const categories = [
  { id: 'all', name: 'Todas', icon: Bone },
  { id: 'membro-superior', name: 'Membro Superior', icon: Target },
  { id: 'membro-inferior', name: 'Membro Inferior', icon: Activity },
  { id: 'coluna', name: 'Coluna', icon: ArrowUpDown },
  { id: 'complexos', name: 'Complexos', icon: BookOpen },
];

export default function BiomechanicsModule({ onBack }: BiomechanicsModuleProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJoint, setSelectedJoint] = useState<JointBiomechanics | null>(null);

  const filteredJoints = jointBiomechanics.filter(joint => {
    const matchesCategory = selectedCategory === 'all' || joint.category === selectedCategory;
    const matchesSearch = joint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      joint.primeMuscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'membro-superior': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'membro-inferior': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'coluna': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'complexos': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPlaneColor = (plane: string) => {
    if (plane.includes('Sagital')) return 'bg-blue-50 text-blue-600';
    if (plane.includes('Frontal')) return 'bg-emerald-50 text-emerald-600';
    if (plane.includes('Transverso')) return 'bg-amber-50 text-amber-600';
    return 'bg-slate-50 text-slate-600';
  };

  if (selectedJoint) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => setSelectedJoint(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Title Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bone className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{selectedJoint.name}</h1>
                <p className="text-slate-600 mt-1">{selectedJoint.type}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(selectedJoint.category)}`}>
                    {categories.find(c => c.id === selectedJoint.category)?.name}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {selectedJoint.degreesOfFreedom} Grau{selectedJoint.degreesOfFreedom > 1 ? 's' : ''} de Liberdade
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Movements Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-indigo-600" />
              Movimentos e ADM
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Movimento</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">ADM</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Plano</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Eixo</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJoint.movements.map((mov, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 px-2 font-medium text-slate-900">{mov.name}</td>
                      <td className="py-3 px-2 text-indigo-600 font-semibold">{mov.rom}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPlaneColor(mov.plane)}`}>
                          {mov.plane}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-600 text-sm">{mov.axis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Muscles */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-600" />
                Músculos Motores
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedJoint.primeMuscles.map((muscle, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-sm font-medium border border-rose-200">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Estabilizadores
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedJoint.stabilizers.map((stab, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">
                    {stab}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical Relevance */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Relevância Clínica
            </h2>
            <ul className="space-y-2">
              {selectedJoint.clinicalRelevance.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dysfunctions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Disfunções Comuns
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedJoint.commonDysfunctions.map((dysf, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium border border-amber-200">
                  {dysf}
                </span>
              ))}
            </div>
          </div>

          {/* Functional Importance */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-bold mb-3">Importância Funcional</h2>
            <p className="text-indigo-100 leading-relaxed">{selectedJoint.functionalImportance}</p>
          </div>

          {/* References */}
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-500 font-medium mb-1">Referência</p>
            <p className="text-sm text-slate-600">{selectedJoint.references.join('; ')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar ao Hub</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Biomecânica Articular</h1>
          <p className="text-slate-600 mt-1">Movimentos, ADM, planos e eixos das principais articulações</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por articulação ou músculo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Joints Grid */}
        <div className="grid gap-4">
          {filteredJoints.map(joint => (
            <button
              key={joint.id}
              onClick={() => setSelectedJoint(joint)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Bone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{joint.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(joint.category)}`}>
                      {categories.find(c => c.id === joint.category)?.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{joint.type} • {joint.degreesOfFreedom} GL</p>
                  <div className="flex flex-wrap gap-1.5">
                    {joint.movements.slice(0, 4).map((mov, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
                        {mov.name}: {mov.rom}
                      </span>
                    ))}
                    {joint.movements.length > 4 && (
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-600 text-xs font-medium">
                        +{joint.movements.length - 4} mais
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {filteredJoints.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Bone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Nenhuma articulação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
