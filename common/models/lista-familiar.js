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
};
