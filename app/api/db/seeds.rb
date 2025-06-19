coach = Coach.find_or_create_by!(email: "dev@example.com") do |u|
  u.password = "password"
  u.first_name = "Dev"
  u.last_name = "User"
end

app = Doorkeeper::Application.find_or_create_by!(name: "DevClient") do |a|
  a.redirect_uri = ""
  a.scopes = "coach"
end

token = Doorkeeper::AccessToken.find_or_create_by!(
  application_id: app.id,
  resource_owner_id: coach.id,
  resource_owner_type: "Coach",
  scopes: "coach"
) do |t|
  t.token = SecureRandom.hex(32)
  t.expires_in = 10.years.to_i
end

puts "Token: #{token.token}"