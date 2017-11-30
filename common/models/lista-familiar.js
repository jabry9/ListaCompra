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
        var listaFa = this;
        var app = Listafamiliar.app;
        var Usuario = app.models.Usuario;
        var IdUser = context.req.accessToken.userId;
        Usuario.findById(IdUser, function (err, usr) {
            if (err)
                callback(err);
            usr.solicitud.findOne(function (err, peticionanterior) {
                if (err)
                    callback(err);
                if (peticionanterior == null) {
                    listaFa.solicitud.add(usr,
                            function (err, registro) {
                                callback(null, registro);
                            });
                } else {
                    peticionanterior.listaFamiliarId = listaFa.id;
                    peticionanterior.save(function (err) {
                        if (err)
                            callback(err);

                        callback(null, {id: peticionanterior.id, listaFamiliarId: listaFa.id, usuarioId: IdUser});
                    });
                }
            })
        })
    };



};
