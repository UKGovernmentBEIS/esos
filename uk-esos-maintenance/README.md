# Develop locally

## Update Assets

Since no pipeline exists we need to manually replace paths in url due to limitations of nginx redirects

- From https://github.com/alphagov/govuk-frontend , copy `dist` folder to `assets`
- Place appropriately the following files
    - `govuk-frontend.*.min.css`
    - `govuk-frontend.*.min.css.map`
    - `govuk-frontend.*.min.js`
    - `govuk-frontend.*.min.js.map`
- In `govuk-frontend.*.min.css`
    - Replace `/assets/fonts` => `fonts`
    - Replace `/assets/images` => `images`

## Build & Run image

- docker image build -t maintenance -f Dockerfile .
- docker run -dp 127.0.0.1:80:80 maintenance

## View Changes

Since no docker-compose to account for volumes you can update the changes by directly copying into local container

- `docker ps` List the CONTAINER_ID
- `docker cp ./uk-esos-maintenance-page-web/. <CONTAINER_ID>:/usr/share/nginx/maintenance` Copy contents to the running
  container