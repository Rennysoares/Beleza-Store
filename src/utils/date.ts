/**
 * Formata uma data ISO para o padrão brasileiro (dd/mm/aaaa).
 *
 * @param dateString Data em formato ISO.
 * @returns Data formatada para exibição.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

/**
 * Formata uma data ISO para o padrão brasileiro com hora.
 *
 * @param dateString Data em formato ISO.
 * @returns Data e hora formatadas para exibição.
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}