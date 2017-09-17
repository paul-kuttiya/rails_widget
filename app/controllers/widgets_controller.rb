class WidgetsController < ApplicationController
  protect_from_forgery except: :flight
  layout false
  layout 'application', except: :flight
end