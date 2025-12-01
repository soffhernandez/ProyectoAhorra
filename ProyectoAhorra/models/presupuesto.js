import DatabaseService from "../database/DatabaseService"

// ============================================
// MODEL: CATEGORIA
// ============================================
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

  async save() {
    const validation = this.validate()
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "))
    }

    if (this.id) {
      await DatabaseService.modificarCategoria(this.id, this.nombre, this.total)
    } else {
      const result = await DatabaseService.agregarCategoria(this.nombre, this.total, this.iconoNombre, this.iconoColor)
      this.id = result?.id || result
    }

    return this
  }

  async delete() {
    if (!this.id) {
      throw new Error("No se puede eliminar una categoría sin ID")
    }
    await DatabaseService.eliminarCategoria(this.id)
  }

  async getGastos() {
    const todosGastos = await Gasto.findAll()
    return todosGastos.filter((g) => g.categoriaId === this.id)
  }

  async calcularEstadisticas() {
    const gastos = await this.getGastos()
    const gastado = gastos.reduce((sum, g) => sum + g.monto, 0)
    const restante = this.total - gastado
    const progreso = this.total > 0 ? (gastado / this.total) * 100 : 0

    return {
      gastado,
      restante,
      progreso,
      gastos,
    }
  }

  static async findAll() {
    const categorias = await DatabaseService.getCategorias()
    return (categorias || []).map((cat) => Categoria.fromDatabase(cat)).filter(Boolean)
  }

  static async findById(id) {
    const categorias = await Categoria.findAll()
    return categorias.find((cat) => cat.id === id.toString())
  }

  static async create(nombre, total, iconoNombre = "pricetag", iconoColor = "#4da6ff") {
    const categoria = new Categoria(null, nombre, total, iconoNombre, iconoColor)
    return await categoria.save()
  }
}

// ============================================
// MODEL: GASTO
// ============================================
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

  async save() {
    const validation = this.validate()
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "))
    }

    if (this.id) {
      await DatabaseService.modificarGasto(this.id, this.categoriaId, this.nombre, this.monto)
    } else {
      const result = await DatabaseService.agregarGasto(this.categoriaId, this.nombre, this.monto)
      this.id = result?.id || result
    }

    return this
  }

  async delete() {
    if (!this.id) {
      throw new Error("No se puede eliminar un gasto sin ID")
    }
    await DatabaseService.eliminarGasto(this.id)
  }

  async getCategoria() {
    return await Categoria.findById(this.categoriaId)
  }

  static async findAll() {
    const gastos = await DatabaseService.getGastos()
    return (gastos || []).map((gasto) => Gasto.fromDatabase(gasto)).filter(Boolean)
  }

  static async findById(id) {
    const gastos = await Gasto.findAll()
    return gastos.find((g) => g.id === id.toString())
  }

  static async findByCategoria(categoriaId) {
    const gastos = await Gasto.findAll()
    return gastos.filter((g) => g.categoriaId === categoriaId.toString())
  }

  static async create(categoriaId, nombre, monto) {
    const gasto = new Gasto(null, categoriaId, nombre, monto)
    return await gasto.save()
  }

  static async deleteAll() {
    await DatabaseService.eliminarTodosGastos()
  }
}

// ============================================
// MODEL: CATEGORIA CON GASTOS (View Model)
// ============================================
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

  get excedido() {
    return this.progreso > 100
  }

  get montoExcedido() {
    return this.excedido ? this.gastado - this.total : 0
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
      excedido: this.excedido,
      montoExcedido: this.montoExcedido,
      estadoProgreso: this.estadoProgreso,
    }
  }

  static async findAll() {
    const categorias = await Categoria.findAll()
    const gastos = await Gasto.findAll()

    return categorias.map((cat) => {
      const gastosCategoria = gastos.filter((g) => g.categoriaId === cat.id)
      return new CategoriaConGastos(cat, gastosCategoria)
    })
  }
}

export { Categoria, Gasto, CategoriaConGastos }
