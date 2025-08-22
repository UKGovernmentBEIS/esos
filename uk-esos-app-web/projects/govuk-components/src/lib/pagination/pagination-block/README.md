## Pagination Block

Help users navigate forwards and backwards through a series of pages. Design details can be found
at [GOV.UK Design System](https://design-system.service.gov.uk/components/pagination/).

### Inputs

- `previous` - `GovukPaginationBlock` with `labelText` and `href` on previous button
- `next` - `GovukPaginationBlock` with `labelText` and `href` on next button

### Pagination Block example

```html
<govuk-pagination-block
  [previous]="{ labelText: 'Landing', href: ['/landing'] }"
  [next]="{ labelText: 'Accounts', href: ['/accounts'] }"
></govuk-pagination-block>
```
