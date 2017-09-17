class WidgetsController < ApplicationController
  protect_from_forgery except: :flight
  layout false
  layout 'application', except: :flight

  def create
    binding.pry
  end
end