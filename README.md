# Running

## Front end:

```
npm install
npm start
```

## Back end:

First make sure you have the postgrest binaries, on a Mac you can use:
```
brew install postgrest
```

Assuming that you can connect as superuser to a local PostgreSQL server using psql 
without any parameters:
```
psql < db/signup.sql
```

Then:

```
npm run postgrest
```
