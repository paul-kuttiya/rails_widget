Rails.application.routes.draw do
  namespace :embed do
   resources :pages, only: :show
  end
end
