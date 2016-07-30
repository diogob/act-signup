# Act signup with event recorder

## Requirements

 * Node.js and npm
 * Ruby and foreman
 * PostgreSQL 9.4+
 * stack (only if you need to compile the backend binaries)

## Installing dependencies

### Backend binaries

First make sure you have the postgrest-ws and act-recorder binaries.
There are no pre-built binaries for Mac, so you have to install from the 
[posgrest-ws repo](https://github.com/diogob/postgrest-ws) and
[act-recorder repo](https://github.com/diogob/act-recorder).

### Database schema

Assuming that you can connect as superuser to a local PostgreSQL server using psql 
without any parameters:
```
psql < db/signup.sql
```

### Frontend dependencies

```
npm install
```

### Foreman to run everything

```
gem install foreman
```

## Running

```
foreman start
```

To change the database connection options use the .env file to change the DB_URL variable.
