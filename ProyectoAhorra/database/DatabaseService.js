import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

class DatabaseService {
  constructor() {
    this.db = null;
    this.storageKey = "usuarios";
    this.presupuestosKey = "presupuestos";
    this.categoriasKey = "categorias";
    this.gastosKey = "gastos";
  }

  async initialize() {
    if (Platform.OS === "web") {
      console.log("Usando LocalStorage para web");
    } else {
      console.log("Usando SQLite para móvil");
      this.db = await SQLite.openDatabaseAsync("miapp.db");
      await this.crearTablas();
    }
  }

  async crearTablas() {
    if (Platform.OS === "web") return;

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
    `);
  }

  // ============ USUARIOS ============
  async getUsuarios() {
    if (Platform.OS === "web") {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } else {
      return await this.db.getAllAsync("SELECT * FROM usuarios ORDER BY id DESC");
    }
  }

  async addUsuario(nombre) {
    if (Platform.OS === "web") {
      const usuarios = await this.getUsuarios();
      const nuevo = { id: Date.now(), nombre, fecha_creacion: new Date().toISOString() };
      usuarios.unshift(nuevo);
      localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
      return nuevo;
    } else {
      const result = await this.db.runAsync("INSERT INTO usuarios (nombre) VALUES(?)", [nombre]);
      return { id: result.lastInsertRowId, nombre, fecha_creacion: new Date().toISOString() };
    }
  }

  async updateUsuario(id, nombre) {
    if (Platform.OS === "web") {
      const usuarios = await this.getUsuarios();
      const index = usuarios.findIndex(u => u.id === id);
      if (index === -1) return null;
      usuarios[index].nombre = nombre;
      localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
      return usuarios[index];
    } else {
      await this.db.runAsync("UPDATE usuarios SET nombre = ? WHERE id = ?", [nombre, id]);
      const result = await this.db.getFirstAsync("SELECT * FROM usuarios WHERE id = ?", [id]);
      return result;
    }
  }

  async removeUsuario(id) {
    if (Platform.OS === "web") {
      const usuarios = await this.getUsuarios();
      const filtrado = usuarios.filter(u => u.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filtrado));
      return true;
    } else {
      await this.db.runAsync("DELETE FROM usuarios WHERE id = ?", [id]);
      return true;
    }
  }

  // ============ CATEGORÍAS ============
  async getCategorias() {
    if (Platform.OS === "web") {
      const data = localStorage.getItem(this.categoriasKey);
      return data ? JSON.parse(data) : [];
    } else {
      return await this.db.getAllAsync("SELECT * FROM categorias ORDER BY id DESC");
    }
  }

  async addCategoria(nombre, total = 0, iconoNombre = "pricetag", iconoColor = "#4da6ff") {
    if (Platform.OS === "web") {
      const categorias = await this.getCategorias();
      const nueva = {
        id: Date.now().toString(),
        nombre,
        total,
        iconoNombre,
        iconoColor,
        fecha_creacion: new Date().toISOString(),
      };
      categorias.push(nueva);
      localStorage.setItem(this.categoriasKey, JSON.stringify(categorias));
      return nueva;
    } else {
      const result = await this.db.runAsync(
        "INSERT INTO categorias (nombre, total, icono_nombre, icono_color) VALUES (?, ?, ?, ?)",
        [nombre, total, iconoNombre, iconoColor]
      );
      return { id: result.lastInsertRowId.toString(), nombre, total, iconoNombre, iconoColor, fecha_creacion: new Date().toISOString() };
    }
  }

  async updateCategoria(id, nombre, total) {
    if (Platform.OS === "web") {
      const categorias = await this.getCategorias();
      const index = categorias.findIndex(c => c.id.toString() === id.toString());
      if (index === -1) return null;
      categorias[index].nombre = nombre;
      categorias[index].total = total;
      localStorage.setItem(this.categoriasKey, JSON.stringify(categorias));
      return categorias[index];
    } else {
      await this.db.runAsync("UPDATE categorias SET nombre = ?, total = ? WHERE id = ?", [nombre, total, id]);
      const result = await this.db.getFirstAsync("SELECT * FROM categorias WHERE id = ?", [id]);
      return result;
    }
  }

  async removeCategoria(id) {
    if (Platform.OS === "web") {
      const categorias = await this.getCategorias();
      const filtrado = categorias.filter(c => c.id.toString() !== id.toString());
      localStorage.setItem(this.categoriasKey, JSON.stringify(filtrado));
      return true;
    } else {
      await this.db.runAsync("DELETE FROM categorias WHERE id = ?", [id]);
      return true;
    }
  }

  // ============ GASTOS ============
  async getGastos() {
    if (Platform.OS === "web") {
      const data = localStorage.getItem(this.gastosKey);
      return data ? JSON.parse(data) : [];
    } else {
      return await this.db.getAllAsync("SELECT * FROM gastos ORDER BY fecha DESC");
    }
  }

  async addGasto(categoriaId, nombre, monto) {
    if (Platform.OS === "web") {
      const gastos = await this.getGastos();
      const nuevo = {
        id: Date.now().toString(),
        categoriaId: categoriaId.toString(),
        nombre,
        monto,
        fecha: new Date().toISOString(),
      };
      gastos.push(nuevo);
      localStorage.setItem(this.gastosKey, JSON.stringify(gastos));
      return nuevo;
    } else {
      const result = await this.db.runAsync(
        "INSERT INTO gastos (categoria_id, nombre, monto) VALUES (?, ?, ?)",
        [categoriaId, nombre, monto]
      );
      return { id: result.lastInsertRowId.toString(), categoriaId, nombre, monto, fecha: new Date().toISOString() };
    }
  }

  async updateGasto(id, categoriaId, nombre, monto) {
    if (Platform.OS === "web") {
      const gastos = await this.getGastos();
      const index = gastos.findIndex(g => g.id.toString() === id.toString());
      if (index === -1) return null;
      gastos[index] = { ...gastos[index], categoriaId, nombre, monto };
      localStorage.setItem(this.gastosKey, JSON.stringify(gastos));
      return gastos[index];
    } else {
      await this.db.runAsync("UPDATE gastos SET categoria_id = ?, nombre = ?, monto = ? WHERE id = ?", [categoriaId, nombre, monto, id]);
      const result = await this.db.getFirstAsync("SELECT * FROM gastos WHERE id = ?", [id]);
      return result;
    }
  }

  async removeGasto(id) {
    if (Platform.OS === "web") {
      const gastos = await this.getGastos();
      const filtrado = gastos.filter(g => g.id.toString() !== id.toString());
      localStorage.setItem(this.gastosKey, JSON.stringify(filtrado));
      return true;
    } else {
      await this.db.runAsync("DELETE FROM gastos WHERE id = ?", [id]);
      return true;
    }
  }

  // ============ PRESUPUESTOS ============
  async getPresupuestos() {
    if (Platform.OS === "web") {
      const data = localStorage.getItem(this.presupuestosKey);
      return data ? JSON.parse(data) : [];
    } else {
      return await this.db.getAllAsync("SELECT * FROM presupuestos");
    }
  }

  async addPresupuesto(nombre, total = 1000) {
    if (Platform.OS === "web") {
      const presupuestos = await this.getPresupuestos();
      const nuevo = { id: Date.now(), nombre, gastado: 0, total, fecha_creacion: new Date().toISOString() };
      presupuestos.push(nuevo);
      localStorage.setItem(this.presupuestosKey, JSON.stringify(presupuestos));
      return nuevo;
    } else {
      const result = await this.db.runAsync("INSERT INTO presupuestos (nombre, total) VALUES (?, ?)", [nombre, total]);
      return { id: result.lastInsertRowId, nombre, gastado: 0, total, fecha_creacion: new Date().toISOString() };
    }
  }

  async updatePresupuesto(id, nombre, total) {
    if (Platform.OS === "web") {
      const presupuestos = await this.getPresupuestos();
      const index = presupuestos.findIndex(p => p.id === id);
      if (index === -1) return null;
      presupuestos[index].nombre = nombre;
      presupuestos[index].total = total;
      localStorage.setItem(this.presupuestosKey, JSON.stringify(presupuestos));
      return presupuestos[index];
    } else {
      await this.db.runAsync("UPDATE presupuestos SET nombre = ?, total = ? WHERE id = ?", [nombre, total, id]);
      return { id, nombre, total };
    }
  }

  async removePresupuesto(id) {
    if (Platform.OS === "web") {
      const presupuestos = await this.getPresupuestos();
      const filtrado = presupuestos.filter(p => p.id !== id);
      localStorage.setItem(this.presupuestosKey, JSON.stringify(filtrado));
      return true;
    } else {
      await this.db.runAsync("DELETE FROM presupuestos WHERE id = ?", [id]);
      return true;
    }
  }
}

export default new DatabaseService();
