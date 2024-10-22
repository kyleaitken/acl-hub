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
docker compose restart api/frontend
docker compose logs api/frontend
docker compose exec db psql -U aclhub -d api_development  : log into db console, can then run "\d users" for example
docker compose exec db psql -U aclhub -d api_development -c '\dt' : check data tables in db

rails generate controller <controllername>
rails db:migrate
