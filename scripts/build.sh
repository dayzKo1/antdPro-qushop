#!/bin/sh

image=${CI_PROJECT_NAME-"qushop"}

echo $image
if [ $# -gt 1 ] ; then
docker build -t $image:$1 -t  $image:latest  .
else
docker build -t  $image:latest  .
fi
