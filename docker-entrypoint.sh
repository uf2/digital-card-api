#!/bin/sh
set -e

./node_modules/.bin/prisma migrate deploy
node dist/database/seed/main.js
exec node dist/main.js
