Rails.application.routes.draw do
  get "health/check"
  get '/health', to: 'health#check'
  get "up" => "rails/health#show", as: :rails_health_check
  
  # Defines the root path route ("/")
  # root "posts#index"

  # Users
  resources :users 

  # Coaches
  resources :coaches do
    resources :users, only: [:index] # Scope users to coaches

    resources :programs do
      resources :program_workouts do
        resources :program_workout_exercises
      end
    end
  end

  resources :exercises do
    resources :exercise_images
  end
end
