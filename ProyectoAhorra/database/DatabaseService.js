import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

class DatabaseService {
    constructor() {
        this.db = null;
    }

    async initialize() {
        if (Platform.OS === 'web') {
            console.log('Usando LocalStorage para web');
        } else {
            console.log('Usando SQLite para móvil');
            this.db = await SQLite.openDatabaseAsync('miapp.db');
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS presupuestos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fecha TEXT NOT NULL,
                    limite REAL NOT NULL,
                    cantidad REAL NOT NULL
                );
            `);
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS transacciones (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fecha TEXT NOT NULL,
                    limite REAL NOT NULL,
                    cantidad REAL NOT NULL,
                    categoria TEXT NOT NULL,
                    desc TEXT NOT NULL,
                    ingresos REAL DEFAULT 0,
                    gastos REAL DEFAULT 0
                );
            `);
        }
    }

    // Métodos para obtener todos los registros de cualquier tabla
    async getAll(tableName) {
        if (Platform.OS === 'web') {
            const data = localStorage.getItem(tableName);
            return data ? JSON.parse(data) : [];
        } else {
            const result = await this.db.getAllAsync(`SELECT * FROM ${tableName} ORDER BY id DESC`);
            return result;
        }
    }

    // Métodos para agregar registros en cualquier tabla
    async add(tableName, data) {
        if (Platform.OS === 'web') {
            const existingData = await this.getAll(tableName);
            data.id = Date.now();
            data.fecha_creacion = new Date().toISOString();
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
            data.id = result.lastInsertRowId;
            return data;
        }
    }

    // Método para actualizar cualquier registro de una tabla
    async update(tableName, id, updatedData) {
        if (Platform.OS === 'web') {
            const existingData = await this.getAll(tableName);
            const index = existingData.findIndex(item => item.id === id);
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

            const result = await this.db.getFirstAsync(
                `SELECT * FROM ${tableName} WHERE id = ?`,
                id
            );

            return result;
        }
    }

    // Método para eliminar cualquier registro de una tabla
    async remove(tableName, id) {
        if (Platform.OS === 'web') {
            const existingData = await this.getAll(tableName);
            const newData = existingData.filter(item => item.id !== id);
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
}

export default new DatabaseService();
