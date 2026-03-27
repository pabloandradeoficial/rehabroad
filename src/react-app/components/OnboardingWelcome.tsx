interface OnboardingWelcomeProps {
  userName?: string;
  onStart: () => void;
  onSkip: () => void;
}

const HIGHLIGHTS = [
  "Cadastrar pacientes e criar avaliações estruturadas",
  "Usar o Apoio Clínico para hipóteses baseadas em evidência",
  "Conversar com o Rehab Friend sobre qualquer caso clínico",
  "Ditar evoluções com o Scribe Clínico em 1 minuto",
  "Gerar laudos PDF com seus dados profissionais",
  "Acompanhar o Caminho Clínico de cada paciente",
];

export function OnboardingWelcome({ userName, onStart, onSkip }: OnboardingWelcomeProps) {
  const firstName = userName?.split(" ")[0] ?? "Fisioterapeuta";

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-7 border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-300">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg text-3xl">
            🎉
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-1">
          Bem-vindo(a), {firstName}!
        </h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Vamos fazer um tour rápido para você aproveitar tudo que o Rehabroad tem.
        </p>

        {/* List */}
        <ul className="space-y-2 mb-7">
          {HIGHLIGHTS.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onStart}
            className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Fazer o tour guiado
            <span>→</span>
          </button>
          <button
            onClick={onSkip}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Pular por agora
          </button>
        </div>
      </div>
    </div>
  );
}
