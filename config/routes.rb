Rails.application.routes.draw do
  root to: "widgets#flight"

  resources :widgets, only: :index do
    collection do
      get :flight
    end
  end
end
