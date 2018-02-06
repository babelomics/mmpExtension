# MMP-Extension

MongoDB, Express, and NodeJS app. Using Swagger for Docs Api.

# Without Docker

Firstable you need Nodejs and MongoDB installed.

After that you should follow next steps:

1. git clone https://github.com/babelomics/mmpExtension
2. Install and init server.
3. cd mmpExtension/server
4. npm install
5. npm server
6. You should see at localhost:3000 our swagger docs now.

# With Docker

Firstable you need Docker and docker-compose installed and MongoDB installed.
You can follow this links to install https://www.digitalocean.com/community/tutorials/como-instalar-y-usar-docker-en-ubuntu-16-04-es and https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04

After you have installed both:

1. git clone https://github.com/babelomics/mmpExtension
2. cd mmpExtension/server
3. docker-compose up
4. You should see at localhost:3000 our swagger docs now.

# Backup and Restore Database

Ref: (https://www.digitalocean.com/community/tutorials/how-to-back-up-restore-and-migrate-a-mongodb-database-on-ubuntu-14-04)

mongodump --db MMP-Extension --out /var/backups/mongobackups/`date +"%m-%d-%y"`
mongorestore --db MMP-Extension-2 --drop /var/backups/mongobackups/01-29-18/MMP-Extension/

# Developers

Alexis Martínez Chacón (alexis.martinez@juntadeandalucia.es)
