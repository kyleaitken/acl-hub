namespace :db do
    desc "Run psql command to connect to dev database"
    task :dev do
      sh "psql -U aclhub -d api_development"
    end
  end

namespace :db do
    desc "Connect to test database"
    task :test do
      sh "psql -U aclhub -d api_test"
    end
  end