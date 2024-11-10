Rails.application.routes.draw do
  use_doorkeeper
  get "health/check"
  get '/health', to: 'health#check'
  get "up" => "rails/health#show", as: :rails_health_check
  
  # Defines the root path route ("/")
  # root "posts#index"

  devise_for :users, controllers: { 
    sessions: 'users/sessions', 
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    confirmations: 'users/confirmations'
  }

  devise_for :coaches, controllers: {
    sessions: 'coaches/sessions',
    registrations: 'coaches/registrations',
    passwords: 'coaches/passwords',
    confirmations: 'coaches/confirmations'
  }

  # Users
  resources :users, only: [:index]

  namespace :users do
    resources :user_outcome_measures, only: [:index, :show, :create, :update, :destroy] do
      resources :user_outcome_measure_recordings
    end

    resources :user_programs do
      resources :user_program_workouts do
        resources :user_program_workout_exercises
      end
    end

  end

  # Coaches
  resources :coaches, only: [:index]

  namespace :coaches do

    # Coaches have access to users and their outcome measures/programs
    resources :users, only: [:index, :show, :update] do
      resources :user_outcome_measures do
        resources :user_outcome_measure_recordings
      end

      resources :user_programs do
        resources :user_program_workouts do
          resources :user_program_workout_exercises
        end
      end
    end

    resource :account, only: [:show, :update, :destroy]

    resources :programs do
      resources :program_workouts do
        resources :program_workout_exercises
      end
    end
  end

  # Exercises
  resources :exercises do
    resources :exercise_images
  end

  # Outcome Measures
  resources :outcome_measures
end
