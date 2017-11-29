'use strict';

module.exports = function (Listafamiliar) {
    Listafamiliar.beforeRemote('create', function (context, listaFamiliar, next) {
        context.args.data.Owner = context.req.accessToken.userId;
        next();
    });
    Listafamiliar.afterRemote('create', function (context, listaFamiliar, next) {
        var app = Listafamiliar.app;
        var Usuario = app.models.Usuario;
        var IdUser = context.req.accessToken.userId;

        Usuario.findById(IdUser, function (err, usr) {
            if (err)
                return cb(err);
            usr.PerteneceId = listaFamiliar.id;
            usr.save();
            next();
        })
    });

    /**
     * Vamos a crear una peticion para pertenecer a una lista
     * @param {Function(Error, object)} callback
     */

    Listafamiliar.prototype.Solicitar = function (context, callback) {
        var reg = this;
        var app = Listafamiliar.app;
        var Usuario = app.models.Usuario;
        var IdUser = context.req.accessToken.userId;
        Usuario.findById(IdUser, function (err, usr) {
            if (err)
                return cb(err);

            usr.solicitud.findOne(function (err, peticionanterior) {
                if (err)
                    return cb(err);

                if (peticionanterior == null) {
                    reg.solicitud.add(usr,
                            function (err, registro) {
                                callback(null, registro);
                            });
                } else {
                    peticionanterior.listaFamiliarId = reg.id;
                    peticionanterior.save();
                    callback(null, {id: peticionanterior.id, listaFamiliarId: reg.id, usuarioId: IdUser});
                }
            })


        })
    };



};
