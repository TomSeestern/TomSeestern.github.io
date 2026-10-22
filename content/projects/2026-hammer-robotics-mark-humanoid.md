---
id: hammer-robotics-mark-humanoid
title: "Hammer Robotics: Building Mark I for Airport Baggage Handling"
articleDate: 2026-10-22
articleContent: I founded Hammer Robotics to automate heavy logistics work with embodied AI. Our Mark humanoid prototype targets airport baggage handling and is preparing pilots with three major German airports.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
featured: true
recentHighlight: true
role: Founder and CEO
outcome: Built a functional humanoid prototype for autonomous baggage handling in six months and prepared pilots with three major German airports.
metrics:
  - label: Prototype
    value: 6 months
  - label: Pilot preparation
    value: 3 German airports
  - label: Non-dilutive funding
    value: €300k
  - label: Awards
    value: €25k
heroImage: /img/projects/hammer-mark-i.jpg
links:
  - label: Hammer Robotics
    href: https://hammer-robotics.de
tags:
  - Robotics
  - Embodied AI
  - Logistics
  - Startup
technologies:
  - Python
  - ROS2
  - Isaac Sim
  - Computer Vision
  - AI
  - Hardware
---

The demo is easy to make impressive. The product has to be dependable when the room is not set up for a video.

## The problem

Hammer Robotics is a Munich-based company building robots for work that is difficult to staff and physically demanding. I founded the company in 2024 and lead it as CEO. Our first product, Mark I, is an AI-driven humanoid robot aimed at high-load logistics automation, starting with baggage handling at airports.

The problem is concrete. Baggage handling has a chronic labour shortage, and the work is repetitive, physically punishing, and safety-critical. An airport cannot solve that with another dashboard. It needs a machine that can perceive a cluttered environment, decide what to grasp, and move a heavy bag without creating a new risk for the people working nearby.

## The build

We built a fully functional prototype for autonomous baggage unloading within six months. The team was three engineers, which forced us to keep the architecture focused: perception, planning, and control had to be testable independently, and the hardware had to be robust enough to survive repeated iteration. We used Python, ROS 2, Isaac Sim, computer vision, and custom hardware, then moved between simulation and real-world tests to shorten the loop between a software change and a physical result.

The hard part was not making the robot move once. It was building a system that could explain why it failed. If a grasp missed, we needed to know whether the perception stack had mislocated the bag, the planner had chosen an unreachable pose, or the hardware had not delivered the commanded force. That separation between perception, planning, and control is what makes the prototype useful as a platform rather than a one-off demo.

That work led to pilot preparation with three major German airports. It also helped us secure €300k in non-dilutive grants and €25k in awards, and attracted three term sheets from top-tier VCs and industry experts. Those signals matter, but the engineering milestone matters more: a robot that can do a useful piece of the job in a real environment.

## The result

Hammer Robotics has a functional Mark I prototype, pilot preparation with three German airports, non-dilutive funding, and a team building toward deployment. The company is also hiring founding engineers to turn the prototype into a dependable product.

## What I took from it

Hammer Robotics is a homecoming to the robotics work I started as a student. It combines the parts of my background that fit together best: AI models, real-time systems, hardware constraints, and a product problem that is easy to explain and hard to solve.

The next phase is about turning a prototype into a dependable system: broader field validation, safety cases, maintainability, and a team that can support customers after the demo. That is the part I find most interesting. A humanoid robot is only impressive if it keeps working when the room is not set up for a video.
