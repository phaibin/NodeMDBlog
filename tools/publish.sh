#!/bin/sh

git add .
git commit -am "new post"
git push origin master
git push deploy master
