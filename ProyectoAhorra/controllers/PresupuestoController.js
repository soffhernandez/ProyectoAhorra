import DatabaseService from "../database/DatabaseService"
import { Categoria, Gasto } from "../models/Presupuesto"

class PresupuestoController {
  constructor() {
    this.listeners = []
  }

  // ============================================
  // LISTENERS
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
  // CATEGORÍAS - FETCH
  // ============================================
  async fetchCategorias() {
    try {
      console.log("[v0] Fetching categorías...")
      const categorias = await DatabaseService.getCategorias()
      console.log("[v0] Categorías obtenidas:", categorias?.length || 0)

      return (categorias || []).map((cat) => Categoria.fromDatabase(cat)).filter(Boolean)
    } catch (error) {
      console.error("[v0] Error al obtener categorías:", error)
      return []
    }
  }

  // ============================================
  // GASTOS - FETCH
  // ============================================
  async fetchGastos() {
    try {
      console.log("[v0] Fetching gastos...")
      const gastos = await DatabaseService.getGastos()
      console.log("[v0] Gastos obtenidos:", gastos?.length || 0)

      return (gastos || []).map((gasto) => Gasto.fromDatabase(gasto)).filter(Boolean)
    } catch (error) {
      console.error("[v0] Error al obtener gastos:", error)
      return []
    }
  }

  // ============================================
  // CATEGORÍAS - AGREGAR
  // ============================================
  async agregarCategoria(nombre, total, iconoNombre = "pricetag", iconoColor = "#4da6ff") {
    try {
      console.log("[v0] Agregando categoría:", nombre, total)

      const categoria = new Categoria(null, nombre, total, iconoNombre, iconoColor)
      const validation = categoria.validate()

      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      await DatabaseService.agregarCategoria(nombre, total, iconoNombre, iconoColor)
      this.notifyListeners()

      console.log("[v0] Categoría agregada exitosamente")
    } catch (error) {
      console.error("[v0] Error al agregar categoría:", error)
      throw error
    }
  }

  // ============================================
  // CATEGORÍAS - MODIFICAR
  // ============================================
  async modificarCategoria(id, nombre, total) {
    try {
      console.log("[v0] Modificando categoría:", id, nombre, total)

      const categoria = new Categoria(id, nombre, total)
      const validation = categoria.validate()

      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      await DatabaseService.modificarCategoria(id, nombre, total)
      this.notifyListeners()

      console.log("[v0] Categoría modificada exitosamente")
    } catch (error) {
      console.error("[v0] Error al modificar categoría:", error)
      throw error
    }
  }

  // ============================================
  // CATEGORÍAS - ELIMINAR
  // ============================================
  async eliminarCategoria(id) {
    try {
      console.log("[v0] Eliminando categoría:", id)

      await DatabaseService.eliminarCategoria(id)
      this.notifyListeners()

      console.log("[v0] Categoría eliminada exitosamente")
    } catch (error) {
      console.error("[v0] Error al eliminar categoría:", error)
      throw error
    }
  }

  // ============================================
  // GASTOS - AGREGAR
  // ============================================
  async agregarGasto(categoriaId, nombre, monto) {
    try {
      console.log("[v0] Agregando gasto:", { categoriaId, nombre, monto })

      const gasto = new Gasto(null, categoriaId, nombre, monto)
      const validation = gasto.validate()

      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      await DatabaseService.agregarGasto(categoriaId, nombre, monto)
      this.notifyListeners()

      console.log("[v0] Gasto agregado exitosamente")
    } catch (error) {
      console.error("[v0] Error al agregar gasto:", error)
      throw error
    }
  }

  // ============================================
  // GASTOS - MODIFICAR
  // ============================================
  async modificarGasto(id, categoriaId, nombre, monto) {
    try {
      console.log("[v0] Modificando gasto:", id, categoriaId, nombre, monto)

      const gasto = new Gasto(id, categoriaId, nombre, monto)
      const validation = gasto.validate()

      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      await DatabaseService.modificarGasto(id, categoriaId, nombre, monto)
      this.notifyListeners()

      console.log("[v0] Gasto modificado exitosamente")
    } catch (error) {
      console.error("[v0] Error al modificar gasto:", error)
      throw error
    }
  }

  // ============================================
  // GASTOS - ELIMINAR
  // ============================================
  async eliminarGasto(id) {
    try {
      console.log("[v0] Eliminando gasto:", id)

      await DatabaseService.eliminarGasto(id)
      this.notifyListeners()

      console.log("[v0] Gasto eliminado exitosamente")
    } catch (error) {
      console.error("[v0] Error al eliminar gasto:", error)
      throw error
    }
  }

  // ============================================
  // REINICIAR MES
  // ============================================
  async reiniciarMes() {
    try {
      console.log("[v0] Reiniciando mes...")

      await DatabaseService.eliminarTodosGastos()

      this.notifyListeners()
      console.log("[v0] Mes reiniciado exitosamente")
    } catch (error) {
      console.error("[v0] Error al reiniciar mes:", error)
      throw error
    }
  }
}

export default new PresupuestoController()
