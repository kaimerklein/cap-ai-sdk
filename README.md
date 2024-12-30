# Accessing a LLM with SAP Generative AI Hub on BTP from a CAP Application

This example demonstrates a way to use SAP's AI Core SDK in a CAP (Cloud Application Program Model) application to access large language models provided by the generative AI Hub, which is part of SAP's AI Core service on the SAP Business Technology platform.

## Getting started

### Preparation

Install the latest LTS version of Node.js, SQlite (if you are on Windows) and, as recommendation, VSCode. See [here](https://cap.cloud.sap/docs/get-started/) for more details.

Make sure you have the Cloud Foundry Environment activated in your BTP subaccount and a CF space created with 1 GB Memory quota available to it.

Install the Cloud Foundry CLI as documented [here](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html), for example on MacOS with

```bash
brew install cloudfoundry/tap/cf-cli@8
```

Create a service instance of SAP AI Core on BTP Subaccount and deploy a Large Language Model - for the code to be used directly, use OpenAI gpt-4o. For details, see [here](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/generative-ai-hub-in-sap-ai-core-7db524ee75e74bf8b50c167951fe34a5?locale=en-US). Ideally, use **aicore** as name for the instance - otherwise, adjust the references to it.

### Local Execution of the CAP service, accessing the LLM via BTP

Clone this repo and run `npm install`

We will use CAP's hybrid testing capability. Log on to Cloud Foundry and bind your AI Core instance:

```bash
cf logon

cds bind aicore --to aicore --kind aicore
```

Now, you can start the CAP Service locally. It will acquire the credentials for the aicore instance from BTP and inject them to the service, thus emulating a service binding in Cloud Foundry. Start the application as follows:

```bash
cds watch --profile hybrid
```

### Deployment to SAP BTP, Cloud Foundry Runtime

In case your AI Core instance has a different name than **aicore**, change the reference to it in `mta.yaml`.

First, prepare for the deployment of an MTA application as follows:

```bash
npm i -g mbt    # in case you haven't installed the tool already

cf install-plugin multiapps # in case you haven't yet installed the plugin
```

Ensure that you are logged on to Cloud Foundry and execute the following CLI commands:

```bash
cds build --production

npm update --package-lock-only

mbt build -t gen --mtar mta.tar

cf deploy gen/mta.tar
```

Now, create a service key for the XSUAA instance, so that you can retrieve an access token for accessing the API exposed by the CAP service:

```
cf create-service-key cap-ai-sdk-auth local-test

# get the key and display on console
cf service-key cap-ai-sdk-auth local-test
```

You will need `clientid`, `clientsecret`, and `url` from the key. For example with

```bash
# be careful to mask ! and $ signs in clientid and clientsecret with a backslash \

curl -d grant_type=client_credentials -u <clientid>:<clientsecret> <url>/oauth/token
```

Alternatively, use [bruno](https://www.usebruno.com/) or another tool like Postman to make a POST request to the API with OAuth2 Bearer authentication.

Find the route to your CAP application on BTP and append the path to the API:

```bash
cf apps     # will return the route to your app
```

Append `/odata/v4/chat/question` to the route. To this endpoint, you can send the POST request with a body like:

```json
{
  "question": "tell me joke"
}
```
