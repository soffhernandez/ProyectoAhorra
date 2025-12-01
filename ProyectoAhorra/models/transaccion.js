export class Transaccion {
    constructor(id, fecha, limite, cantidad, categoria, desc, ingresos, gastos) {
        this.id = id;
        this.fecha = fecha;
        this.limite = limite;
        this.cantidad = cantidad;
        this.categoria = categoria;
        this.desc = desc;
        this.ingresos = ingresos;
        this.gastos = gastos;
    }

    static validar(fecha, limite, cantidad, categoria, desc, ingresos, gastos) {
        if (!fecha || !limite || !cantidad) {
            throw new Error('Los campos fecha, límite y cantidad son obligatorios');
        }
        if (cantidad > limite) {
            throw new Error('La cantidad no puede ser mayor que el límite');
        }
        if (!categoria || !desc) {
            throw new Error('La categoría y la descripción son obligatorias');
        }
        // Validación para ingresos y gastos, si son números
        if (ingresos && isNaN(ingresos)) {
            throw new Error('Los ingresos deben ser un número');
        }
        if (gastos && isNaN(gastos)) {
            throw new Error('Los gastos deben ser un número');
        }
    }
}
