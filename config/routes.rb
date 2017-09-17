Rails.application.routes.draw do
  root to: "widgets#index"

  resources :widgets, only: :index do
    collection do
      get :flight
    end
  end

  resources :widgets, only: :create  
end
