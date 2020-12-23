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

# TODO move this to a Module?
def self.blank_string?(str)
	return str.nil? || str.strip.empty?
end

def parse_video_url
	video_url = ARGV[0]
	if blank_string? video_url
		abort("Video URL missing!")
	end
	return video_url
end

parse_video_url
creds = SafariCredentials.new
