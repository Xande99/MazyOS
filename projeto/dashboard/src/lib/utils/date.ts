/** Converte um "YYYY-MM-DD" do Postgres num Date local, evitando o
 * desvio de fuso que `new Date(string)` causa em campos só-de-data. */
export function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
