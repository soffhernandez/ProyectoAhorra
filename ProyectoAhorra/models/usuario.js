// models/Usuario.js

export class Usuario {
    constructor(id, nombre, fecha_creacion) {
        this.id = id;
        this.nombre = nombre;
        this.fecha_creacion = fecha_creacion;
        this.rec = rec
    }

      static validar(nombre) {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error('El nombre no puede estar vacío');
        }
        if (nombre.length > 50) {
            throw new Error('El nombre no puede tener más de 50 caracteres');
        }
        return true;
    }
}
