class SafariCredentials
	attr_accessor :username, :password

	def initialize
		@username = SafariCredentials.parse_username
		@password = SafariCredentials.parse_password
	end

	def self.parse_username
		safari_username = ENV["HERMES_USERNAME"]
		if blank_string? safari_username
			abort("Safari username missing!")
		end
		return safari_username
	end

	def self.parse_password
		safari_password = ENV["HERMES_PASSWORD"]
		if blank_string? safari_password
			abort("Safari password missing!")
		end
		return safari_password
	end

	def self.blank_string?(str)
		return str.nil? || str.strip.empty?
	end
end

creds = SafariCredentials.new
puts "#{creds.username}:#{creds.password}"
