'use strict';

module.exports = function (Producto) {

    Producto.beforeRemote('updateAll', function (context, producto, next) {
        var userId = context.req.accessToken.userId;
        var Usuario = Producto.app.models.Usuario;

        Usuario.findById(userId, function (err, usuario) {
            // Vamos a añadir o modificar el filtro llamando a una funcion
            context.args.where = Producto.addListaFilter(context.args.where, usuario.PerteneceId);
            // Vamos a poner que ya estan comprados los productos
            //context.args.data = { "Comprar": false};
            next();
        });

        // En esta funcion se añade o se crea el filtro correspondiente para que los cambios afecten unicamente la lista a la que pertenece
        Producto.addListaFilter = function (filter, idlista) {
            if (filter) {
                var filterJSON = filter;
                filterJSON = {
                    "and": [{
                            "listaFamiliarId": idlista
                        }, filterJSON]
                };
                filter = filterJSON;
            } else {
                filter = {
                    "listaFamiliarId": idlista
                };
            }
            return filter;
        }

    });
};
