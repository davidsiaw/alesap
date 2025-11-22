#!/bin/ruby

require 'json'
require 'net/http'
require 'uri'

# ARGV[0] = qr code
# ARGV[1] = user input

# parse qr code
akey, skey, scd = ARGV[0].split('/')[2].split(',')
# parse input type
type, ecd = [0, "4778B35"]
case ARGV[1].strip
when "stop" then
  type = 2
when "flat" then
  type = 3
when "sharp" then
  type = 4
else
  ecd = ARGV[1].strip
end

# set http request parameters
uri = URI("http://order.mashup.jp/bridge/post_request.php")
body = {
  type: type,
  ecd: ecd,
  akey: akey,
  skey: skey,
  scd: scd
}

# send http request
response = Net::HTTP.post(uri, URI.encode_www_form(body))
puts response.body
