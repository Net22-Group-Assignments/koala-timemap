# Koala Timemap

The intention with this project is to provide a tool for tracking time on projects.

**We used a board on trello as our planning tool/issue tracker**.
**Link**: [Koala Kanban](https://trello.com/b/rp5OgZdT/koala-time-map)

The application uses a page on [Notion.so](https://www.notion.so/) with 3 databases on Notion as its data storage. The frontend is a webpage built with React. The backend is a webservice built with Express.js running on Node.js. The backend keeps track of users Notion credentials and acts as a middleman to Notions API. The last point is crucial as Notion does not allow calls against its API directly from a browser. The backend can delegate API calls transparently but also, and this is more commonly used in this project, provides its own API. This API can simplify some calls as logic for handling more complicated requests can be located on the backend. Data that needs multiple roundtrips to notion can be aggregated on the backend and sent to requesting parties as one complete response.


## Getting Started

Both the backend (Express app in server folder) and frontend (React app in client folder) can be installed and run independently in each folder with `npm install` and `npm start` respectively, but as a short hand it is possible to run these commands in the repositorys root folder. The install can take some time as it needs to install both the backend with its dependencies in the server folder and a copy of React in the client folder. When installation is complete, `npm start` will run both server and client concurrently.

The client app will run in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The server app will run in the background on [http://localhost:3001](http://localhost:3001)
To see available endpoints, before starting the server, run the command `npm run swagger-autogen`. Now when the server is running, open [http://localhost:3001/api-docs](http://localhost:3001/api-docs).

When running this configuration the support for authorization and authentification is switched off. This mode is for simplifying development, testing and demoing the code. When running with the production settings with security, a user account on Notion that has been added to the Koala timemap workspace is needed.

## Architecture

A general overview of the application.

### Server

The server is built with the following:

- Node
- Express
- SQLite
- Axios
- Notion's official client.

Express is used to create the server and handle the routes.
Requests to Notion are made using the official Notion API client, the exceptions being when starting up and checking if the internal token is valid and when registering a public integration token with Notion. In those cases, Axios is used.

All routes are defined in separate files in the `routes` folder. When requests are made from the client, express hands off the requests to functions from the different service objects in the `service` folder. The service objects performs transformation, validation and other checks before making the actual requests to Notion with the Notion client. The response from Notion can be validated or mutated as desired before being sent back to the frontend.

User credentials are stored in a SQLite database. This database is checked against a token from a connecting client. If available, a Notion client object will be created an placed in a pool for further use. If not, a client application most retrieve a new token from the server with username/password or a one-time code depending on configuration. If the client has never registered with the server, or if the Notion token has been deleted in the server, a new token must be registered on Notion. If succesful, a client will be created and a bearer token is passed on to the client.

## Client

The server does not make any assumptions how the client is built except that it must follow the security protocols the server puts up. This implementation uses a React Web application as its frontend. The application is built with a mix of  components built from scratch and components, hooks and functions installed from NPM.

Currently, the main functionality lives on the front page.







