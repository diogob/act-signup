CREATE DATABASE signup;
\c signup

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- We put things inside the auth schema to hide
-- them from public view. Certain public procs/views will
-- refer to helpers and tables inside.
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS
auth.users (
  email    text primary key check ( email ~* '^.+@.+\..+$' ),
  pass     text not null check (length(pass) < 512),
  role     name not null check (length(role) < 512),
  verified boolean not null default false
  -- If you like add more columns, or a json column
);

CREATE OR REPLACE FUNCTION
auth.check_role_exists() RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles AS r WHERE r.rolname = new.role) THEN
    RAISE foreign_key_violation USING message =
      'unknown database role: ' || new.role;
    RETURN NULL;
  END IF;
  RETURN new;
END
$$;

DROP TRIGGER IF EXISTS ensure_user_role_exists ON auth.users;
CREATE CONSTRAINT TRIGGER ensure_user_role_exists
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE auth.check_role_exists();

CREATE OR REPLACE FUNCTION
auth.encrypt_pass() RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  IF tg_op = 'INSERT' OR new.pass <> old.pass THEN
    new.pass = crypt(new.pass, gen_salt('bf'));
  END IF;
  RETURN new;
END
$$;

DROP TRIGGER IF EXISTS encrypt_pass ON auth.users;
CREATE TRIGGER encrypt_pass
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE auth.encrypt_pass();

CREATE OR REPLACE FUNCTION
auth.user_role(email text, pass text) RETURNS name
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
  SELECT role FROM auth.users
  WHERE users.email = user_role.email
  AND users.pass = crypt(user_role.pass, users.pass)
  );
END;
$$;

DROP TYPE IF EXISTS auth.jwt_claims CASCADE;
CREATE TYPE auth.jwt_claims AS (role text, email text);

CREATE OR REPLACE FUNCTION
public.login(email text, pass text)
RETURNS auth.jwt_claims
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
_role name;
result auth.jwt_claims;
BEGIN
  SELECT auth.user_role(email, pass) INTO _role;
  IF _role IS NULL THEN
    RAISE invalid_password USING message = 'invalid user or password';
  END IF;
  SELECT _role AS role, login.email AS email INTO result;
  RETURN result;
END;
$$;

CREATE USER postgrest PASSWORD 'development_password' NOINHERIT;
CREATE ROLE anonymous;
GRANT anonymous TO postgrest;
GRANT EXECUTE ON FUNCTION public.login(text, text) TO anonymous;
