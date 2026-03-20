/**
 * WhatsApp integration utilities
 */

/**
 * Formats a phone number for WhatsApp
 * Removes all non-numeric characters and ensures country code
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // If doesn't have country code (less than 12 digits for Brazil), add +55
  if (cleaned.length <= 11) {
    cleaned = '55' + cleaned;
  }
  
  return cleaned;
}

/**
 * Creates a WhatsApp link with a pre-filled message
 */
export function createWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Opens WhatsApp with the given phone and message
 */
export function openWhatsApp(phone: string, message: string): void {
  const link = createWhatsAppLink(phone, message);
  window.open(link, '_blank');
}

/**
 * Creates a prescription message for exercises
 */
export function createExercisePrescriptionMessage(
  patientName: string,
  professionalName: string,
  exercises: Array<{
    name: string;
    sets?: string | number;
    reps?: string;
    frequency?: string;
    instructions?: string[];
  }>,
  notes?: string
): string {
  let message = `🏋️ *PRESCRIÇÃO DE EXERCÍCIOS*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `👤 *Paciente:* ${patientName}\n`;
  message += `👨‍⚕️ *Profissional:* ${professionalName}\n`;
  message += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  exercises.forEach((exercise, index) => {
    message += `*${index + 1}. ${exercise.name}*\n`;
    if (exercise.sets && exercise.reps) {
      message += `   📊 ${exercise.sets}x de ${exercise.reps}\n`;
    }
    if (exercise.frequency) {
      message += `   🗓️ ${exercise.frequency}\n`;
    }
    if (exercise.instructions && exercise.instructions.length > 0) {
      message += `   📝 ${exercise.instructions[0]}\n`;
    }
    message += `\n`;
  });
  
  if (notes) {
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📌 *Observações:*\n${notes}\n\n`;
  }
  
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `✅ Siga as orientações e entre em contato se tiver dúvidas!\n`;
  message += `\n_Enviado via REHABROAD_`;
  
  return message;
}

/**
 * Creates a reminder message for the patient
 */
export function createReminderMessage(
  patientName: string,
  professionalName: string,
  appointmentDate?: string,
  appointmentTime?: string,
  customMessage?: string
): string {
  let message = `🔔 *LEMBRETE DE CONSULTA*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `Olá, ${patientName}! 👋\n\n`;
  
  if (customMessage) {
    message += `${customMessage}\n\n`;
  } else if (appointmentDate) {
    message += `Passando para lembrar da sua sessão:\n\n`;
    message += `📅 *Data:* ${appointmentDate}\n`;
    if (appointmentTime) {
      message += `🕐 *Horário:* ${appointmentTime}\n`;
    }
    message += `\n`;
  } else {
    message += `Percebi que faz um tempo desde nossa última sessão.\n`;
    message += `Como você está se sentindo? Gostaria de agendar um retorno?\n\n`;
  }
  
  message += `Qualquer dúvida, estou à disposição!\n\n`;
  message += `Att,\n${professionalName}\n`;
  message += `\n_Enviado via REHABROAD_`;
  
  return message;
}

/**
 * Creates a general contact message
 */
export function createContactMessage(
  patientName: string,
  professionalName: string,
  customMessage?: string
): string {
  let message = `Olá, ${patientName}! 👋\n\n`;
  
  if (customMessage) {
    message += customMessage;
  } else {
    message += `Aqui é ${professionalName}, seu fisioterapeuta.\n`;
    message += `Como você está? Precisa de algo?\n`;
  }
  
  message += `\n\n_Enviado via REHABROAD_`;
  
  return message;
}
