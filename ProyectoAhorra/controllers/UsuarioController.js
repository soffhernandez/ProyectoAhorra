import { Usuario } from '../models/usuario';
import { Presupuesto } from '../models/presupuesto';
import { Transaccion } from '../models/transaccion';
import DatabaseService from '../database/DatabaseService';

export class Controlador {
    constructor() {
        this.listeners = [];
    }

    async initialize() {
        await DatabaseService.initialize();
    }

    // CRUD Usuario
    async obtenerUsuarios() {
        try {
            const data = await DatabaseService.getAll('usuarios');
            return data.map(u => new Usuario(u.id, u.nombre, u.fecha_creacion));
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw new Error('No se pudieron cargar los usuarios');
        }
    }

    async crearUsuario(nombre) {
        try {
            Usuario.validar(nombre);

            const nuevoUsuario = await DatabaseService.add('usuarios', { nombre: nombre.trim() });

            this.notifyListeners();

            return new Usuario(
                nuevoUsuario.id,
                nuevoUsuario.nombre,
                nuevoUsuario.fecha_creacion,
                nuevoUsuario.rec
            );
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async actualizarUsuario(id, nuevoNombre) {
        try {
            Usuario.validar(nuevoNombre);

            const actualizado = await DatabaseService.update('usuarios', id, { nombre: nuevoNombre.trim() });

            this.notifyListeners();

            return new Usuario(
                actualizado.id,
                actualizado.nombre,
                actualizado.fecha_creacion,
                actualizado.rec
            );
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }

    async eliminarUsuario(id) {
        try {
            await DatabaseService.remove('usuarios', id);

            this.notifyListeners();

            return true;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }

    // CRUD Presupuesto
    async obtenerPresupuestos() {
        try {
            const data = await DatabaseService.getAll('presupuestos');
            return data.map(p => new Presupuesto(p.id, p.fecha, p.limite, p.cantidad));
        } catch (error) {
            console.error('Error al obtener presupuestos:', error);
            throw new Error('No se pudieron cargar los presupuestos');
        }
    }

    async crearPresupuesto(fecha, limite, cantidad) {
        try {
            Presupuesto.validar(fecha, limite, cantidad);

            const nuevoPresupuesto = await DatabaseService.add('presupuestos', { fecha, limite, cantidad });

            this.notifyListeners();

            return new Presupuesto(
                nuevoPresupuesto.id,
                nuevoPresupuesto.fecha,
                nuevoPresupuesto.limite,
                nuevoPresupuesto.cantidad
            );
        } catch (error) {
            console.error('Error al crear presupuesto:', error);
            throw error;
        }
    }

    async actualizarPresupuesto(id, fecha, limite, cantidad) {
        try {
            Presupuesto.validar(fecha, limite, cantidad);

            const actualizado = await DatabaseService.update('presupuestos', id, { fecha, limite, cantidad });

            this.notifyListeners();

            return new Presupuesto(
                actualizado.id,
                actualizado.fecha,
                actualizado.limite,
                actualizado.cantidad
            );
        } catch (error) {
            console.error('Error al actualizar presupuesto:', error);
            throw error;
        }
    }

    async eliminarPresupuesto(id) {
        try {
            await DatabaseService.remove('presupuestos', id);

            this.notifyListeners();

            return true;
        } catch (error) {
            console.error('Error al eliminar presupuesto:', error);
            throw error;
        }
    }

    // CRUD Transacción
    async obtenerTransacciones() {
        try {
            const data = await DatabaseService.getAll('transacciones');
            return data.map(t => new Transaccion(t.id, t.fecha, t.limite, t.cantidad, t.categoria, t.desc, t.ingresos, t.gastos));
        } catch (error) {
            console.error('Error al obtener transacciones:', error);
            throw new Error('No se pudieron cargar las transacciones');
        }
    }

    async crearTransaccion(fecha, limite, cantidad, categoria, desc, ingresos = 0, gastos = 0) {
        try {
            Transaccion.validar(fecha, limite, cantidad, categoria, desc, ingresos, gastos);

            const nuevaTransaccion = await DatabaseService.add('transacciones', {
                fecha,
                limite,
                cantidad,
                categoria,
                desc,
                ingresos,
                gastos
            });

            this.notifyListeners();

            return new Transaccion(
                nuevaTransaccion.id,
                nuevaTransaccion.fecha,
                nuevaTransaccion.limite,
                nuevaTransaccion.cantidad,
                nuevaTransaccion.categoria,
                nuevaTransaccion.desc,
                nuevaTransaccion.ingresos,
                nuevaTransaccion.gastos
            );
        } catch (error) {
            console.error('Error al crear transacción:', error);
            throw error;
        }
    }

    async actualizarTransaccion(id, fecha, limite, cantidad, categoria, desc, ingresos = 0, gastos = 0) {
        try {
            Transaccion.validar(fecha, limite, cantidad, categoria, desc, ingresos, gastos);

            const actualizado = await DatabaseService.update('transacciones', id, {
                fecha,
                limite,
                cantidad,
                categoria,
                desc,
                ingresos,
                gastos
            });

            this.notifyListeners();

            return new Transaccion(
                actualizado.id,
                actualizado.fecha,
                actualizado.limite,
                actualizado.cantidad,
                actualizado.categoria,
                actualizado.desc,
                actualizado.ingresos,
                actualizado.gastos
            );
        } catch (error) {
            console.error('Error al actualizar transacción:', error);
            throw error;
        }
    }

    async eliminarTransaccion(id) {
        try {
            await DatabaseService.remove('transacciones', id);

            this.notifyListeners();

            return true;
        } catch (error) {
            console.error('Error al eliminar transacción:', error);
            throw error;
        }
    }

    // Métodos para notificar a los listeners
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback());
    }
}
