Rails.application.routes.draw do
  use_doorkeeper
  get "health/check"
  get '/health', to: 'health#check'
  get "up" => "rails/health#show", as: :rails_health_check
  
  # Defines the root path route ("/")
  # root "posts#index"

  devise_for :clients, controllers: { 
    sessions: 'client/sessions', 
    registrations: 'clients/registrations',
    passwords: 'clients/passwords',
    confirmations: 'clients/confirmations'
  }

  devise_for :coaches, controllers: {
    sessions: 'coaches/sessions',
    registrations: 'coaches/registrations',
    passwords: 'coaches/passwords',
    confirmations: 'coaches/confirmations'
  }

  # clients
  resources :clients, only: [:index]

  namespace :clients do
    resources :client_outcome_measures, only: [:index, :show, :create, :update, :destroy] do
      resources :client_outcome_measure_recordings
    end

    resources :client_programs do
      resources :client_program_workouts do
        resources :workout_comments
        resources :client_program_workout_exercises
      end
    end

  end

  # Coaches
  resources :coaches, only: [:index, :destroy]

  namespace :coaches do
    # Coaches have access to clients and their outcome measures/programs
    resources :clients, only: [:index, :show, :update] do
      collection do
        get 'detailed', to: 'clients#detailed_index'
        get 'todayWorkouts', to: 'clients#all_client_workouts_today_index'
        get 'updates', to: 'clients#all_client_updates'
      end

      resources :client_outcome_measures do
        resources :client_outcome_measure_recordings
      end

      resources :client_programs do
        resources :client_program_workouts do
          resources :workout_comments
          resources :client_program_workout_exercises
        end
      end
    end

    resource :account, only: [:show, :update, :destroy]
    resources :tags, only: [:index, :create, :update, :destroy]
    resources :warmups
    resources :cooldowns

    resources :programs do
      member do
        post 'add_tag/:tag_id', to: 'programs#add_tag'
        delete 'remove_tag/:tag_id', to: 'programs#remove_tag'
        patch 'update_positions', to: 'programs#update_positions'
      end
      resources :program_workouts do
        collection do
          delete :destroy_multiple
        end
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
