import { NgModule } from '@angular/core';

import { TmptDirective } from './tmpt.directive';

@NgModule({
  declarations: [TmptDirective],
  exports: [TmptDirective],
  imports: []
})
export class TmptModule { }
