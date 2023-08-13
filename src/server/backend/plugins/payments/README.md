# Creating new payment provider integrations
All payment gateway integration plugins have to be in their own folders. This folder has to contain a file called [Payment gateway name as camelCase word (starting in small letter)]Routes.js, a file called plugin.json and any number of other files that it needs. 

You will also need to add documentation for the user to set up the payment gateway. Read on below to find out how.

## Setting up the routes.js file
Take some inspiration of the stripe or payrexx setup as these are officially supported by the system and have been developed by the original creator.

The express.js routes it has to expose are the following:

- /payments/prepare (POST) (returns object: { 'link': [Link to the payment gateway payment], 'id': [Purchase ID to subscribe to status updating] })
- /payments/getStatus (SSE) (sends updates to the UI once subscribed (like payment success) using the id sent by /payments/prepare)

It can contain any number of (not interfering) routes. Please always use the /payments/ route as a base to avoid running into problems.

## configOption.json
This file contains the settings that should be available in the settings page of libreevent. It should contain the following fields, as required by the settings.vue module. 

