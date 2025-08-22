## Phase banner

The phase banner component can be used when your service is still being developed and is hosted
on the service gov.uk subdomain. An alpha banner should be used when your service is in alpha,
and a beta banner if your service is in private or public beta.
Design details can be found at [GOV.UK Design System](https://design-system.service.gov.uk/components/tag/).

Any content can be projected within the component, and will be displayed as the phase banner body.

### Inputs

- `phase` - The phase tag, can take only `alpha` or `beta` values.
- `tagColor` - Choose the color of the tag. If not provided will default to `#1d70b8` the color of `.govuk-tag` class.

### Example

```html
<govuk-phase-banner phase="alpha">This is a new service</govuk-phase-banner>
```
