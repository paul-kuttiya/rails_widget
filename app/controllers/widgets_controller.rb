class WidgetsController < ApplicationController
  protect_from_forgery except: :flight
  # layout false
  # layout 'application', except: :flight

  def index
  end

  def create
    # Record.create(params)
    redirect_to root_path
  end
end