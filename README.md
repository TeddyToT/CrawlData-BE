# CrawlData-BE
## Installation Eequirements 

Ensure you have installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [PostgreSQL](https://www.postgresql.org/)
- A running database in PostgreSQL server, use the init.sql in the root folder to create tables

## Environment Configuration
Create a `.env` file in the root of your directory with the following variables:

```env
# Base URL of the website to crawl
BASE_URL=https://tuoitre.vn

# Number of times to click "Load more" (usually 1 or 2)
MAX_LOAD_MORE=2

# PostgreSQL database connection
PG_HOST=                    # example: localhost
PG_PORT=5432
PG_USER=                    # example: postgres
PG_PASSWORD=                # example: your_password
PG_DATABASE=                # example: crawl-tuoi-tre

# Port for backend server
HOST=                       # example: 8001
```

## Install Dependencies
### npm
```
npm install
```

### yarn
```
yarn install
```

## Running the Server
### npm
```
npm start
```

### yarn
```
yarn start
```
