import {Component} from "@angular/core";
import {ToastyConfig, ToastyService} from "ng2-toasty";
import {GlobalToastyService} from "./services/global-toasty.service";
import * as moment from 'moment';
import {CRYPTO} from "@app/config";
import {library} from '@fortawesome/fontawesome-svg-core';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ruLocale} from 'ngx-bootstrap/locale';
import {
  faAngleDown,
  faAngleUp,
  faArrowDown,
  faCalendar,
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircle,
  faCog,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFileWord,
  faInfo,
  faInfoCircle,
  faKey,
  faList,
  faMinus,
  faPencilAlt,
  faPlus,
  faPowerOff,
  faSort,
  faSortAlphaDown,
  faSortAlphaUp,
  faSortAmountDown,
  faSortAmountUp,
  faTimes,
  faTrashAlt,
  faUser,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';

defineLocale('ru', ruLocale);
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
      private _toastyService: ToastyService,
      private _toastyConfig: ToastyConfig,
      private _toasty: GlobalToastyService,
      private _localeService: BsLocaleService,
  ) {
    moment.locale('ru');
    this._localeService.use('ru');
    library.add(faInfo, faTrashAlt, faPencilAlt, faArrowDown, faEye, faEyeSlash, faCog, faTimes,
      faCheck, faPlus, faMinus, faCalendar, faCircle, faUser, faKey, faList, faInfoCircle, faPowerOff,
      faSortAlphaDown, faSortAlphaUp, faSortAmountDown, faSortAmountUp, faSort, faChevronUp, faChevronDown,
      faAngleDown, faAngleUp, faExclamationTriangle, faFileWord, faPlayCircle);
    this.toastyInit();
    //this.initCrypto();
  }

  toastyInit() {
    // this._toastyConfig.theme = 'bootstrap';
    // this._toastyConfig.position = 'top-right';
    this._toastyConfig.theme = 'bootstrap';
    this._toasty.globalToastyHandled.subscribe(value => {
      switch (value['type']) {
        case 'success':
          this._toastyService.success(value['data']);
          break;
        case 'error':
          this._toastyService.error(value['data']);
          break;
        case 'warn':
          this._toastyService.warning(value['data']);
          break;
        default:
          this._toastyService.info(value['data']);
      }
    });
  }

  //initCrypto() {
  //  CRYPTO.enabled = window.document['documentMode'] === 11;
  //  console.log("CRYPTO.enabled", CRYPTO.enabled);
  //}
}
