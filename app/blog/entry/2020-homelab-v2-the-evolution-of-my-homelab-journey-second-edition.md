---
id: the-evolution-of-my-homelab-journey-second-edition
title: The Evolution of My Homelab Journey - The Second Iteration
articleDate: 2020-12-31
articleContent: In this blog, I detail the journey of developing my second iteration of homelab, complete with autonomous servers, automation, and artificial intelligence technologies.
authorName: Tom Segbers
authorImgSrc: https://placehold.co/512x512.png?text=Tom
tags:
  - Homelab
  - Automation
  - ServerTech
  - ArtificialIntelligence
---

## The Evolution of My Homelab Journey - The Second Iteration

Hello everyone! I am excited to share with you another story from my homelab journey — the transformation of my second
iteration home servers and automation.

### Upgrade to Dell PowerEdge R710

Considering the growing need for increased processing power and storage, I decided to upgrade my second homelab. I moved
from a basic Raspberry Pi to a Dell PowerEdge R710 with a whopping 48 cores CPU and 64GB of DDR3 RAM. Initially, I was
thrilled with the increased capacity, but soon realized it might be overkill. The startup fan noise alone could wake up
the neighborhood! Not to mention it consumed 200W power in full idle.

### Running Docker and VMs

Despite the power drama, the server performance was impressive. Initially, I ran ESXi, shifted to Ubuntu, and finally
landed on unRAID OS. Remarkably, it housed multiple services like Nextcloud, ownCloud, VPN, Openhab, all running as
Docker containers on the hosts.

Further, I converted the host into a VM platform to launch multiple VMs with GPU passthrough. Yes, you read that
correct — GPU passthrough! I added an extra GTX 970 to the server using modified riser cards and soldered-in power
supplies.

### Risk of Over-modding

One of the power supplies was solely dedicated to powering the GPU — it was even possible to pass GPU between different
VMs. Despite some initial fumbles, the setup worked efficiently. However, all good things come at a cost. Unfortunately,
a few months in, one of the power supplies short-circuited, leading to extensive damage to both the server and the GPU.

### Integration of AI Enabled Systems

Undeterred by setbacks, I stubbornly continued to implement new features. With my upgraded server, I was able to
integrate various WiFi sensors that detected if doors were open or closed and a locally-running voice assistant capable
of answering simple, predefined queries. Finally, I set up actuators like an LED that would blink if a door was left
open for too long.

### Lessons Learnt & The Way Forward

My second homelab venture brought a plethora of learnings. It's essential to strike a balance between ambition and
practicality — while ambitious projects can lead to remarkable discoveries, overdoing it can result in catastrophic
failures.

As I venture forward in my journey, I am more determined to build more resilient, powerful, and user-friendly homelabs.
I'll continue to share my experiences, tips, mistakes, and successes with you all. In the next update, I pledge to share
more about my next endeavor toward sustainable and scalable home labs. So, stay tuned!

That's all for my second iteration of homelab. I bid you farewell, until next time!

** Remember — adventures are the best way to learn. **

The journey continues with the third iteration of my homelab. Stay tuned!
[Version 3 is out! - Click here!](/blog/entry/2024-homelab-v2-transforming-homelab-with-advanced-automation)

- Tom Segbers
