Rails.application.routes.draw do
  get "health/check"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end

Rails.application.routes.draw do
  get '/health', to: 'health#check'
end

Rails.application.routes.draw do
  resources :users
end

Rails.application.routes.draw do
  resources :coaches
end

Rails.application.routes.draw do
  resources :programs
end

Rails.application.routes.draw do
  resources :program_workouts
end

Rails.application.routes.draw do
  resources :program_workout_exercises
end

Rails.application.routes.draw do
  resources :exercises
end

Rails.application.routes.draw do
  resources :exercise_images
end