---
id: the-evolution-of-my-homelab-journey-second-edition
title: The Evolution of My Homelab Journey - The Second Iteration
articleDate: 2020-12-31
articleContent: In this blog, I detail the journey of developing my second iteration of homelab, complete with autonomous servers, automation, and artificial intelligence technologies.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
tags:
  - Homelab
  - Automation
  - ServerTech
  - ArtificialIntelligence
---

## The Evolution of My Homelab Journey - The Second Iteration

My second homelab was where I learned that more hardware is not always better hardware. I moved on from a Raspberry Pi to a Dell PowerEdge R710 with 48 CPU cores and 64 GB of DDR3 RAM. It had far more capacity than I needed, which became clear every time it started. Its fans were loud enough to wake the neighbourhood, and it drew roughly 200 W while idle.

Still, it gave me room to learn what I could not learn on a small board.

### From ESXi to unRAID

I started with ESXi, moved to Ubuntu, then settled on unRAID OS. That progression was less about finding one perfect platform and more about working out how I wanted to operate the machine.

On unRAID, I ran Nextcloud, ownCloud, VPN services, and OpenHAB as Docker containers. Later, I used it as a VM platform too. Containers covered the always-on services, while VMs gave me isolation for experiments that needed their own operating system.

### GPU Passthrough Was Fun Until It Wasn't

The R710 also became my GPU passthrough project. I installed a GTX 970 using modified riser cards and soldered-in power supplies, then passed the card between different VMs. Getting that working took more effort than adding a PCIe card to a normal desktop, but it worked.

One power supply was dedicated to the GPU. A few months later it short-circuited and damaged both the server and the GTX 970. That failure changed how I think about homelab modifications. A setup can be technically possible and still be a bad idea if power delivery, cooling, and recovery have been treated as afterthoughts.

### First Home Automation Experiments

I kept going after that failure. WiFi sensors detected whether doors were open or closed, and I ran a local voice assistant that could answer a small set of predefined queries. I also wired up simple actuators, including an LED that blinked when a door remained open for too long.

Those projects were modest, but they taught me more than another dashboard would have. Sensors need reliable state changes. Automations need a way to fail safely. Hardware changes need a plan for what happens when something shorts, disconnects, or restarts.

### What I Took Forward

This iteration taught me to balance capacity with noise, power draw, and operational complexity. The Dell PowerEdge R710, ESXi, Ubuntu, unRAID, Docker, GPU passthrough, WiFi sensors, and local voice assistant each solved a different problem. Together, they also created plenty of new failure modes.

I still value the experiments that broke. They made the next homelab iteration more deliberate, especially around hardware limits, power, backups, and automation that has to keep working after I stop watching it.

[Version 3 is out. Read it here.](/blog/entry/2024-homelab-v2-transforming-homelab-with-advanced-automation)

- Tom Segbers
