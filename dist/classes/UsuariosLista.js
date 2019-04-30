"use strict";
/*
    =================================================
    =================================================
// AQUI ESTA CENTRALIZADO TODA LA LOGICA DE LOS USUARIOS //
    =================================================
    =================================================
*/
Object.defineProperty(exports, "__esModule", { value: true });
class UsuariosLista {
    constructor() {
        this.lista = []; //Aqui vamos a agregar los usuarios conectados
    }
    //agregamos un usuario
    agregar(usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }
    //actualizamos el nombre del usuario que entro a la sala
    actualizarNombre(id, nombre) {
        this.lista.forEach(usuario => {
            if (usuario.id === id) {
                usuario.nombre = nombre;
            }
        });
    }
    //Regresa la lista de todos los usuarios que estan ahorita en el arreglo
    getLista() {
        return this.lista.filter(usuario => {
            return usuario.nombre !== "sin-nombre";
        });
    }
    //nos regresa un solo usuario
    getUsuario(id) {
        return this.lista.find(usuario => usuario.id === id);
    }
    //nos regresa todos los usuarios de la sala
    getUsuariosSala(sala) {
        return this.lista.filter(usuario => usuario.sala === sala);
    }
    //sacamos un usuario del arreglo
    borrarUsuario(id) {
        let usuarioTemp = this.getUsuario(id);
        this.lista = this.lista.filter(usuario => {
            return usuario.id !== id;
        });
        return usuarioTemp;
    }
}
exports.UsuariosLista = UsuariosLista;
