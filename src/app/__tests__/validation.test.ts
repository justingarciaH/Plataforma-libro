import { validarResena } from "@/lib/validaciones";

describe("Validación de reseñas", () => {
  it("acepta reseña válida", () => {
    const result = validarResena({
      comentario: "Muy buen libro",
      valoracion: 5,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza reseña sin comentario", () => {
    const result = validarResena({ comentario: "", valoracion: 4 });
    expect(result.success).toBe(false);
  });

  it("rechaza reseña con valoracion fuera de rango", () => {
    const result = validarResena({ comentario: "X", valoracion: 10 });
    expect(result.success).toBe(false);
  });
});
