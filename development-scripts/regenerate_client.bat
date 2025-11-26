@echo off
pushd "%~dp0.."
set "DATABASE_URL=file:./prisma/dev.db"
npx prisma db push
npx prisma generate
popd
