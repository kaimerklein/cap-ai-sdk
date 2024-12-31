# Accessing a Large Language Model (LLM) with SAP Generative AI Hub on BTP from a CAP Application

This repository demonstrates how to use SAP's AI Core SDK in a CAP (Cloud Application Programming Model) application to access large language models (LLMs) via the SAP Generative AI Hub, which is part of SAP AI Core on the SAP Business Technology Platform (BTP).

## Getting Started

### Prerequisites

1. **Development Environment**:

   - Install the latest LTS version of [Node.js](https://nodejs.org/).
   - Install SQLite (required for Windows users).
   - Optionally, use [VSCode](https://code.visualstudio.com/) for development.

   Refer to the [CAP documentation](https://cap.cloud.sap/docs/get-started/) for more details.

2. **SAP BTP Setup**:

   - Ensure the Cloud Foundry (CF) environment is activated in your SAP BTP subaccount.
   - Create a Cloud Foundry space with at least 1 GB of memory quota.

3. **Tools Installation**:

   - Install the [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html).
     For macOS, use:
     ```bash
     brew install cloudfoundry/tap/cf-cli@8
     ```

4. **SAP AI Core Service**:
   - Create a service instance of SAP AI Core in your BTP subaccount.
   - Deploy a large language model such as OpenAI's GPT-4o. Detailed steps are available in the [SAP AI Core Service Guide](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/generative-ai-hub-in-sap-ai-core-7db524ee75e74bf8b50c167951fe34a5?locale=en-US).
   - Use `aicore` as the instance name for consistency with this example, or update the references in the code if you choose a different name.

---

## Running the CAP Service Locally

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/kaimerklein/cap-ai-sdk.git
   cd cap-ai-sdk
   npm install
   ```

2. Log in to Cloud Foundry and bind your AI Core instance:

   ```bash
   cf login

   cds bind aicore --to aicore --kind aicore
   ```

3. Start the CAP service locally with hybrid testing enabled. The application will use the credentials from the AI Core instance:
   ```bash
   cds watch --profile hybrid
   ```

---

## Deploying to SAP BTP (Cloud Foundry Runtime)

### Preparing for Deployment

1. If your AI Core instance name differs from `aicore`, update the reference in `mta.yaml`.

2. Install required tools if not already available:

   ```bash
   npm install -g mbt
   cf install-plugin multiapps
   ```

3. Build and deploy the MTA application:

   ```bash
   cds build --production

   npm update --package-lock-only

   mbt build -t gen --mtar mta.tar

   cf deploy gen/mta.tar
   ```

### Creating Service Keys for Authentication

1. Create a service key for the XSUAA instance:

   ```bash
   cf create-service-key cap-ai-sdk-auth local-test
   ```

2. Retrieve the key details:

   ```bash
   cf service-key cap-ai-sdk-auth local-test
   ```

   Note the `clientid`, `clientsecret`, and `url` values from the service key.

3. Install the [REST Client plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). Copy the file `.env-template` to `.env` and copy and paste clientid, clientsecret, url and the application route into it.

   Use the file `test/http/ChatService-CF.http` in VS Code leveraging the REST Client plugin to retrieve an access token and to execute API requests.

   Alternatively, use tools like [Bruno](https://www.usebruno.com/) or Postman to make a POST request with OAuth2 Bearer authentication.

---

## Accessing the CAP Application

1. Find the route to your deployed CAP application:

   ```bash
   cf apps
   ```

2. Append the API endpoint path to the route. For example:

   ```
   <route>/odata/v4/chat/question
   ```

3. Send a POST request to the endpoint with a JSON body. Example:

   ```json
   {
     "question": "tell me a joke"
   }
   ```

   Don't forget to provide the access token in the HTTP header, if your tool doesn't add it automatically:

   ```text
   Authorization: Bearer <access_token>
   ```

You can use tools like `curl`, Postman, or Bruno to interact with the API.

---

## Notes

- Ensure your SAP BTP environment is properly configured to support the SAP AI Core service.
- For troubleshooting, consult the SAP AI Core [documentation](https://help.sap.com/docs/sap-ai-core).

---

## License

This repository is licensed under [MIT License](LICENSE).
