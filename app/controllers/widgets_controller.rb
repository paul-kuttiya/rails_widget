class WidgetsController < ApplicationController
  protect_from_forgery except: :flight
  layout false
  def flight
    @dianosaur = "Dino"
  end
end