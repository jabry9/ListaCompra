'use strict';

module.exports = function (Usuario) {
    /**
     * le enviamos un identificador de usuario y, si ese usuario tiene alguna solicitud en la lista de la que es miembro el actualmente autenticado, esta solicitud será aprobada
     * @param {object} context 
     * @param {Function(Error, array)} callback
     */

    Usuario.prototype.aceptarSolicitudes = function (context, callback) {
        var listaDeMiembros;
        var usrAcp = this;
        var listaselec = null;
        var usrLogId = context.req.accessToken.userId;
        var usrLogLsId = null;
        var usrLogLs = null;
        var app = Usuario.app;
        var Listafamiliar = app.models.ListaFamiliar;

        Usuario.findById(usrLogId, function (err, usrLog) {
            if (err)
                return cb(err);

            if (usrLog.PerteneceId != null) {
                usrLogLsId = usrLog.PerteneceId;

                Listafamiliar.findById(usrLogLsId, function (err, usrLogLsO) {
                    if (err)
                        return cb(err);
                    listaselec = usrLogLsO;
                    usrLogLsO.solicitud.findById(usrAcp.id,
                            function (err, usrAcpO) {
                                if (usrAcpO != null) {
                                    usrAcpO.PerteneceId = usrLogLsId;
                                    usrAcpO.save(function (err) {
                                        usrLogLsO.solicitud.remove(usrAcpO,
                                                function (err) {

                                                    Usuario.find({where: {PerteneceId: usrLogLsId}}, function (err, listamiembros) {
                                                        listaDeMiembros = listamiembros;
                                                        callback(null, listamiembros);
                                                    });


                                                })
                                    });


                                } else {
                                    Usuario.find({where: {PerteneceId: usrLogLsId}}, function (err, listamiembros) {
                                        listaDeMiembros = listamiembros;
                                        callback(null, listamiembros);
                                    });
                                }
                            });
                })

            } else {
                Usuario.find({where: {PerteneceId: usrLogLsId}}, function (err, listamiembros) {
                    listaDeMiembros = listamiembros;
                    callback(null, listamiembros);
                });
            }
        })

    };

};
