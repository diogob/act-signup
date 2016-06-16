# Running

## Front end:

```
npm install
npm start
```

## Back end:

On psql:

```
create database DB;
\c DB
\i signup.sql
```

Then:

```
postgrest postgres://USER:PASS@localhost:5432/DB --schema public -j "hahaha" -a USER
```
