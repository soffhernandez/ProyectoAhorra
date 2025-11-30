export class Transaccion {
    constructor(id, fecha, limite, cantidad) {
        this.id = id;
        this.fecha = fecha;
        this.limite = limite;
        this.cantidad = cantidad;
    }

    static validar(fecha, limite, cantidad) {
        if (!fecha || !limite || !cantidad) {
            throw new Error('Los campos fecha, límite y cantidad son obligatorios');
        }
        if (cantidad > limite) {
            throw new Error('La cantidad no puede ser mayor que el límite');
        }
    }
}
