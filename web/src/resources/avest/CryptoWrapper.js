(function (exports) {
    function CryptoWrapper(handler) {
        var wrapper = {
            isLogin: false
        };
        var errorHandler = handler;

        function isFunction(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        }

        wrapper.init = function (callback) {
            if (errorHandler === undefined || !isFunction(errorHandler))
                errorHandler = function (e) {
                    console.error(e);
                };

            wrapper.err = function (e) {
                errorHandler(e);
            };
            try {
                avcmx().connectionAsync(avcmx.constants.AVCMF_NO_AUTH, function (e, cnn) {
                    if (e) {
                        wrapper.err(e.message);
                        return;
                    }
                    wrapper.conn = cnn;
                    callback();
                });
            } catch (e) {
                wrapper.err(e.message);
            }
        };

        wrapper.login = function (cert, callback) {
            if (wrapper.isLogin) {
                callback();
                return;
            }
            try {
                var blob = avcmx().blob().zttext(cert.pubKeyId().hex());
                var loginParams = avcmx().params().add(avcmx.constants.AVCM_PUB_KEY_ID, blob);
                avcmx().connectionAsync(loginParams, function (e, cnn) {
                    if (e) {
                        wrapper.err(e.message);
                        return;
                    }
                    wrapper.conn = cnn;
                    wrapper.conn.message(avcmx().blob().text('1')).signAsync(function (e, signed) {
                        if (e) {
                            wrapper.err(e.message);
                            delete wrapper.conn;
                        }
                        try {
                            wrapper.hashAlg = wrapper.conn.message(signed.val()).signs(0).hashAlg();
                            wrapper.isLogin = true;
                            callback();
                        } catch (e) {
                            wrapper.err(e.message);
                        }
                    });
                });
            } catch (e) {
                wrapper.err(e.message);
            }
        }

        function getHashAlg() {
            try {
                // it's not necessary, just for detection hash algorithm
                wrapper.conn.message(avcmx().blob().text('1')).signAsync(function (e, signed) {
                    if (e) {
                        wrapper.err(e.message);
                        return;
                    }
                    try {
                        return wrapper.conn.message(signed.val()).signs(0).hashAlg();
                    } catch (e) {
                        wrapper.err(e.message);
                    }
                });
            } catch (e) {
                wrapper.err(e.message);
            }
        };

        wrapper.decrypt = function (data) {
            var result;
            try {
                var encrypted = avcmx().blob().base64(data);
                var encryptedMessage = conn.message(encrypted);
                if (!encryptedMessage.isEncrypted()) {
                    wrapper.err('Сообщение не является зашифрованным сообщением');
                    return;
                }
                encryptedMessage.decryptAsync(function (e, msg) {
                    if (e) {
                        wrapper.err(e.message);
                        return;
                    }
                    try {
                        if (msg.isRaw()) {
                            result = msg.content().text();
                        } else {
                            result = msg.val().base64(0);
                        }
                    } catch (e) {
                        wrapper.err(e.message);
                    }
                });
            } catch (e) {
                wrapper.err(e.message);
            }
            return result;
        };
        wrapper.encrypt = function (data, cert) {
            if (!wrapper.isLogin)
                throw "Клиент не аутентифицирован";
            var result;
            try {
                var blob = avcmx().blob().text(data);
                var msg = wrapper.conn.message(blob);
                var paramBlob = avcmx().blob().zttext(cert.serial().hex());
                var recipients = conn.selectCerts(avcmx().params().add(avcmx.constants.AVCM_SERIAL_AS_STRING, paramBlob));

                var encryptedMessage = msg.encrypt(recipients);
                result = encryptedMessage.val().base64();
            } catch (e) {
                wrapper.err(e.message);
            }
            return result;
        };

        wrapper.hashData = function (data) {
            var result;
            try {
                var src = avcmx().blob().text(data);
                result = avcmx().hash(src, wrapper.hashAlg).hex();
            } catch (e) {
                wrapper.err(e.message);
            }
            return result;
        };


        function signData(handler, data, flags, recipients) {
            if (!wrapper.isLogin)
                throw "Клиент не аутентифицирован";
            try {
                var blob = avcmx().blob().text(data);
                var dataMessage = wrapper.conn.message(blob);
                dataMessage.signAsync(flags, function (e, signed) {
                    if (e) {
                        wrapper.err(e.message);
                        return;
                    }
                    try {
                        if (recipients) {
                            var encryptedMessage = signed.encrypt(recipients);
                            handler(encryptedMessage.val().base64());
                        } else
                            handler(signed.val().base64());
                    } catch (e) {
                        wrapper.err(e.message);
                    }
                });
            } catch (e) {
                wrapper.err(e.message);
            }
        }

        wrapper.sign = function (data, callback) {
            return signData(callback, data, 0);
        };

        wrapper.sign_detached = function (data, callback) {
            return signData(callback, data, avcmx.constants.AVCMF_DETACHED);
        };

        wrapper.signEncrypt = function (data, cert, callback) {
            var paramBlob = avcmx().blob().zttext(cert.serial().hex());
            var recipients = wrapper.conn.selectCerts(avcmx().params().add(avcmx.constants.AVCM_SERIAL_AS_STRING, paramBlob));
            return signData(callback, data, 0, recipients);

        };

        wrapper.sign_hash = function (hash, callback) {
            if (!wrapper.isLogin)
                throw "Клиент не аутентифицирован";
            try {
                var hashBlob = avcmx().blob().hex(hash);
                wrapper.conn.message(avcmx.constants.AVCMF_OPEN_FOR_SIGN | avcmx.constants.AVCMF_DETACHED).finalHashAsync(hashBlob, function (e, signed) {
                    if (e) {
                        wrapper.err(e.message);
                        return;
                    }
                    try {
                        callback(signed.val().base64());
                    } catch (e) {
                        wrapper.err(e.message);
                    }
                });
            } catch (e) {
                wrapper.err(e.message);
            }
        };

        function verifyData(handler, signedData, data) {
            var result = {};
            try {
                var blob = avcmx.blob().base64(signedData);
                var msg = wrapper.conn.message(blob);
                if (!msg.isSigned()) {
                    result.val = false;
                    wrapper.msg("Сообщение не является подписанным сообщением");
                    return;
                }

                if (data) {
                    msg.content(avcmx().blob().text(data));
                }
                if (!msg.verify()) {
                    result.err = "Подпись не верна";
                    return result;
                }

                var sign = msg.signs(0);
                result.cert = sign.cert();
                result.issuerCert = result.cert.issuer();

                var name = result.cert.subjectName();
                result.val = true;
                result.msg = "Подпись верна. Подписано: " + name;
                result.content = msg.content();
                result.date = sign.datetime();
            } catch (e) {
                result.val = false;
                result.err = e.message;
                wrapper.err(e.message);
            }
            handler(result);
        }

        wrapper.verify = function (signedData, handler) {
            return verifyData(handler, signedData);
        };

        wrapper.verify_detached = function (signedData, data, handler) {
            return verifyData(handler, signedData, data);
        };

        wrapper.verify_hash = function (signedData, hash, handler) {
            var result = {};
            try {
                var blob = avcmx.blob().base64(signedData);
                var msg = wrapper.conn.message(blob, avcmx.constants.AVCMF_OPEN_FOR_VERIFYSIGN | avcmx.constants.AVCMF_DETACHED);
                if (!msg.isSigned()) {
                    result.val = false;
                    wrapper.msg("Сообщение не является подписанным сообщением");
                    return;
                }

                msg.finalHash(avcmx().blob().hex(hash));
                if (!msg.verify()) {
                    result.err = "Подпись не верна";
                    return result;
                }

                var sign = msg.signs(0);
                result.cert = sign.cert();
                result.issuerCert = result.cert.issuer();

                var name = result.cert.subjectName();
                result.val = true;
                result.msg = "Подпись верна. Подписано: " + name;
                result.content = msg.content();
                result.date = sign.datetime();
            } catch (e) {
                wrapper.err(e.message);
            }
            handler(result);
        };

        wrapper.viewCert = function (cert) {
            try {
                cert.show(function (e) {
                    if (e) {
                        wrapper.err(e.message);
                        return;
                    }
                });
            } catch (e) {
                wrapper.err(e.message);
            }
        };

        wrapper.loadCerts = function () {
            try {
                return wrapper.conn.selectCerts(avcmx().params().add(avcmx.constants.AVCM_TYPE, avcmx().blob().int(avcmx.constants.AVCM_TYPE_MY)));
            } catch (e) {
                wrapper.err(e.message);
            }
        };

        return wrapper;


    }

    exports.CryptoWrapper = CryptoWrapper();

})
(typeof exports !== 'undefined' && exports || this);
