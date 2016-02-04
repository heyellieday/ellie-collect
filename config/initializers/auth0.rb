Rails.application.config.middleware.use OmniAuth::Builder do
  provider(
    :auth0,
    'osTGCjCkwfkmGYJ7ytTuII4YazIlsFNf',
    ENV['auth0_secret'],
    'ellie.auth0.com',
    callback_path: "/auth/auth0/callback"
  )
end