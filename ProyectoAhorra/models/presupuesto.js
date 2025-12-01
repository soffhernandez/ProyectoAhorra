class Categoria {
  constructor(id, nombre, total, iconoNombre = "pricetag", iconoColor = "#4da6ff") {
    this.id = id
    this.nombre = nombre
    this.total = Number.parseFloat(total) || 0
    this.iconoNombre = iconoNombre
    this.iconoColor = iconoColor
  }

  static fromDatabase(dbRow) {
    if (!dbRow) return null

    return new Categoria(
      dbRow.id?.toString(),
      dbRow.nombre,
      dbRow.total,
      dbRow.iconoNombre || dbRow.icono_nombre || "pricetag",
      dbRow.iconoColor || dbRow.icono_color || "#4da6ff",
    )
  }

  validate() {
    const errors = []

    if (!this.nombre || this.nombre.trim() === "") {
      errors.push("El nombre de la categoría es requerido")
    }

    if (this.total < 0) {
      errors.push("El presupuesto no puede ser negativo")
    }

    if (isNaN(this.total)) {
      errors.push("El presupuesto debe ser un número válido")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      total: this.total,
      iconoNombre: this.iconoNombre,
      iconoColor: this.iconoColor,
    }
  }
}

class Gasto {
  constructor(id, categoriaId, nombre, monto, fecha = new Date()) {
    this.id = id
    this.categoriaId = categoriaId?.toString()
    this.nombre = nombre
    this.monto = Number.parseFloat(monto) || 0
    this.fecha = fecha instanceof Date ? fecha : new Date(fecha)
  }

  static fromDatabase(dbRow) {
    if (!dbRow) return null

    return new Gasto(
      dbRow.id?.toString(),
      (dbRow.categoriaId || dbRow.categoria_id)?.toString(),
      dbRow.nombre,
      dbRow.monto,
      dbRow.fecha || new Date(),
    )
  }

  validate() {
    const errors = []

    if (!this.nombre || this.nombre.trim() === "") {
      errors.push("El nombre del gasto es requerido")
    }

    if (!this.categoriaId) {
      errors.push("Debe seleccionar una categoría")
    }

    if (this.monto <= 0) {
      errors.push("El monto debe ser mayor a 0")
    }

    if (isNaN(this.monto)) {
      errors.push("El monto debe ser un número válido")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  toJSON() {
    return {
      id: this.id,
      categoriaId: this.categoriaId,
      nombre: this.nombre,
      monto: this.monto,
      fecha: this.fecha.toISOString(),
    }
  }
}

class CategoriaConGastos {
  constructor(categoria, gastos = []) {
    this.id = categoria.id
    this.nombre = categoria.nombre
    this.total = categoria.total
    this.iconoNombre = categoria.iconoNombre
    this.iconoColor = categoria.iconoColor
    this.gastos = gastos
  }

  get gastado() {
    return this.gastos.reduce((sum, gasto) => sum + (gasto.monto || 0), 0)
  }

  get restante() {
    return this.total - this.gastado
  }

  get progreso() {
    return this.total > 0 ? (this.gastado / this.total) * 100 : 0
  }

  get estaEnAlerta() {
    return this.progreso > 90
  }

  get estadoProgreso() {
    if (this.progreso > 95) return { color: "#ff4d4d", estado: "crítico" }
    if (this.progreso > 75) return { color: "#faad14", estado: "advertencia" }
    return { color: "#00cc66", estado: "normal" }
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      total: this.total,
      gastado: this.gastado,
      restante: this.restante,
      progreso: this.progreso,
      iconoNombre: this.iconoNombre,
      iconoColor: this.iconoColor,
      gastos: this.gastos.map((g) => g.toJSON()),
      estaEnAlerta: this.estaEnAlerta,
      estadoProgreso: this.estadoProgreso,
    }
  }
}

export { Categoria, Gasto, CategoriaConGastos }
