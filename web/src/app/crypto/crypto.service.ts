import {Observable, of as observableOf, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {GlobalToastyService} from "@app/services/global-toasty.service";


import {HttpClientSecure} from "@app/services/http.client";
import {CRYPTO, SERVER_URL} from "@app/config";
import {SignGuard} from "@app/crypto/sign-guard";
import {SignRequestDto} from "@app/dto/SignRequestDto";
import {IdDto} from "@app/dto/IdDto";

declare const avcmx: any;
let constants: any;

@Injectable()
export class CryptoService {

  conn: any;
  isLogin: boolean = false;

  constructor(private toasty: GlobalToastyService,
              private _http: HttpClientSecure) {
    // console.log('Init crypto');
    try {
      constants = avcmx.constants;
      avcmx.params();
      // console.log('ok');
    } catch (e) {
      // console.log('failed');
      CRYPTO.enabled = false;
    }
  }

  private login(): Observable<boolean> {
    // console.log('login_start');
    if (!CRYPTO.enabled) {
      this.toasty.error('Ошибка инициализации криптографического плагина. Проверьте конфигурацию рабочей станции.');
      throw 'Ошибка инициализации криптографического плагина. Проверьте конфигурацию рабочей станции.';
    }

    if (this.isLogin) {
      return observableOf(true);
    }
    let loginCallback = new Subject<boolean>();
    try {
      avcmx().connectionAsync((e, cnn) => {
        if (e) {
          // console.log('login_error');
          // console.log(e);
          this.toasty.error(e.message);
          return;
        }
        this.conn = cnn;
        // console.log('connected');
        this.isLogin = true;
        loginCallback.next(true);
      });
    } catch (e) {
      this.toasty.error(e.message);
    }
    return loginCallback.asObservable();
  }

  private sign_hash(hash): Observable<string> {
    let callback = new Subject<string>();
    this.login().subscribe((res) => {
        try {
          let hashBlob = avcmx().blob().hex(hash);
          console.log(hashBlob);
          this.conn.message(constants.AVCMF_OPEN_FOR_SIGN | constants.AVCMF_DETACHED | constants.AVCMF_ADD_SIGN_CERT)
            .finalHashAsync(hashBlob, (e, signed) => {
              if (e) {
                this.toasty.error(e.message);
                throw e;
              }
              try {
                callback.next(signed.val().base64());
              } catch (e) {
                this.toasty.error(e.message);
                throw e;
              }
            });
        } catch (e) {
          this.toasty.error(e.message);
        }
      },
      () => {
        this.toasty.error('Ошибка подписи.');
      }
    );
    return callback.asObservable();

  };

  sign(data): Observable<string> {
    let callback = new Subject<string>();
    this.login().subscribe((res) => {
        try {
          let dataBlob = avcmx().blob().hex(data);
          console.log(dataBlob);
          this.conn.message(constants.AVCMF_OPEN_FOR_SIGN | constants.AVCMF_DETACHED | constants.AVCMF_ADD_SIGN_CERT)
            .finalHashAsync(dataBlob, (e, signed) => {
              if (e) {
                this.toasty.error(e.message);
                throw e;
              }
              try {
                callback.next(signed.val().base64());
              } catch (e) {
                this.toasty.error(e.message);
                throw e;
              }
            });
        } catch (e) {
          this.toasty.error(e.message);
        }
      },
      () => {
        this.toasty.error('Ошибка подписи.');
      }
    );
    return callback.asObservable();

  };

  loadCerts(): Observable<any> {
    console.log('loadCerts_start');
    try {
      return this.conn.selectCerts(avcmx().params().add(constants.AVCM_TYPE, avcmx().blob().int(constants.AVCM_TYPE_MY)));
    } catch (e) {
      this.toasty.error(e.message);
    }
  };

  viewCert(cert) {
    try {
      cert.show(function (e) {
        if (e) {
          this.toasty.error(e.message);
          return;
        }
      });
    } catch (e) {
      this.toasty.error(e.message);
    }
  };

  private getHash(doc: IdDto): Observable<SignRequestDto> {
    return this._http.getBlock(SERVER_URL + '/crypto/hash', {
      params: { id: doc.id }
    });
  }

  signDoc(doc: IdDto): Observable<boolean> {
    let callback = new Subject<boolean>();
    this.getHash(doc).subscribe(dto => {
      // this.toasty.error(JSON.stringify(dto));
      this.sign_hash(dto.hash).subscribe(signature => {
        dto.signature = signature;
        this._http.postBlock(SERVER_URL + '/crypto/sign', dto).subscribe(() => {
          this.toasty.success('Документ подписан.');
          callback.next(true);
        });
      })
    });
    return callback.asObservable();
  }

  private getHashReferrals(project: IdDto): Observable<SignRequestDto[]> {
    return this._http.getBlock(SERVER_URL + '/crypto/referrals/hash', {
      params: { id: project.id }
    });
  }

  private getHashLifecycleGroupDecisions(project: IdDto): Observable<SignRequestDto[]> {
    return this._http.getBlock(SERVER_URL + '/crypto/lifecycle-group-decisions/hash', {
      params: { id: project.id }
    });
  }

  signReferrals(project: IdDto): Observable<boolean> {
    let callback = new Subject<boolean>();
    let guard: SignGuard = new SignGuard(callback);

    this.getHashReferrals(project).subscribe(list => {
      // this.toasty.error(JSON.stringify(dto));
      this.login().subscribe(() => {
          console.log('start sign');
          list.forEach(dto => {
            guard.add(dto);
            this.sign_hash(dto.hash)
              .subscribe(signature => {
                  dto.signature = signature;
                  this._http.postBlock(SERVER_URL + '/crypto/sign', dto)
                    .subscribe(() => {
                        this.toasty.success('Документ подписан.');
                        console.log('signed');
                        guard.finish(dto);
                      },
                      () => guard.error(dto));
                },
                () => guard.error(dto))
          });
        }
      )
    });
    return callback.asObservable();
  }

  signLifecycleGroupDecisions(project: IdDto): Observable<boolean> {
    let callback = new Subject<boolean>();
    let guard: SignGuard = new SignGuard(callback);

    this.getHashLifecycleGroupDecisions(project).subscribe(list => {
      // this.toasty.error(JSON.stringify(dto));
      this.login().subscribe(() => {
          console.log('start sign');
          list.forEach(dto => {
            guard.add(dto);
            this.sign_hash(dto.hash)
              .subscribe(signature => {
                  dto.signature = signature;
                  this._http.postBlock(SERVER_URL + '/crypto/sign', dto)
                    .subscribe(() => {
                        this.toasty.success('Документ подписан.');
                        console.log('signed');
                        guard.finish(dto);
                      },
                      () => guard.error(dto));
                },
                () => guard.error(dto))
          });
        }
      )
    });
    return callback.asObservable();
  }
}
