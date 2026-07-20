---
id: transforming-homelab-with-advanced-automation
title: Transforming my Homelab with Advanced Automation - The 3rd Iteration Journey
articleDate: 2023-12-31
articleContent: Dive into the latest version of my Homelab, featuring the integration of AI and advanced automation buzzing with high-end technology. Join me as I take you through my passion-filled journey of unending innovation in the realm of home servers automation.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - Homelab Automation
  - Technology
  - AI Integration
  - Home Servers
  - Tech Innovation
---

# Transforming my Homelab with Advanced Automation: The 3rd Iteration Journey

My third homelab iteration started with an old tower PC. Rather than retire it, I turned it into a Docker and VM host running unRAID OS. It now carries services I use every day, including Nextcloud, Bitwarden, VPN, AdGuard, Home Assistant, Overleaf, Portainer, Grafana, InfluxDB, Telegraf, and Z-Wave2MQTT.

This setup is less about running every service I can find and more about learning where self-hosting helps. A home server becomes interesting when storage, monitoring, automation, and access control have to work together.

## One Host, Many Services

unRAID gives me a practical split between Docker containers and virtual machines. Most services run as containers, while an Ubuntu VM gives me a separate place for Linux and AI experiments. The host is not especially powerful, so I currently keep that to one full VM instead of pretending it can handle an unlimited workload.

I also run Automatic1111 and ComfyUI. Both are useful for testing local AI workflows, but they make resource limits obvious. Running AI tooling beside storage, monitoring, and home automation services means paying attention to what is consuming CPU, memory, and disk I/O.

## Sensors, Metrics, and Network Boundaries

More than 50 mobile and stationary sensors feed data into my setup. Home Assistant handles automations, while InfluxDB stores measurements and Grafana makes them visible. That combination lets me track air quality, energy consumption, sleep patterns, and the state of devices around the house.

Not every device belongs on the main network. Some systems run on separate network media to keep regular traffic away from automation devices. Segmentation is not glamorous, but it makes troubleshooting easier and keeps an experimental service from becoming everyone else's network problem.

## Storage, Backups, and Recovery

The unRAID layout uses a cache drive, regular array storage, and parity. Cache improves latency for active workloads, while parity gives me room to replace failed disks without immediately losing data. It is not a substitute for backups, so I also run incremental backups both onsite and offsite.

I use local HTTPS encryption and an OpenVPN server for remote access. Those choices came from wanting access to my services without exposing every management interface directly to the internet.

## What I Automate

Home Assistant ties the stack together. Some automations are simple, such as lighting control. Others rely on sensor data, including air-quality monitoring, energy usage, and sleep tracking. The useful part is not the dashboard. It is having data and controls in one place, then being able to test a small change without buying another cloud subscription.

This homelab is still a workbench. The old tower PC, unRAID, Docker, Ubuntu VM, InfluxDB, Grafana, Home Assistant, and local AI tools all have limits. Finding those limits, then making tradeoffs around them, is why I keep iterating on it.
