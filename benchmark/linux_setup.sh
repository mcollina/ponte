#! /bin/sh

sysctl -w net.core.rmem_default=536870912
sysctl -w net.core.wmem_default=536870912
sysctl -w net.core.rmem_max=536870912
sysctl -w net.core.wmem_max=536870912
sysctl -w net.core.netdev_max_backlog=100000
sysctl -w net.ipv4.udp_rmem_min=52428800
sysctl -w net.ipv4.udp_wmem_min=52428800
sysctl -w 'net.ipv4.ip_local_port_range=18000    65535'
sysctl -w 'net.ipv4.tcp_rmem=4096 16384 33554432'
sysctl -w 'net.ipv4.tcp_wmem= 4096 16384 33554432'
sysctl -w 'net.ipv4.tcp_mem= 786432 1048576 26777216'
sysctl -w 'net.ipv4.tcp_max_tw_buckets= 360000'
sysctl -w net.ipv4.tcp_max_syn_backlog=10000
sysctl -w 'vm.min_free_kbytes= 65536'
sysctl -w 'vm.swappiness= 0'
sysctl -w 'net.ipv4.route.flush=1'
sysctl -w 'net.core.somaxconn=100000'
