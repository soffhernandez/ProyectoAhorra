import { Categoria, Gasto, CategoriaConGastos } from "../models/presupuesto"

class PresupuestoController {
  constructor() {
    this.listeners = []
  }

  // ============================================
  // LISTENERS (Observer Pattern)
  // ============================================
  addListener(callback) {
    this.listeners.push(callback)
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((cb) => cb !== callback)
  }

  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback()
      } catch (error) {
        console.error("[v0] Error en listener:", error)
      }
    })
  }

  // ============================================
  // CATEGORÍAS
  // ============================================
  async fetchCategorias() {
    try {
      console.log("[v0] Controller: Fetching categorías...")
      const categorias = await Categoria.findAll()
      console.log("[v0] Controller: Categorías obtenidas:", categorias?.length || 0)
      return categorias
    } catch (error) {
      console.error("[v0] Controller: Error al obtener categorías:", error)
      return []
    }
  }

  async agregarCategoria(nombre, total, iconoNombre = "pricetag", iconoColor = "#4da6ff") {
    try {
      console.log("[v0] Controller: Agregando categoría:", nombre, total)
      const categoria = await Categoria.create(nombre, total, iconoNombre, iconoColor)
      this.notifyListeners()
      console.log("[v0] Controller: Categoría agregada exitosamente")
      return categoria
    } catch (error) {
      console.error("[v0] Controller: Error al agregar categoría:", error)
      throw error
    }
  }

  async modificarCategoria(id, nombre, total) {
    try {
      console.log("[v0] Controller: Modificando categoría:", id, nombre, total)
      const categoria = await Categoria.findById(id)

      if (!categoria) {
        throw new Error("Categoría no encontrada")
      }

      categoria.nombre = nombre
      categoria.total = total
      await categoria.save()

      this.notifyListeners()
      console.log("[v0] Controller: Categoría modificada exitosamente")
      return categoria
    } catch (error) {
      console.error("[v0] Controller: Error al modificar categoría:", error)
      throw error
    }
  }

  async eliminarCategoria(id) {
    try {
      console.log("[v0] Controller: Eliminando categoría:", id)
      const categoria = await Categoria.findById(id)

      if (!categoria) {
        throw new Error("Categoría no encontrada")
      }

      await categoria.delete()
      this.notifyListeners()
      console.log("[v0] Controller: Categoría eliminada exitosamente")
    } catch (error) {
      console.error("[v0] Controller: Error al eliminar categoría:", error)
      throw error
    }
  }

  // ============================================
  // GASTOS
  // ============================================
  async fetchGastos() {
    try {
      console.log("[v0] Controller: Fetching gastos...")
      const gastos = await Gasto.findAll()
      console.log("[v0] Controller: Gastos obtenidos:", gastos?.length || 0)
      return gastos
    } catch (error) {
      console.error("[v0] Controller: Error al obtener gastos:", error)
      return []
    }
  }

  async agregarGasto(categoriaId, nombre, monto) {
    try {
      console.log("[v0] Controller: Agregando gasto:", { categoriaId, nombre, monto })
      const gasto = await Gasto.create(categoriaId, nombre, monto)
      this.notifyListeners()
      console.log("[v0] Controller: Gasto agregado exitosamente")
      return gasto
    } catch (error) {
      console.error("[v0] Controller: Error al agregar gasto:", error)
      throw error
    }
  }

  async modificarGasto(id, categoriaId, nombre, monto) {
    try {
      console.log("[v0] Controller: Modificando gasto:", id, categoriaId, nombre, monto)
      const gasto = await Gasto.findById(id)

      if (!gasto) {
        throw new Error("Gasto no encontrado")
      }

      gasto.categoriaId = categoriaId
      gasto.nombre = nombre
      gasto.monto = monto
      await gasto.save()

      this.notifyListeners()
      console.log("[v0] Controller: Gasto modificado exitosamente")
      return gasto
    } catch (error) {
      console.error("[v0] Controller: Error al modificar gasto:", error)
      throw error
    }
  }

  async eliminarGasto(id) {
    try {
      console.log("[v0] Controller: Eliminando gasto:", id)
      const gasto = await Gasto.findById(id)

      if (!gasto) {
        throw new Error("Gasto no encontrado")
      }

      await gasto.delete()
      this.notifyListeners()
      console.log("[v0] Controller: Gasto eliminado exitosamente")
    } catch (error) {
      console.error("[v0] Controller: Error al eliminar gasto:", error)
      throw error
    }
  }

  // ============================================
  // CATEGORÍAS CON GASTOS (View Model)
  // ============================================
  async fetchCategoriasConGastos() {
    try {
      console.log("[v0] Controller: Fetching categorías con gastos...")
      const categoriasConGastos = await CategoriaConGastos.findAll()
      console.log("[v0] Controller: Categorías con gastos obtenidas:", categoriasConGastos?.length || 0)
      return categoriasConGastos
    } catch (error) {
      console.error("[v0] Controller: Error al obtener categorías con gastos:", error)
      return []
    }
  }

  // ============================================
  // OPERACIONES GENERALES
  // ============================================
  async reiniciarMes() {
    try {
      console.log("[v0] Controller: Reiniciando mes...")
      await Gasto.deleteAll()
      this.notifyListeners()
      console.log("[v0] Controller: Mes reiniciado exitosamente")
    } catch (error) {
      console.error("[v0] Controller: Error al reiniciar mes:", error)
      throw error
    }
  }

  async getResumenGeneral() {
    try {
      const categoriasConGastos = await this.fetchCategoriasConGastos()

      const presupuestoTotal = categoriasConGastos.reduce((sum, cat) => sum + cat.total, 0)
      const gastadoTotal = categoriasConGastos.reduce((sum, cat) => sum + cat.gastado, 0)
      const restanteTotal = presupuestoTotal - gastadoTotal
      const porcentajeUsado = presupuestoTotal > 0 ? Math.round((gastadoTotal / presupuestoTotal) * 100) : 0

      return {
        presupuestoTotal,
        gastadoTotal,
        restanteTotal,
        porcentajeUsado,
        categoriasConGastos,
      }
    } catch (error) {
      console.error("[v0] Controller: Error al obtener resumen general:", error)
      throw error
    }
  }
}

export default new PresupuestoController()
