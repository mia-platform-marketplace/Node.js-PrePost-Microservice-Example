# %CUSTOM_PLUGIN_SERVICE_NAME%

[![pipeline status][pipeline]][git-link]
[![coverage report][coverage]][git-link]

## Summary

%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%

## Local Development

This example allow you to learn how to create a pre/post microservice that can be added to Mia-Platform Pre/Post Orchestrator (Microservice Gateway) to enrich APIs Calls. More details here [https://docs.mia-platform.eu/development_suite/api-console/api-design/decorators/]().

This example sends a message to a Slack channel each time you send a POST message to a CRUD collection.

## Setup Mia-Platform

When you have created this microservice you need to setup Mia-Platform in order to use this service.

The main steps are:

- setup the Env Variables for this service
- create an App on Slack
- add an external proxy that points to the Slack App
- create a CRUD Collection
- create a Post Hook that points to this microservice
- add to the CRUD Collection the Post Hook

Follow the next steps to complete the setup.

### Step 1 - Create the Notifier Service

From the Mia-Platform Marketplace on DevOps Console select this service and Create it. In this example give to the microservice the name **SendNotifications** (you can use any name)

Once created go in *DevOps Console -> Design -> Microservices -> your just created microservice (SendNotifications)* and add to it the following environment variables in the table *Environment variable configuration* (Key=Value)

```json
SERVICE_NAME=api-gateway
SERVICE_PORT=8080
```

Press *Commit & Generate* to save the configuration.

### Step 2 - Slack App

You need a Slack App to send a message to a Slack Channel. In order to setup the App on Slack go to Slack API [https://api.slack.com/apps]() and press **Create New App**.

Give a name to the App and select the *Slack Workspace* where you want to install

Once created select ***Incoming Webhooks** -> Activate It (On) -> Add New Webhook to Workspace -> Select the Channel (example general)*. Slack generate for you the URL to post a message to Slack

`https://hooks.slack.com/services/lsjkfdkdfsbfjkbadkl/fshdklfddshfadfshdfskl`

> Note: this is a fake url. Don't use it :-)

Try if it works with a Curl

```bash
curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/lsjkfdkdfsbfjkbadkl/fshdklfddshfadfshdfskl
```

You should see on channel general the *Hello, World!* message.

Now you can pass to the DevOps Console.

### Step 3 - Post Hook

The Post hook will be triggered after an API call. To create it go to *DevOps Console -> Design -> Pre/Post Microservices -> POST -> Add New*.

Use the following parameters:

- name: notify (but you can use whatever)
- protocol: http
- microservice: the microservice you have created at Step-1, **SendNotifications**
- port: 80
- path: /notify (is the path exposed by **SendNotifications**, you can change it changing the *index.js* of this microservice)
- Require request body: true
- Require response body: true

> Note: *Require request body* and *Require response body* must be checked otherwise you obtain unexpected error `invalid protocol in post`.

### Step 4 - External Proxy

The External Proxy decouple the url generated by Slack from the Microservices that runs inside Mia-Platform. In this way you have more control on the external call made by services and the reverse proxy is centralized in one point of the k8s namespace and not spread across all microservices.

To create a proxy go to *DevOps Console -> Design -> Proxies -> Create New Proxy -> External and create it with the following values:

- name: notify-slack
- url: `https://hooks.slack.com/services/lsjkfdkdfsbfjkbadkl/fshdklfddshfadfshdfskl` (the url you just created for the new Slack App)

> Mod: you can change the name of *notify-slack* but you need to modify  *notifications-sender.js - line 22* or pass the name via environment variables.

### Step 5 - CRUD Collection and Expose it

The CRUD service stores all messages sent to Slack. We will add to POST the post to hook created before.

To create a CRUD go to *DevOps Console -> Design -> CRUD -> Create new CRUD* and give the name *Messages* (or whatever you prefer).
Add to it two String fields:

- mymsg
- who

> Mod: you can change the fields names but if you do it you must update this file *notifications-sender.js - lines 19,22* and the related test files. You can also change the source code and pass the field names as environment variables to this microservice.

### Step 6 - Expose the CRUD Collection and add Post Hook

To expose the CRUD Collection go to *DevOps Console -> Design -> Endpoints -> Create new Endpoint* and with the following values:

- name: **/messages**
- type: CRUD
- collection: *Messages*

Once created go to Routes section on the Endpoint just created and select **POST/**. Go to **Add Pre/Post Microservice** and the Hook with the following values:

- Type of decorator: POST
- Select the decorator: the name of the Hook you just created at Step 3, *notify*

### Step 6 - Deploy and Test

That's all! Now you can Commit and Deploy.

- Press *Commit & Generate* and save your configuration
- Go to *DevOps Console -> Deploy*, select your branch and environment e press deploy

In less that one minute all will be up and running!

To test it go to  *DevOps Console -> Documentation -> The Environment where you deployed the configuration. This will open the API Portal.

On API Portal locate your CRUD service named *Messages*. Select POST and send a message filling *mymsg* and *who* fields.

```bash
curl --request POST \
  --url https://your-url/v2/messages/ \
  --header 'accept: */*' \
  --header 'content-type: application/json' \
  --data '{"who":"Giulio","mymsg":"Ciao from Mia-Platform"}'
```

This will generate a message on your Slack channel!

> Note: be aware that all is not protected! Don't use those configuration in production! You need to protect your CRUD endpoint before going in production.

## Improvements

You can do a lot of modifications on this example:

- protect your routes with API Secrets and Auth!
- connect the CRUD to the Mia-Platform Headless CMS to trace the messages and visualize analytics.
- enrich the CRUD Messages with GeoData to visualize the messages on Maps
- send notification to other Apps instead of Slack
- create a rich configuration of this service via Env Vars and Config Maps
- and a lot more!

## Run it locally

To run this service locally for further development follow those steps.

Copy the env vars

```shell
cp ./default.env ./local.env
```

Run install and test

```shell
npm ci
npm run coverage
```

To start it locally

```shell
npm run start:local
```

----------------------------------

[pipeline]: %GITLAB_BASE_URL%/%CUSTOM_PLUGIN_PROJECT_FULL_PATH%/badges/master/pipeline.svg
[coverage]: %GITLAB_BASE_URL%/%CUSTOM_PLUGIN_PROJECT_FULL_PATH%/badges/master/coverage.svg
[git-link]: %GITLAB_BASE_URL%/%CUSTOM_PLUGIN_PROJECT_FULL_PATH%/commits/master

[nvm]: https://github.com/creationix/nvm
[merge-request]: %GITLAB_BASE_URL%/%CUSTOM_PLUGIN_PROJECT_FULL_PATH%/merge_requests
