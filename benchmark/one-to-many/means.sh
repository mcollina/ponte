#! /bin/bash

set -x

./mean.R mqtt/mean 'MQTT-to-MQTT' mqtt/res*
./mean.R mosquitto/mean 'MQTT-to-MQTT' mosquitto/res*
./mean.R coap-to-mqtt/mean 'CoAP-to-MQTT' coap-to-mqtt/res*
./mean.R http-to-mqtt/mean 'HTTP-to-MQTT' http-to-mqtt/res*
./mean.R coap/mean 'CoAP-to-CoAP' coap/res*
./mean.R mqtt-to-coap/mean 'MQTT-to-CoAP' mqtt-to-coap/res*
./mean.R http-to-coap/mean 'HTTP-to-CoAP' http-to-coap/res*
