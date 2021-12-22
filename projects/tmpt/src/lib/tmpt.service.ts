import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TmptService {

  constructor() { }

  /**
   * Obtiene el atributo ng del componente
   * @param elementRef Elemento de referencia
   * @returns Atributos _ng que genera angular
   */
  getComponentAttribute = (elementRef: HTMLElement): Attr[] => Array.from(elementRef.attributes).filter((elm: Attr) => elm.name.includes('_ng'));

}
