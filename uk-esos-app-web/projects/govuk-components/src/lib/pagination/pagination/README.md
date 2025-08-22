## Pagination

Help users navigate forwards and backwards through a series of pages. Design details can be found
at [GOV.UK Design System](https://design-system.service.gov.uk/components/pagination/).

### Inputs

- `pageSize` - Number of items per page
- `count` - Number of total items
- `hideResultCount` - Hide the results displayed next to nav element
- `hideNumbers` - Hide the numbers in the nav element, so that only previous/next buttons are displayed

### Outputs

- `currentPageChange` - Set an event triggered when `currentPage` changes

### Pagination example

```html
<govuk-pagination
  [count]="100"
  [pageSize]="10"
  (currentPageChange)="page$.next($event)">
</govuk-pagination>
```
