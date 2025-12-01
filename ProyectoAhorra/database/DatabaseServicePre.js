import { Platform } from "react-native"
import * as SQLite from "expo-sqlite"

class DatabaseService {
  constructor() {
    this.db = null
    this.storageKey = "usuarios"
    this.presupuestosKey = "presupuestos"
    this.categoriasKey = "categorias"
    this.gastosKey = "gastos"
    this.isWebPlatform = Platform.OS === "web"
  }

  isWeb() {
    return this.isWebPlatform
  }

  async initialize() {
    if (this.isWeb()) {
      console.log("Usando LocalStorage para web")
    } else {
      console.log("Usando SQLite para móvil")
      this.db = await SQLite.openDatabaseAsync("miapp.db")
      await this.crearTablas()
    }
  }

  async crearTablas() {
    if (this.isWeb()) return

    await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS presupuestos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                gastado REAL DEFAULT 0,
                total REAL DEFAULT 1000,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS categorias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                total REAL DEFAULT 0,
                icono_nombre TEXT DEFAULT 'pricetag',
                icono_color TEXT DEFAULT '#4da6ff',
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS gastos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                categoria_id INTEGER NOT NULL,
                nombre TEXT NOT NULL,
                monto REAL NOT NULL,
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
            );
        `)
  }

  // ============ USUARIOS ============
  async getAll() {
    if (this.isWeb()) {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } else {
      return await this.db.getAllAsync("SELECT * FROM usuarios ORDER BY id DESC")
    }
  }

  async add(nombre) {
    if (this.isWeb()) {
      const usuarios = await this.getAll()
      const nuevoUsuario = {
        id: Date.now(),
        nombre,
        fecha_creacion: new Date().toISOString(),
      }
      usuarios.unshift(nuevoUsuario)
      localStorage.setItem(this.storageKey, JSON.stringify(usuarios))
      return nuevoUsuario
    } else {
      const result = await this.db.runAsync("INSERT INTO usuarios (nombre) VALUES(?)", nombre)
      return {
        id: result.lastInsertRowId,
        nombre,
        fecha_creacion: new Date().toISOString(),
      }
    }
  }

  async update(id, nuevoNombre) {
    if (this.isWeb()) {
      const usuarios = await this.getAll()
      const index = usuarios.findIndex((u) => u.id === id)
      if (index === -1) return null
      usuarios[index].nombre = nuevoNombre
      localStorage.setItem(this.storageKey, JSON.stringify(usuarios))
      return usuarios[index]
    } else {
      await this.db.runAsync("UPDATE usuarios SET nombre = ? WHERE id = ?", [nuevoNombre, id])
      const result = await this.db.getFirstAsync("SELECT * FROM usuarios WHERE id = ?", id)
      return result
    }
  }

  async remove(id) {
    if (this.isWeb()) {
      const usuarios = await this.getAll()
      const nuevos = usuarios.filter((u) => u.id !== id)
      localStorage.setItem(this.storageKey, JSON.stringify(nuevos))
      return true
    } else {
      await this.db.runAsync("DELETE FROM usuarios WHERE id = ?", id)
      return true
    }
  }

  // ============ CATEGORÍAS ============
  async getCategorias() {
    if (this.isWeb()) {
      const data = localStorage.getItem(this.categoriasKey)
      return data ? JSON.parse(data) : []
    } else {
      return await this.db.getAllAsync("SELECT * FROM categorias ORDER BY id DESC")
    }
  }

  async agregarCategoria(nombre, total, iconoNombre = "pricetag", iconoColor = "#4da6ff") {
    if (this.isWeb()) {
      const categorias = await this.getCategorias()
      const nueva = {
        id: Date.now().toString(),
        nombre,
        total: Number.parseFloat(total),
        iconoNombre,
        iconoColor,
        icono_nombre: iconoNombre,
        icono_color: iconoColor,
        fecha_creacion: new Date().toISOString(),
      }
      categorias.push(nueva)
      localStorage.setItem(this.categoriasKey, JSON.stringify(categorias))
      return nueva
    } else {
      const result = await this.db.runAsync(
        "INSERT INTO categorias (nombre, total, icono_nombre, icono_color) VALUES (?, ?, ?, ?)",
        [nombre, Number.parseFloat(total), iconoNombre, iconoColor],
      )
      return {
        id: result.lastInsertRowId.toString(),
        nombre,
        total: Number.parseFloat(total),
        iconoNombre,
        iconoColor,
        icono_nombre: iconoNombre,
        icono_color: iconoColor,
        fecha_creacion: new Date().toISOString(),
      }
    }
  }

  async modificarCategoria(id, nombre, total) {
    if (this.isWeb()) {
      const categorias = await this.getCategorias()
      const index = categorias.findIndex((c) => c.id.toString() === id.toString())
      if (index !== -1) {
        categorias[index].nombre = nombre
        categorias[index].total = Number.parseFloat(total)
        localStorage.setItem(this.categoriasKey, JSON.stringify(categorias))
        return categorias[index]
      }
      return null
    } else {
      await this.db.runAsync("UPDATE categorias SET nombre = ?, total = ? WHERE id = ?", [
        nombre,
        Number.parseFloat(total),
        id,
      ])
      const result = await this.db.getFirstAsync("SELECT * FROM categorias WHERE id = ?", [id])
      return result
    }
  }

  async eliminarCategoria(id) {
    if (this.isWeb()) {
      const categorias = await this.getCategorias()
      const filtrado = categorias.filter((c) => c.id.toString() !== id.toString())
      localStorage.setItem(this.categoriasKey, JSON.stringify(filtrado))

      // Eliminar gastos asociados
      const gastos = await this.getGastos()
      const gastosFiltrados = gastos.filter(
        (g) =>
          g.categoriaId.toString() !== id.toString() &&
          (!g.categoria_id || g.categoria_id.toString() !== id.toString()),
      )
      localStorage.setItem(this.gastosKey, JSON.stringify(gastosFiltrados))
      return true
    } else {
      await this.db.runAsync("DELETE FROM categorias WHERE id = ?", [id])
      return true
    }
  }

  // ============ GASTOS ============
  async getGastos() {
    if (this.isWeb()) {
      const data = localStorage.getItem(this.gastosKey)
      return data ? JSON.parse(data) : []
    } else {
      return await this.db.getAllAsync("SELECT * FROM gastos ORDER BY fecha DESC")
    }
  }

  async agregarGasto(categoriaId, nombre, monto) {
    if (this.isWeb()) {
      const gastos = await this.getGastos()
      const nuevo = {
        id: Date.now().toString(),
        categoriaId: categoriaId.toString(),
        categoria_id: categoriaId.toString(),
        nombre,
        monto: Number.parseFloat(monto),
        fecha: new Date().toISOString(),
      }
      gastos.push(nuevo)
      localStorage.setItem(this.gastosKey, JSON.stringify(gastos))
      return nuevo
    } else {
      const result = await this.db.runAsync("INSERT INTO gastos (categoria_id, nombre, monto) VALUES (?, ?, ?)", [
        categoriaId,
        nombre,
        Number.parseFloat(monto),
      ])
      return {
        id: result.lastInsertRowId.toString(),
        categoriaId: categoriaId.toString(),
        categoria_id: categoriaId.toString(),
        nombre,
        monto: Number.parseFloat(monto),
        fecha: new Date().toISOString(),
      }
    }
  }

  async modificarGasto(id, categoriaId, nombre, monto) {
    if (this.isWeb()) {
      const gastos = await this.getGastos()
      const index = gastos.findIndex((g) => g.id.toString() === id.toString())
      if (index !== -1) {
        gastos[index].categoriaId = categoriaId.toString()
        gastos[index].categoria_id = categoriaId.toString()
        gastos[index].nombre = nombre
        gastos[index].monto = Number.parseFloat(monto)
        localStorage.setItem(this.gastosKey, JSON.stringify(gastos))
        return gastos[index]
      }
      return null
    } else {
      await this.db.runAsync("UPDATE gastos SET categoria_id = ?, nombre = ?, monto = ? WHERE id = ?", [
        categoriaId,
        nombre,
        Number.parseFloat(monto),
        id,
      ])
      const result = await this.db.getFirstAsync("SELECT * FROM gastos WHERE id = ?", [id])
      return result
    }
  }

  async eliminarGasto(id) {
    if (this.isWeb()) {
      const gastos = await this.getGastos()
      const filtrado = gastos.filter((g) => g.id.toString() !== id.toString())
      localStorage.setItem(this.gastosKey, JSON.stringify(filtrado))
      return true
    } else {
      await this.db.runAsync("DELETE FROM gastos WHERE id = ?", [id])
      return true
    }
  }

  async eliminarTodosGastos() {
    if (this.isWeb()) {
      localStorage.setItem(this.gastosKey, "[]")
      return true
    } else {
      await this.db.runAsync("DELETE FROM gastos")
      return true
    }
  }

  // ============ PRESUPUESTOS (legacy) ============
  async agregarPresupuesto(nombre, total = 1000) {
    if (this.isWeb()) {
      const presupuestos = JSON.parse(localStorage.getItem(this.presupuestosKey) || "[]")
      const id = Date.now()
      const nuevo = { id, nombre, gastado: 0, total, fecha_creacion: new Date().toISOString() }
      presupuestos.push(nuevo)
      localStorage.setItem(this.presupuestosKey, JSON.stringify(presupuestos))
      return nuevo
    } else {
      const result = await this.db.runAsync("INSERT INTO presupuestos (nombre, total) VALUES (?, ?)", [nombre, total])
      return { id: result.lastInsertRowId, nombre, gastado: 0, total, fecha_creacion: new Date().toISOString() }
    }
  }

  async getPresupuestos() {
    if (this.isWeb()) {
      return JSON.parse(localStorage.getItem(this.presupuestosKey) || "[]")
    } else {
      return await this.db.getAllAsync("SELECT * FROM presupuestos")
    }
  }

  async modificarPresupuesto(id, nombre, total) {
    if (this.isWeb()) {
      const presupuestos = JSON.parse(localStorage.getItem(this.presupuestosKey) || "[]")
      const index = presupuestos.findIndex((p) => p.id === id)
      if (index !== -1) {
        presupuestos[index].nombre = nombre
        presupuestos[index].total = total
        localStorage.setItem(this.presupuestosKey, JSON.stringify(presupuestos))
        return presupuestos[index]
      }
      return null
    } else {
      await this.db.runAsync("UPDATE presupuestos SET nombre = ?, total = ? WHERE id = ?", [nombre, total, id])
      return { id, nombre, total }
    }
  }

  async eliminarPresupuesto(id) {
    if (this.isWeb()) {
      const presupuestos = JSON.parse(localStorage.getItem(this.presupuestosKey) || "[]")
      const filtrado = presupuestos.filter((p) => p.id !== id)
      localStorage.setItem(this.presupuestosKey, JSON.stringify(filtrado))
      return true
    } else {
      await this.db.runAsync("DELETE FROM presupuestos WHERE id = ?", [id])
      return true
    }
  }
}

export default new DatabaseService()
