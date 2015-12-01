#!/bin/sh

git add --all
git commit -am "new post"
git push origin master
shipit staging pm2:run --cmd "restart app"
