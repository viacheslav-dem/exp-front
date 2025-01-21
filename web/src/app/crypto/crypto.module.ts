import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignDocComponent} from './sign-doc/sign-doc.component';
import {CryptoService} from "@app/crypto/crypto.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SignDocComponent],
  exports: [SignDocComponent],
  providers: [CryptoService]
})
export class CryptoModule {
}
