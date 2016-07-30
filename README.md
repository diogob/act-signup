# Act signup with event recorder

## Requirements

 * Node.js and npm
 * PostgreSQL 9.4+
 * stack (only if you need to compile the backend binaries)

## Installing dependencies

### Backend binaries

First make sure you have the postgrest-ws and act-recorder binaries.
There are no pre-built binaries for Mac, so you have to install from the 
[posgrest-ws repo](https://github.com/diogob/postgrest-ws) and
[act-recorder repo](https://github.com/diogob/act-recorder).

Inside each project source repo run the command:
```
stack install
```

If the above command fail for the lack of a haskell compiler try running `stack setup` before.

After the installation the binaries will be placed in `$HOME/.local/bin/`.
To run this binaries you will need to add this directory to your path,
add to your `.bashrc`:

```
export PATH=$HOME/.local/bin/:$PATH
```

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

### Node Foreman to run everything

```
npm install -g foreman
```

## Running

```
nf start
```

To change the database connection options use the .env file to change the DB_URL variable.
