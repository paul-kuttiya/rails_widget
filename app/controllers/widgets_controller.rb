class WidgetsController < ApplicationController
  protect_from_forgery except: :flight
  layout false
  def flight
    respond_to do |format|
      format.html
      format.js { redirect_to root_path }
    end
  end
end