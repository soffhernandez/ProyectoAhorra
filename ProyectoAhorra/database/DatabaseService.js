import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
        // Claves de LocalStorage (del segundo código)
        this.storageKey = 'usuarios';
        this.presupuestosKey = 'presupuestos';
        this.categoriasKey = 'categorias';
        this.gastosKey = 'gastos';
    }

    async initialize() {
        if (Platform.OS === 'web') {
            console.log('Usando LocalStorage para web');
        } else {
            console.log('Usando SQLite para móvil');
            // Usamos la opción 'useNewConnection' del segundo código para compatibilidad
            this.db = await SQLite.openDatabaseAsync('miapp.db', { useNewConnection: true });
            await this.crearTablas();
        }
    }

    async crearTablas() {
        if (Platform.OS === 'web') return;

        // Definición de tablas unificada (tomada del segundo código, que es más completo)
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





    // Métodos para obtener todos los registros de cualquier tabla
    async getAll(tableName) {
        if (Platform.OS === 'web') {
            const data = localStorage.getItem(tableName);
            return data ? JSON.parse(data) : [];
        } else {
            // Se usa getAllAsync para obtener todos los registros
            const result = await this.db.getAllAsync(`SELECT * FROM ${tableName} ORDER BY id DESC`);
            return result;
        }
    }

    // Métodos para agregar registros en cualquier tabla
    async add(tableName, data) {
        if (Platform.OS === 'web') {
            // Para web, se usa el nombre de la tabla como clave de LocalStorage
            const existingData = await this.getAll(tableName);
            
            // Asignación de ID y fecha (como en el primer código)
            data.id = Date.now();
            if (!data.fecha_creacion) {
                 data.fecha_creacion = new Date().toISOString();
            }

            // El primer código inserta al inicio (unshift), lo mantengo para consistencia.
            existingData.unshift(data); 
            localStorage.setItem(tableName, JSON.stringify(existingData));
            return data;
        } else {
            const columns = Object.keys(data).join(', ');
            const values = Object.values(data);
            const placeholders = values.map(() => '?').join(', ');

            const result = await this.db.runAsync(
                `INSERT INTO ${tableName} (${columns}) VALUES(${placeholders})`,
                values
            );
            
            // El resultado de runAsync contiene el id insertado.
            return { ...data, id: result.lastInsertRowId };
        }
    }

    // Método para actualizar cualquier registro de una tabla
    async update(tableName, id, updatedData) {
        if (Platform.OS === 'web') {
            const existingData = await this.getAll(tableName);
            const index = existingData.findIndex(item => item.id.toString() === id.toString());
            if (index === -1) return null;

            existingData[index] = { ...existingData[index], ...updatedData };
            localStorage.setItem(tableName, JSON.stringify(existingData));

            return existingData[index];
        } else {
            const columns = Object.keys(updatedData).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updatedData);
            values.push(id);

            await this.db.runAsync(
                `UPDATE ${tableName} SET ${columns} WHERE id = ?`,
                values
            );

            // Se devuelve el objeto actualizado, obtenido con getFirstAsync
            const result = await this.db.getFirstAsync(
               ` SELECT * FROM ${tableName} WHERE id = ?`,
                id
            );

            return result;
        }
    }

    // Método para eliminar cualquier registro de una tabla
    async remove(tableName, id) {
        if (Platform.OS === 'web') {
            const existingData = await this.getAll(tableName);
            // Aseguramos la comparación de ID como string para consistencia con web
            const newData = existingData.filter(item => item.id.toString() !== id.toString()); 
            localStorage.setItem(tableName, JSON.stringify(newData));
            return true;
        } else {
            await this.db.runAsync(
                `DELETE FROM ${tableName} WHERE id = ?`,
                id
            );
            return true;
        }
    }


    // get*All* se reemplaza por el getAll genérico si se quiere usar la misma lógica
    async getAllUsuarios() {
        return this.getAll(this.storageKey); // 'usuarios'
    }

    async addUsuario(nombre) {
        // Se usa el método genérico 'add' para mayor reusabilidad
        return this.add('usuarios', { nombre });
    }
    
    // El método update del segundo código (para usuarios) se puede simplificar usando el genérico
    async updateUsuario(id, nuevoNombre) {
        return this.update('usuarios', id, { nombre: nuevoNombre });
    }

    // El método remove del segundo código (para usuarios) se puede simplificar usando el genérico
    async removeUsuario(id) {
        return this.remove('usuarios', id);
    }
    
    // Nota: Los nombres de los métodos del segundo código (getAll, add, update, remove) colisionan con los genéricos. 
    // He renombrado los métodos específicos para evitar el conflicto.



    async getCategorias() {
        return this.getAll(this.categoriasKey); // 'categorias'
    }

    async agregarCategoria(nombre, total, iconoNombre = "pricetag", iconoColor = "#4da6ff") {
        const data = {
            nombre,
            total: Number.parseFloat(total),
            icono_nombre: iconoNombre,
            icono_color: iconoColor,
        };
        // Se usa el método genérico 'add'
        const result = await this.add(this.categoriasKey, data);
        
        // Ajuste de claves para LocalStorage
        if (Platform.OS === 'web') {
            return {
                ...result,
                iconoNombre,
                iconoColor,
                id: result.id.toString(), // Web utiliza strings para IDs
            };
        }
        return { ...result, id: result.id.toString() }; // Asegurar que ID sea string
    }

    async modificarCategoria(id, nombre, total) {
        const updatedData = {
            nombre,
            total: Number.parseFloat(total),
        };
        // Se usa el método genérico 'update'
        return this.update(this.categoriasKey, id, updatedData);
    }

    async eliminarCategoria(id) {
        // La eliminación en web debe manejar la eliminación de gastos asociados (lógica del segundo código)
        if (Platform.OS === "web") {
            // Eliminar categoría
            await this.remove(this.categoriasKey, id);

            // Eliminar gastos asociados
            const gastos = await this.getGastos();
            const gastosFiltrados = gastos.filter(
                (g) =>
                    g.categoriaId.toString() !== id.toString() &&
                    (!g.categoria_id || g.categoria_id.toString() !== id.toString()),
            );
            localStorage.setItem(this.gastosKey, JSON.stringify(gastosFiltrados));
            return true;
        } else {
            // SQLite maneja la eliminación en cascada (FOREIGN KEY... ON DELETE CASCADE)
            return this.remove(this.categoriasKey, id);
        }
    }



    async getGastos() {
        // En SQLite, usamos la consulta específica para ordenar por fecha
        if (Platform.OS === "web") {
             return this.getAll(this.gastosKey);
        } else {
             return await this.db.getAllAsync("SELECT * FROM gastos ORDER BY fecha DESC")
        }
    }

    async agregarGasto(categoriaId, nombre, monto) {
        const data = {
            categoria_id: categoriaId,
            nombre,
            monto: Number.parseFloat(monto),
        };
        
        // Se usa el método genérico 'add'
        const result = await this.add(this.gastosKey, data);
        
        // Ajuste de claves/formato para LocalStorage
        if (Platform.OS === 'web') {
             return {
                ...result,
                categoriaId: categoriaId.toString(),
                categoria_id: categoriaId.toString(),
                id: result.id.toString(), // Web utiliza strings para IDs
                fecha: new Date().toISOString(),
             };
        }

        return { 
            ...result, 
            categoriaId: categoriaId.toString(), // Nombre alternativo para consistencia web/mobile
            id: result.id.toString() 
        }; 
    }

    async modificarGasto(id, categoriaId, nombre, monto) {
        const updatedData = {
            categoria_id: categoriaId,
            nombre,
            monto: Number.parseFloat(monto),
        };
        // Se usa el método genérico 'update'
        const result = await this.update(this.gastosKey, id, updatedData);
        
        // Ajuste de claves/formato para LocalStorage
        if (Platform.OS === 'web') {
            return {
                ...result,
                categoriaId: categoriaId.toString(),
                categoria_id: categoriaId.toString(),
                id: result.id.toString(),
            }
        }
        return { 
            ...result, 
            categoriaId: categoriaId.toString(),
            id: result.id.toString()
        };
    }

    async eliminarGasto(id) {
        return this.remove(this.gastosKey, id);
    }

    async eliminarTodosGastos() {
        if (Platform.OS === "web") {
            localStorage.setItem(this.gastosKey, "[]");
            return true;
        } else {
            await this.db.runAsync("DELETE FROM gastos");
            return true;
        }
    }



    // Nota: El segundo código llama a 'presupuestos' como legacy.
    
    async agregarPresupuesto(nombre, total = 1000) {
        return this.add(this.presupuestosKey, { nombre, gastado: 0, total });
    }

    async getPresupuestos() {
        return this.getAll(this.presupuestosKey); // 'presupuestos'
    }

    async modificarPresupuesto(id, nombre, total) {
        return this.update(this.presupuestosKey, id, { nombre, total });
    }

    async eliminarPresupuesto(id) {
        return this.remove(this.presupuestosKey, id);
    }
}

export default new DatabaseService();
