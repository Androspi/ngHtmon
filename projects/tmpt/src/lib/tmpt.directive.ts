import { Directive, ElementRef, Input, SimpleChanges, OnChanges, OnDestroy, Output, EventEmitter, OnInit } from '@angular/core';

import { ContainerTemplate, ContainerTemplateContext, IntersectionTypeList, SomeContainerTemplateTypeList, Template, TemplateOperators } from 'htmon';

import { TmptService } from './tmpt.service';

@Directive({ selector: '[libTmpt]' })
export class TmptDirective implements OnChanges, OnInit, OnDestroy {

  /** Notifica creación o actualización profunda de la plantilla */
  @Output() templateReady: EventEmitter<IntersectionTypeList['template']> = new EventEmitter();

  @Input() templateStructure: Partial<Omit<ContainerTemplateContext, 'tag' | 'type' | 'node'>>;
  @Input() templateContext: Partial<Omit<ContainerTemplateContext, 'tag' | 'type' | 'node'>>;
  @Input() appTemplate: SomeContainerTemplateTypeList['template']['rows'];

  /** Plantilla con el elemento referenciado */
  public template: ContainerTemplate;

  constructor(private el: ElementRef<HTMLElement>, private helper: TmptService) { }

  ngOnInit() {
    const attr: Attr = this.helper.getComponentAttribute(this.el.nativeElement)[0];
    const context: Partial<ContainerTemplateContext> = { type: 'container', node: { element: this.el.nativeElement } };
    if (this.templateStructure !== undefined) {
      ['tag', 'type', 'node'].forEach(item => this.templateStructure !== undefined && item in this.templateStructure && delete this.templateStructure[item]);
      Object.keys(this.templateStructure).forEach(item => context[item] = this.templateStructure[item]);
    }
    if (this.templateContext !== undefined) {
      ['tag', 'type', 'node'].forEach(item => this.templateContext !== undefined && item in this.templateContext && delete this.templateContext[item]);
      Object.keys(this.templateContext).forEach(item => context[item] = this.templateContext[item]);
    }
    Array.isArray(this.appTemplate) && (context.rows = this.appTemplate);
    this.template = TemplateOperators.createTemplate(undefined, context, {}, attr, 0);
    this.templateReady.next(this.template);
  }

  ngOnChanges(changes: SimpleChanges) {
    /** Actualiza el contenido de la plantilla */
    if ('appTemplate' in changes) {
      const appTemplate: this['appTemplate'] = changes.appTemplate.currentValue;
      this.template instanceof ContainerTemplate && this.template.loadTemplate({ rows: appTemplate });
    }
    /** Actualiza la estructura de la plantilla */
    if ('templateStructure' in changes) {
      const templateStructure: this['templateStructure'] = changes.templateStructure.currentValue;
      ['tag', 'type', 'node'].forEach(item => templateStructure !== undefined && item in templateStructure && delete templateStructure[item]);
      if (this.template instanceof ContainerTemplate) {
        Object.entries(templateStructure).forEach(([key, value]) => this.template.templateContext[key] = value);
        this.template = this.template.reload();
        this.templateReady.next(this.template);
      }
    }
    /** Actualiza el contexto de la plantilla */
    if ('templateContext' in changes) {
      const templateContext: this['templateContext'] = changes.templateContext.currentValue;
      ['tag', 'type', 'node'].forEach(item => templateContext !== undefined && item in templateContext && delete templateContext[item]);
      this.template instanceof ContainerTemplate && Object.entries(templateContext).forEach(([key, value]) => this.template[key] = value);
    }
  }

  /** Elimina la instancia de la plantilla si existe */
  ngOnDestroy() { this.template instanceof Template && this.template.destroy(); }

}
