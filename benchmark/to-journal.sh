#! /bin/bash

pushd many-to-one
./plots.sh
cp to-coap.pdf ~/Repositories/iot_journal_interoperability/results/many-to-one-to-coap.pdf
cp to-mqtt.pdf ~/Repositories/iot_journal_interoperability/results/many-to-one-to-mqtt.pdf
popd

pushd one-to-many
./plots.sh
cp to-coap.pdf ~/Repositories/iot_journal_interoperability/results/one-to-many-coap.pdf
cp to-mqtt.pdf ~/Repositories/iot_journal_interoperability/results/one-to-many-mqtt.pdf
popd
