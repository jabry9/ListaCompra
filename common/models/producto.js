'use strict';

module.exports = function (Producto) {

    Producto.beforeRemote('updateAll', function (context, producto, next) {
        var userId = context.req.accessToken.userId;
        var Usuario = Producto.app.models.Usuario;



        Usuario.findById(userId, function (err, usuario) {
            
            context.args.where = Producto.addVerificadoFilter(context.args.where, usuario.PerteneceId);
            
            context.args.data = { "Comprar": false};
            console.log(context.args.where);
            next();
        }); 






        Producto.addVerificadoFilter = function (filter, idlista) {
            //console.log(filter);
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
            //console.log(filter);
            return filter;
        }
        
    });
};
