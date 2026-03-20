import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Header
    'header.login': 'Entrar',
    'header.tryFree': 'Testar Grátis por 30 Dias',
    'header.features': 'Funcionalidades',
    'header.pricing': 'Preços',
    'header.blog': 'Blog',
    'header.studentMode': 'Modo Estudante',
    
    // Hero
    'hero.badge': 'Software para Fisioterapia 2025',
    'hero.title': 'Prontuário Eletrônico para Fisioterapeutas',
    'hero.subtitle': 'Pare de competir por preço. Comece a ser indicado por autoridade.',
    'hero.description': 'Sistema completo de documentação clínica que transforma sua prática em referência. Laudos profissionais, evolução estruturada e apoio à decisão clínica.',
    'hero.cta': 'Testar Grátis por 30 Dias',
    'hero.noCreditCard': 'Sem cartão de crédito',
    'hero.cancelAnytime': 'Cancelamento imediato',
    'hero.lgpd': 'LGPD compliant',
    'hero.pdfExport': 'Exportação em PDF',
    
    // Urgency Banner
    'urgency.title': 'vagas restantes para o beta fechado',
    'urgency.subtitle': 'Garanta acesso antecipado com desconto exclusivo',
    
    // Credibility Bar
    'credibility.professionals': 'fisioterapeutas ativos',
    'credibility.reports': 'laudos gerados',
    'credibility.coffito': 'COFFITO/CREFITO',
    'credibility.law': 'Lei 8.856/94',
    
    // Problem Section
    'problem.title': 'Enquanto você perde horas com papelada...',
    'problem.description': 'outros profissionais estão construindo reputação, atraindo pacientes por indicação e cobrando o que realmente valem.',
    'problem.item1.title': 'Documentação manual',
    'problem.item1.desc': 'Horas perdidas em anotações que ninguém lê',
    'problem.item2.title': 'Sem padrão clínico',
    'problem.item2.desc': 'Cada atendimento parece improvisado',
    'problem.item3.title': 'Zero diferenciação',
    'problem.item3.desc': 'Competindo por preço, não por valor',
    
    // Solution Section
    'solution.title': 'A diferença entre ser lembrado pelo preço ou pela excelência',
    'solution.description': 'Fisioterapeutas que documentam com qualidade são indicados. Os que improvisam, são esquecidos.',
    
    // How It Works
    'howItWorks.title': 'Sistema Completo para Clínica de Fisioterapia',
    'howItWorks.step1.title': 'Avalie com Estrutura',
    'howItWorks.step1.desc': 'Formulários padronizados que impressionam médicos e planos de saúde.',
    'howItWorks.step2.title': 'Evolua com Dados',
    'howItWorks.step2.desc': 'Acompanhe progressos com métricas que comprovam resultados.',
    'howItWorks.step3.title': 'Exporte com Qualidade',
    'howItWorks.step3.desc': 'Laudos PDF profissionais que elevam sua autoridade.',
    
    // Features
    'features.title': 'Tudo que Você Precisa',
    'features.subtitle': 'Ferramentas clínicas desenvolvidas por fisioterapeutas, para fisioterapeutas.',
    'features.evaluation.title': 'Avaliação Estruturada',
    'features.evaluation.desc': 'Anamnese completa, testes ortopédicos, escalas validadas.',
    'features.evolution.title': 'Evolução Clínica',
    'features.evolution.desc': 'Registro padronizado com métricas de progresso.',
    'features.reports.title': 'Laudos Profissionais',
    'features.reports.desc': 'PDFs prontos para médicos e convênios.',
    'features.neuroflux.title': 'NeuroFlux',
    'features.neuroflux.desc': 'Parâmetros TENS baseados em evidência científica.',
    'features.exercises.title': 'Biblioteca de Exercícios',
    'features.exercises.desc': '60+ exercícios com prescrição personalizada.',
    'features.agenda.title': 'Agenda Integrada',
    'features.agenda.desc': 'Agendamentos com lembretes via WhatsApp.',
    
    // Testimonials
    'testimonials.title': 'Histórias de Transformação',
    'testimonials.subtitle': 'Fisioterapeutas reais compartilhando resultados reais.',
    
    // Pricing
    'pricing.title': 'Planos',
    'pricing.subtitle': 'Escolha o plano ideal para sua prática clínica.',
    'pricing.monthly': 'Mensal',
    'pricing.semester': 'Semestral',
    'pricing.annual': 'Anual',
    'pricing.perMonth': '/mês',
    'pricing.save': 'Economia de',
    'pricing.mostPopular': 'Mais Popular',
    'pricing.cta': 'Começar Agora',
    'pricing.feature1': 'Prontuário eletrônico completo',
    'pricing.feature2': 'Laudos em PDF',
    'pricing.feature3': 'NeuroFlux - Parâmetros TENS',
    'pricing.feature4': 'Biblioteca de exercícios',
    'pricing.feature5': 'Suporte prioritário',
    
    // FAQ
    'faq.title': 'Perguntas Frequentes',
    'faq.q1': 'Preciso de cartão de crédito para testar?',
    'faq.a1': 'Não! Os primeiros 30 dias são gratuitos sem necessidade de cartão.',
    'faq.q2': 'Meus dados estão seguros?',
    'faq.a2': 'Sim, seguimos todas as normas LGPD e usamos criptografia de ponta.',
    'faq.q3': 'Posso cancelar quando quiser?',
    'faq.a3': 'Sim, cancele a qualquer momento sem taxas ou burocracia.',
    'faq.q4': 'Funciona no celular?',
    'faq.a4': 'Sim, acesse de qualquer dispositivo - computador, tablet ou celular.',
    'faq.q5': 'Tem suporte técnico?',
    'faq.a5': 'Sim, suporte via WhatsApp e email com resposta em até 24h.',
    'faq.q6': 'Posso importar meus pacientes?',
    'faq.a6': 'Sim, oferecemos migração gratuita de dados para novos assinantes.',
    
    // CTA
    'cta.title': 'Comece Sua Transformação Agora',
    'cta.subtitle': 'Junte-se aos fisioterapeutas que estão elevando sua prática.',
    'cta.button': 'Testar Grátis por 30 Dias',
    
    // Footer
    'footer.product': 'Produto',
    'footer.resources': 'Recursos',
    'footer.legal': 'Legal',
    'footer.contact': 'Contato',
    'footer.terms': 'Termos de Uso',
    'footer.privacy': 'Política de Privacidade',
    'footer.cancellation': 'Cancelamento',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.disclaimer': 'REHABROAD é uma ferramenta de apoio à decisão clínica. A responsabilidade técnica permanece do profissional.',
    
    // Form
    'form.name': 'Seu nome',
    'form.email': 'Seu e-mail',
    'form.submit': 'Quero Testar Grátis',
    'form.submitting': 'Cadastrando...',
    'form.success': 'Cadastro realizado!',
    'form.successDesc': 'Em breve você receberá acesso ao beta.',
    
    // Misc
    'language': 'Idioma',
    'loading': 'Carregando...',
  },
  en: {
    // Header
    'header.login': 'Login',
    'header.tryFree': 'Try Free for 30 Days',
    'header.features': 'Features',
    'header.pricing': 'Pricing',
    'header.blog': 'Blog',
    'header.studentMode': 'Student Mode',
    
    // Hero
    'hero.badge': 'Physical Therapy Software 2025',
    'hero.title': 'Electronic Health Records for Physical Therapists',
    'hero.subtitle': 'Stop competing on price. Start being referred for expertise.',
    'hero.description': 'Complete clinical documentation system that transforms your practice into a reference. Professional reports, structured progress notes, and clinical decision support.',
    'hero.cta': 'Try Free for 30 Days',
    'hero.noCreditCard': 'No credit card required',
    'hero.cancelAnytime': 'Cancel anytime',
    'hero.lgpd': 'HIPAA compliant',
    'hero.pdfExport': 'PDF export',
    
    // Urgency Banner
    'urgency.title': 'spots remaining for closed beta',
    'urgency.subtitle': 'Get early access with exclusive discount',
    
    // Credibility Bar
    'credibility.professionals': 'active physical therapists',
    'credibility.reports': 'reports generated',
    'credibility.coffito': 'APTA Compliant',
    'credibility.law': 'HIPAA Ready',
    
    // Problem Section
    'problem.title': 'While you waste hours on paperwork...',
    'problem.description': 'other professionals are building reputation, attracting patients through referrals, and charging what they\'re truly worth.',
    'problem.item1.title': 'Manual documentation',
    'problem.item1.desc': 'Hours lost on notes no one reads',
    'problem.item2.title': 'No clinical standards',
    'problem.item2.desc': 'Every session feels improvised',
    'problem.item3.title': 'Zero differentiation',
    'problem.item3.desc': 'Competing on price, not value',
    
    // Solution Section
    'solution.title': 'The difference between being remembered for price or excellence',
    'solution.description': 'Physical therapists who document with quality get referrals. Those who improvise get forgotten.',
    
    // How It Works
    'howItWorks.title': 'Complete System for Physical Therapy Clinics',
    'howItWorks.step1.title': 'Evaluate with Structure',
    'howItWorks.step1.desc': 'Standardized forms that impress doctors and insurance.',
    'howItWorks.step2.title': 'Track with Data',
    'howItWorks.step2.desc': 'Monitor progress with metrics that prove results.',
    'howItWorks.step3.title': 'Export with Quality',
    'howItWorks.step3.desc': 'Professional PDF reports that elevate your authority.',
    
    // Features
    'features.title': 'Everything You Need',
    'features.subtitle': 'Clinical tools developed by physical therapists, for physical therapists.',
    'features.evaluation.title': 'Structured Evaluation',
    'features.evaluation.desc': 'Complete intake, orthopedic tests, validated scales.',
    'features.evolution.title': 'Clinical Progress Notes',
    'features.evolution.desc': 'Standardized records with progress metrics.',
    'features.reports.title': 'Professional Reports',
    'features.reports.desc': 'PDFs ready for physicians and insurance.',
    'features.neuroflux.title': 'NeuroFlux',
    'features.neuroflux.desc': 'Evidence-based TENS parameters.',
    'features.exercises.title': 'Exercise Library',
    'features.exercises.desc': '60+ exercises with personalized prescriptions.',
    'features.agenda.title': 'Integrated Scheduling',
    'features.agenda.desc': 'Appointments with WhatsApp reminders.',
    
    // Testimonials
    'testimonials.title': 'Transformation Stories',
    'testimonials.subtitle': 'Real physical therapists sharing real results.',
    
    // Pricing
    'pricing.title': 'Plans',
    'pricing.subtitle': 'Choose the ideal plan for your clinical practice.',
    'pricing.monthly': 'Monthly',
    'pricing.semester': 'Semester',
    'pricing.annual': 'Annual',
    'pricing.perMonth': '/month',
    'pricing.save': 'Save',
    'pricing.mostPopular': 'Most Popular',
    'pricing.cta': 'Get Started',
    'pricing.feature1': 'Complete electronic health records',
    'pricing.feature2': 'PDF reports',
    'pricing.feature3': 'NeuroFlux - TENS Parameters',
    'pricing.feature4': 'Exercise library',
    'pricing.feature5': 'Priority support',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Do I need a credit card to try?',
    'faq.a1': 'No! The first 30 days are free with no credit card required.',
    'faq.q2': 'Is my data secure?',
    'faq.a2': 'Yes, we follow HIPAA standards and use top-tier encryption.',
    'faq.q3': 'Can I cancel anytime?',
    'faq.a3': 'Yes, cancel at any time without fees or hassle.',
    'faq.q4': 'Does it work on mobile?',
    'faq.a4': 'Yes, access from any device - computer, tablet, or phone.',
    'faq.q5': 'Is there tech support?',
    'faq.a5': 'Yes, support via WhatsApp and email with 24h response time.',
    'faq.q6': 'Can I import my patients?',
    'faq.a6': 'Yes, we offer free data migration for new subscribers.',
    
    // CTA
    'cta.title': 'Start Your Transformation Now',
    'cta.subtitle': 'Join the physical therapists who are elevating their practice.',
    'cta.button': 'Try Free for 30 Days',
    
    // Footer
    'footer.product': 'Product',
    'footer.resources': 'Resources',
    'footer.legal': 'Legal',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.cancellation': 'Cancellation',
    'footer.rights': 'All rights reserved.',
    'footer.disclaimer': 'REHABROAD is a clinical decision support tool. Technical responsibility remains with the professional.',
    
    // Form
    'form.name': 'Your name',
    'form.email': 'Your email',
    'form.submit': 'Try Free',
    'form.submitting': 'Signing up...',
    'form.success': 'Registration complete!',
    'form.successDesc': 'You\'ll receive beta access soon.',
    
    // Misc
    'language': 'Language',
    'loading': 'Loading...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rehabroad_language');
      if (saved === 'pt' || saved === 'en') return saved;
    }
    return 'pt';
  });

  useEffect(() => {
    localStorage.setItem('rehabroad_language', language);
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
