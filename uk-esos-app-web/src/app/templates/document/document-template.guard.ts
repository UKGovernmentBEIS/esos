import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve } from '@angular/router';

import { map, Observable, tap } from 'rxjs';

import { DocumentTemplateDTO, DocumentTemplatesService } from 'esos-api';

@Injectable({
  providedIn: 'root',
})
export class DocumentTemplateGuard implements CanActivate, Resolve<DocumentTemplateDTO> {
  documentTemplate: DocumentTemplateDTO;

  constructor(private readonly documentTemplatesService: DocumentTemplatesService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.documentTemplatesService.getDocumentTemplateById(Number(route.paramMap.get('templateId'))).pipe(
      tap((documentTemplate) => (this.documentTemplate = documentTemplate)),
      map((documentTemplate) => !!documentTemplate),
    );
  }

  resolve(): DocumentTemplateDTO {
    return this.documentTemplate;
  }
}
