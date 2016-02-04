class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user
  helper_method :signed_in?

  def current_user
  	session[:userinfo]
  end


  protected
  	def current_user
  		session[:userinfo]
  	end

  	 def signed_in?
	  	current_user.present?
	  end
end
