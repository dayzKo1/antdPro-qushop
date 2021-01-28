#!/bin/sh


image=${CI_PROJECT_NAME-"qushop"}
pwd=${HARBOR_REGISTRY_PASSWORD}
# docker login registry.internal.codefriend.top
docker login --username=yanghui -p $pwd registry.internal.codefriend.top
docker tag $image:latest registry.internal.codefriend.top/qushop-136/$image:latest
docker push registry.internal.codefriend.top/qushop-136/$image:latest


if [ $# -gt 0 ] ; then
  tag=$1
  docker tag $image:latest registry.internal.codefriend.top/qushop-136/$image:${tag}
  docker push registry.internal.codefriend.top/qushop-136/$image:${tag}
fi
