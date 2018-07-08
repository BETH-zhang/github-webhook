#!/bin/sh
# cd /var/www/project/jijiangshe
# git checkout master
# git pull origin master

# 停止对应docker
# docker stop 87d5eafe40a4

# docker run -d -p 80:8888 7e749fbde3ed 

WEB_PATH='/var/www/project/'$1
WEB_USER='root'
WEB_USERGROUP='root'

echo "Start deployment"
cd $WEB_PATH
echo "pulling source code..."
git reset --hard origin/master
git clean -f
git pull
git checkout master
echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
echo "Finished."

# docker部署
docker build -t $1 .
docker stop $1
docker rm $1
docker run -d --name=$1 -p $2:$2 $1:latest
