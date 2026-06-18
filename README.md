# ITC Deal Actions

This project is set up as a HubSpot developer project for a deal-record app card in the middle column.

It reads two deal properties from the current record and renders buttons that open those URLs:

- `edit_quote_in_sell`
- `view_opportunity_in_connectwise`

## What Changed

The old `crmCards` manifest and Express backend have been removed.

This card now uses HubSpot's current UI extension model:

- private app configuration in `src/app/app-hsmeta.json`
- app card configuration in `src/app/cards/deal-links-hsmeta.json`
- React card UI in `src/app/cards/DealLinksCard.jsx`

No external backend is required for this version.

## Project Structure

```text
hsproject.json
src/
  app/
    app-hsmeta.json
    cards/
      deal-links-hsmeta.json
      DealLinksCard.jsx
      package.json
```

## Prerequisites

- HubSpot CLI `8.8.0` or later
- access to the ITC HubSpot account
- permission to install a private app and customize deal record views

## Setup

1. Authenticate the HubSpot CLI:

```bash
hs init
hs auth
```

2. Install the card dependencies:

```bash
hs project install-deps
```

3. Upload the project:

```bash
hs project upload
```

4. Install the app from HubSpot's project details page if prompted.

5. Add the card to the deal record middle column:

- Open a deal record
- Click `Customize` at the top of the middle column
- Open the tab where you want the card
- In `Card library`, filter `Card types` to `App`
- Add `ITC deal actions`
- Click `Save and exit`

## Local Development

To develop locally:

```bash
hs project dev
```

Then reload an open deal record after the dev server starts.

## Notes

- This project assumes a single-portal private app and uses `auth.type: "static"`.
- If you later need this installed into multiple accounts, the app auth model should be changed to private OAuth.
- The card validates each property value as an `http` or `https` URL before rendering a button.
- If neither property is populated, the card shows guidance instead of empty actions.
