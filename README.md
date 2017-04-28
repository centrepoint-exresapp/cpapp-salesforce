# Centrepoint Alumni help

Link to herokuapp: https://centrepoint-inform.herokuapp.com/

An app to allow former Centrepoint residents access their Centrepoint housing information, which comes directly from Salesforce where available, or raises a ticket in Salesforce if the information requested isn't kept in the system (eg rental references).

## Technical decisions

### Platform: exresident app
- Mobile-first web app
- Should be able to work well on older smartphones with smaller screens

### Tech stack
- Frontend: HTML, CSS, Materialize, JavaScript
- Backend: Node.js, Hapi.js, Handlebars, Postgres, Salesforce API
- Auth: Yoti

### Setting up the connection with Salesforce
This version of the app is connected with a sandbox of the Centrepoint instance of Salesforce/In-Form.

The following steps were required to set up the connection between this app and the sandbox:
- Centrepoint provided a Sandbox environment with login credentials
- Asssessment of the connection options, which are [documented here](./salesforce.md). Based on advice from a salesforce engineer, I went ahead with the Salesforce REST API
- I created a [Connected App](https://developer.salesforce.com/page/Connected_Apps) using my salesforce developer account
- I saved credentials from my Connected App and my login for the sandbox instance as environment variables in my local version of the app
- I then used an npm module called nforce to handle the authentication with the salesforce sandbox
- I discovered that it's necessary to have administrator privileges in the sandbox in order to be able to see the API field names and be able to write queries. In-Form, which is the homeless-specific version of Salesforce, has numerous custom fields
- Queries to the system are written in SOQL, which is a version of SQL (some syntax is different)

At present the app is set up to query the system for the current client's accommodation history, and to dummy a response for raising a ticket in the system.

The [heroku app](https://centrepoint-inform.herokuapp.com/) I created for this version of the Centrepoint Alumni app was built from the Salesforce github branch of this repo, not from master. As salesforce integration feature isn't complete, it hasn't been merged.

## App flow

<img src="./wireframes/cpapp-wireframe.png" width="450"/>

## Database schema

We would most likely want to revise the database schema if further work is done on the app.

<img src="./wireframes/db-schema.png" width="300"/>

## Design decisions

Fonts and colours were taken to match those at https://centrepoint.org.uk

#### Fonts

- Body text: Lato (regular)
- Headings: Oswald (regular)
- Fallbacks: Sans-Serif

#### Colour palette
- color1: rgb(54,54,54);
- color2: rgb(233,230,220);
- color3: rgb(209,68,20);
- color4: rgb(255,209,65);
- color5: rgb(246,246,246);

## Installation instructions

- Clone this repo and `cd` into it
- Install Postgres ([see here for instructions](https://github.com/dwyl/learn-postgresql))
- Enter Postgres command line tool (`psql postgres` on Mac)
- Create database by typing `CREATE DATABASE exresident_requests;`
- Ask us for the database password
- Add user 'centrepoint' and assign as the owner of the database:  
  `CREATE USER centrepoint WITH SUPERUSER PASSWORD 'password-here';`  
  `ALTER DATABASE exresident_requests OWNER TO centrepoint;`
- Create a `config.env` file with the following two lines:  
  `export DB_URL = postgres://centrepoint:password-here@localhost:5432/exresident_requests`
  `export DB_MAX_CONNECTIONS = 2`   
- Run `npm install` to install all dependencies
- Run `npm run build` to build the database
- Run `npm start` to start the server
- Navigate to `http://localhost:9443/` in your browser

#### Set up an HTTPS server
- generate a key file for your certificate  ($ openssl genrsa -out key.pem 2048)
- generate an intermediate file (csr)  ($ openssl req -new -key key.pem -out csr.pem)
- generate a certificate file, using the key and csr ($ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem)
- remove the intermediate csr file

## User stories: ex-resident

**As a** former resident of Centrepoint  
**I would like** to have access to information held by Centrepoint  
**so that** I can request my former address securely

**As a** former resident of Centrepoint  
**I would like** all services to be available in one place  
**so that** I can get my information easily  

**As a** former resident of Centrepoint  
**I would like** the app to work on both mobile and desktop  
**so that** access it regardless of whichever platform I'm using  

**As a** former resident of Centrepoint  
**I would like** to know what type of information I can request  
**so that** I don't waste time with Yoti authentication if it's not going to give me what I need  

**As a** former resident of Centrepoint  
**I would like** to log in to Yoti quickly and easily  
**so that** I can get my information without a big hassle  

**As a** former resident of Centrepoint  
**I would like** to have options to be contacted by mail or e-mail  
**so that** receive the requested information how I choose  

**As a** former resident of Centrepoint  
**I would like** the app to look simple, and the form data to be easy to input  
**so that** I can get my information on the move

**As a** former resident of Centrepoint  
**I would like** to know long it would take for Centrepoint to contact me  
**so that** if my information isn't available right away, I know when it will be available  

**As a** former resident of Centrepoint  
**I would like** to stay logged in until I log out  
**so that** I am authenticated with the app when (and only when) I'm using it

## User stories: Centrepoint staff

**As a** Centrepoint staff member  
**I would like** to reduce the complications of getting ex-residents their information  
**so that** they don't miss out on housing benefits or fall into arrears through delays

**As a** Centrepoint staff member  
**I would like** to have requests appear in In-Form  
**so that** the process of helping ex-residents is streamlined
