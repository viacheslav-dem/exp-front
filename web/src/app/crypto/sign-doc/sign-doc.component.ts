import {Component, Input, OnInit} from '@angular/core';
import {CryptoService} from "@app/crypto/crypto.service";
import {IdDto} from "@app/dto/IdDto";

@Component({
    selector: 'app-sign-doc',
    templateUrl: './sign-doc.component.html',
    styleUrls: ['./sign-doc.component.scss'],
    standalone: false
})
export class SignDocComponent implements OnInit {

  @Input() doc: IdDto;

  constructor(private crypto: CryptoService) {
  }

  ngOnInit() {
  }

  sign() {
    this.crypto.signDoc(this.doc);
  }
}
