#! /bin/sh

sysctl -w net.core.rmem_default=536870912
sysctl -w net.core.wmem_default=536870912
sysctl -w net.core.rmem_max=536870912
sysctl -w net.core.wmem_max=536870912
sysctl -w net.core.netdev_max_backlog=100000
sysctl -w net.ipv4.udp_rmem_min=52428800
sysctl -w net.ipv4.udp_wmem_min=52428800
ulimit -n 100000
