export const ROLE_LABELS = {
  SYSTEM_ADMIN: "Sistem yöneticisi",
  RECTOR: "Rektör",
  ORGANIZER: "Organizatör",
  STUDENT: "Öğrenci",
};

export function roleLabel(role) {
  return ROLE_LABELS[role] || role || "—";
}
