\echo 'Delete and recreate fish-file db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE fishfile;
CREATE DATABASE fishfile;
\connect fishfile

\i fishfile-schema.sql
\i fishfile-seed.sql

\echo 'Delete and recreate fishfile_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE fishfile_test;
CREATE DATABASE fishfile_test;
\connect fishfile_test

\i fishfile-schema.sql