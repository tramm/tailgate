## Boilerplate
Boilerplate with React, Material-UI, Next, Express, Mongoose, MongoDB.


## Contents
- [Run locally](#run-locally)
- [Deploy](#deploy)
- [Built with](#built-with)
  - [Core stack](#core-stack)
  - [Third party APIs](#third-party-apis)
- [Project structure](#project-structure)


## Run locally
- Clone the project and run `yarn` to add packages.
- Before you start the app, create a `.env` file at the app's root. This file must have values for env variables specified below.
  - To get `MONGO_URL_TEST`, we recommend a [free MongoDB at mLab](http://docs.mlab.com/).

  - Specify your own secret key for Express session `SESSION_SECRET`: https://github.com/expressjs/session#secret.

  `.env` :
  ```
  MONGO_URL_TEST="XXXXXX"

  ```
  
- Start the app with `yarn dev`.


## Deploy
See the [deploy section](https://github.com/tramm/tailgate#deploy) on our main repository README.


## Built with

#### Core stack
- [Express](https://github.com/expressjs/express)
- [Mongoose](https://github.com/Automattic/mongoose)
- [MongoDB](https://github.com/mongodb/mongo)

#### Third party APIs
- Odoo API

Check out [package.json](https://github.com/tramm/tailgate/blob/master/web/package.json).


## Project structure

```
.
├── server                      # Server code
│   ├── models                  # Mongoose models
│   │   ├── User.js             # User model
│   ├── app.js                  # Custom Express/Next server
│   ├── passport.js             # JWT OAuth API
├── static                      # Static resources
├── .gitignore                  # List of ignored files and directories
├── package.json                # List of packages and scripts


```
