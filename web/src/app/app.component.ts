import {Component} from "@angular/core";
import {GlobalToastyService} from "./services/global-toasty.service";
import {CRYPTO} from "@app/config";
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ruLocale} from 'ngx-bootstrap/locale';
import {
  faAngleDown,
  faAngleUp,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
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
  faUsers,
  faPlayCircle,
  faFile
} from '@fortawesome/free-solid-svg-icons';

defineLocale('ru', ruLocale);
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: false
})
export class AppComponent {

  constructor(
      private _localeService: BsLocaleService,
      private faIconLibrary: FaIconLibrary,
  ) {
    this._localeService.use('ru');
    this.faIconLibrary.addIcons(
      faInfo, faTrashAlt, faPencilAlt, faArrowDown, faEye, faEyeSlash, faCog, faTimes,
      faCheck, faPlus, faMinus, faCalendar, faCircle, faUser, faUsers, faKey, faList, faInfoCircle, faPowerOff,
      faSortAlphaDown, faSortAlphaUp, faSortAmountDown, faSortAmountUp, faSort, faChevronUp, faChevronDown,
      faAngleDown, faAngleUp, faAngleLeft, faAngleRight, faAngleDoubleLeft, faAngleDoubleRight,
      faExclamationTriangle, faFileWord, faPlayCircle, faFile
    );
    //this.initCrypto();
  }

  //initCrypto() {
  //  CRYPTO.enabled = window.document['documentMode'] === 11;
  //  console.log("CRYPTO.enabled", CRYPTO.enabled);
  //}
}
