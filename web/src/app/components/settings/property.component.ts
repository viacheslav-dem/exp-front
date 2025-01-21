import {PropertyDto} from "@app/dto/PropertyDto";
import {DataService} from "@app/services/data.service";
import {ToastyService} from "ng2-toasty";
import {Injectable} from "@angular/core";
import * as _ from "lodash";

@Injectable()
export class PropertyComponent<T> {

  constructor(protected _dataService: DataService,
              protected _toasty: ToastyService) {
  }

  property: PropertyDto;
  value: T;
  editedValue: T;
  isEdit: boolean;

  setProperty(property: PropertyDto) {
    this.property = property;
    this.value = property.value;
  }

  savePropertyValue() {
    console.log(this.editedValue);
    this._dataService.savePropertyValue(this.property.id, this.editedValue).subscribe(res => {
      Object.assign(this.property, res);
      this.setProperty(this.property);
      this._toasty.success('Сохранено.');
      this.onSaved();
    })
  }

  edit() {
    this.editedValue = _.cloneDeep(this.value);
    this.isEdit = true;
  }

  onSaved() {
    this.isEdit = false;
  }
}
