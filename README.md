# Running

## Front end:

```
npm install
npm start
```

## Back end:

First make sure you have the postgrest-ws binaries.
There are no pre-built binaries for Mac, so you have to install from the [source repo](https://github.com/diogob/postgrest-ws)

Assuming that you can connect as superuser to a local PostgreSQL server using psql 
without any parameters:
```
psql < db/signup.sql
```

Then:

```
npm run postgrest
```
