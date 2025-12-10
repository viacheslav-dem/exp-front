import {Directive, forwardRef} from '@angular/core';
import {FormControl, NG_VALIDATORS} from "@angular/forms";
import {PasswordDto} from "@app/dto/PasswordDto";


//отвечает только за совпадение. Остальное(паттерн, обязательность) - у каждого input по-отдельности
function passwordValidatorFactory() {
  return (c: FormControl) => {
    let passwordDto = <PasswordDto>(c.value);
    if (passwordDto && passwordDto.password && passwordDto.passwordConfirmation && passwordDto.password != passwordDto.passwordConfirmation) {
      return {
        passwordValidator: {
          valid: false
        }
      }
    } else return null;
  };
}

@Directive({
    selector: '[passwordInputValidator][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => PasswordInputValidatorDirective), multi: true }
    ],
    standalone: false
})
export class PasswordInputValidatorDirective {

  validator: Function;

  constructor() {
    this.validator = passwordValidatorFactory();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}
