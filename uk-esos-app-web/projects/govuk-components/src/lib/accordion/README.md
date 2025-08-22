## Accordion component

Accordion component lets users show and hide sections of related content ona a page
Design details can be found at [GOV.UK Design System](https://design-system.service.gov.uk/components/accordion/).

The accordion component **must** contain at least one `<govuk-accordion-item>`.

Adding a summary below the title of an accordion item can be achieved with the `[summary]` input.

### Inputs

Accordion component:

- `id` - The accordion id
- `openIndexes` - Optional opened item indexes to override the session storage cache of opened items. Indexes start from 1

Accordion item component:

- `header` - The accordion's item header

### Examples

```angular2html
<govuk-accordion id="accordion">
  <govuk-accordion-item header="Something" summary="More info">
    <p class="govuk-body">Content</p>
  </govuk-accordion-item>
</govuk-accordion>

<govuk-accordion id="async-accordion">
  <govuk-accordion-item *ngFor="let item of items$ | async"
                        [header]="item.header" [summary]="item.summary">
    <p class="govuk-body">{{ item.content }}</p>
  </govuk-accordion-item>
</govuk-accordion>
```

where `items$`:

```js
items$ = of([
  { header: 'Header 1', summary: 'Summary 1', content: 'Content' },
  { header: 'Header 2', summary: 'Summary 2', content: 'Content' },
]);
```
