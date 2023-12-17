import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatalogBrand, CatalogItem, CatalogPage, CatalogType } from '../../catalog/models';
import { toQueryParams } from '../../utils/to-query-params';
import { environment } from '../../../environments/environment';
import { ValueChanged } from '../../admin/models/value-changed';

@Injectable({providedIn: 'root'})
export class CatalogService {
  constructor(private readonly http: HttpClient) {
  }

  fetchCatalogItems(brandId?: number, typeId?: number, pageIndex?: number): Observable<CatalogPage> {
    return this.http.get<CatalogPage>(`${environment.apiUrl}/catalog-query/api/items`, {
      params: toQueryParams({
        brandId,
        typeId,
        pageIndex
      }),
    });
  }

  fetchById(catalogItemId: number): Observable<CatalogItem> {
    return this.http.get<CatalogItem>(`${environment.apiUrl}/catalog-query/api/items/${catalogItemId}`);
  }

  add(catalogItem: CatalogItem): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/catalog-command/api/items`, catalogItem);
  }

  update(catalogItem: CatalogItem): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/catalog-command/api/items`, catalogItem);
  }

  updateName(updatedName: ValueChanged<string>): Observable<void> {
    const body = {
      productId: updatedName.productId,
      name: updatedName.value
    };
    return this.http.put<void>(`${environment.apiUrl}/catalog-command/api/items/${updatedName.productId}/changeproductname`, body);
  }

  updatePrice(updatedPrice: ValueChanged<number>): Observable<void> {
    const body = {
      productId: updatedPrice.productId,
      price: updatedPrice.value
    };
    return this.http.put<void>(`${environment.apiUrl}/catalog-command/api/items/${updatedPrice.productId}/changeprice`, body);
  }

  delete(catalogItemId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/catalog-command/api/items/${catalogItemId}`);
  }

  fetchCatalogTypes(): Observable<CatalogType[]> {
    return this.http.get<CatalogType[]>(`${environment.apiUrl}/catalog-query/api/categories`);
  }

  fetchCatalogBrands(): Observable<CatalogBrand[]> {
    return this.http.get<CatalogBrand[]>(`${environment.apiUrl}/catalog-query/api/brands`);
  }

  fetchTopFive(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${environment.apiUrl}/flux-gateway/api/v1/catalog/topfive`);
  }

}
