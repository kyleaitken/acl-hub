# acl-hub

# Ruby/Rails install

https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-macos

# install postgresql

https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-ruby-on-rails-application-on-macos

`brew install postgresql`


# Helpful Docker commands:

docker compose up -d : start all containers in background
docker compose up --build api -d : build only api container
docker compose down : stop containers
docker compose exec api bin/rails routes : check routes 
docker compose exec api bin/rails db:schema:dump    : make sure schema matches what's in DB
docker compose exec api bin/rails generate migration
docker compose exec api bin/rails db:migrate:status 
docker compose exec api bin/rails console 

## make model/controller:
docker compose exec api bin/rails generate model <modelName> field1:type field2:type 
docker compose exec api bin/rails generate controller <model>s

docker compose restart api/frontend
docker compose logs api/frontend
docker compose exec db psql -U aclhub -d api_development  : log into db console, can then run "\d users" for example
docker compose exec db psql -U aclhub -d api_development -c '\dt' : check data tables in db

rails generate controller <controllername>
rails db:migrate

If developing frontend, can switch viteconfig proxy to localhost:3000 and just run npm run dev to not run the frontend in the container. You 
would still run the api/db in a container, but access it thru local host, not from container networking

# Frontend/Api Prod Docker Container:
- Build: docker build --no-cache -t frontend .
- Run: docker run -p 8080:80 frontend

# API Prod Docker Container:
- Build: docker build --no-cache -t api-test .
- Run: docker run -p 3000:3000 api


# Building Locally
- Use docker compose 
- should launch the containers + local database on localhosts 
- RUN IN APP DIRECTORY: docker compose up --build
- access frontend app at localhost:5173 and api at localhost:3000


# Building for Prod
- run deploy.sh script which, build/tag/pushes the docker containers 

