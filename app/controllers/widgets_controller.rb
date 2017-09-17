class WidgetsController < ApplicationController
  protect_from_forgery except: :flight
  layout false
  layout 'application', except: :flight

  def index
  end

  def create
    # binding.pry
    # Record.create(
    #   to: params[:flightParams]["to"], from: params[:flightParams]["from"],
    #   depart: params[:flightParams]["depart"],
    #   return: params[:flightParams]["return"],
    #   adult: params[:flightParams]["adult"],
    #   children: params[:flightParams]["children"]
    #   )
    redirect_to root_path
  end
end