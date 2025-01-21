import {Subject} from "rxjs";
import {SignRequestDto} from "@app/dto/SignRequestDto";

export class SignGuard {

  processing = {};

  constructor(private $emitter: Subject<boolean>) {
  }

  add(item:SignRequestDto){
    console.log('add '+item.hash);
    this.processing[item.hash]='progress';
  }

  finish(item:SignRequestDto){
    console.log('finish '+item.hash);
    this.processing[item.hash]='done';
    this.check();
  }

  error(item:SignRequestDto){
    console.log('error '+item.hash);
    this.processing[item.hash]='fail';
    this.$emitter.next(false);
  }

  check(){
    let counter = 0;
    for (let key in this.processing){
      if (this.processing[key] == 'progress')
        counter++;
    }
    if (counter == 0) {
      console.log('EMIT');
      this.$emitter.next(true);
    }
  }
}
