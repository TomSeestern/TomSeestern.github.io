---
id: insights-assembly-language-and-microcontroller-projects
title: Diving Deep into Microcontrollers - My Assembly Language Projects
articleDate: 2017-12-30
articleContent: I built two AT89C5131A microcontroller projects in Assembly, controlling a DC motor with PWM and driving an LCD over serial.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Student developer
outcome: Built and debugged AT89C5131A motor-control and LCD projects in Assembly.
links:
  - label: Motor control repository
    href: https://github.com/TomSeestern/AT89C5131A_Gleichstrommotor
  - label: LCD display repository
    href: https://github.com/TomSeestern/LCD-Display
tags:
  - AssemblyLanguage
  - Microcontrollers
  - ITeducation
  - Robotics
technologies:
  - Atmel
  - Assembly
---

Between 2016 and 2019, I worked on school projects with AT89C5131A microcontrollers and Assembly. We built two separate programs: one controlled a Gleichstrommotor with pulse-width modulation, another sent dynamic text to an LCD through serial communication.

Assembly was unforgiving compared with C++ or SQF. A small mistake could mean nothing happened, and understanding microcontroller behaviour meant working through code, wiring, and hardware setup together. I did not get it immediately. Debugging forced me to slow down and account for what every instruction and connection did. A wrong register value, a missing delay, or a loose wire all looked like the same failure from the outside.

I worked with classmates, sharing observations when motor control or LCD output did not behave as expected. We planned, wrote, and debugged Assembly, assembled the hardware, and tested the real setup rather than stopping at code that looked plausible. The PWM project taught me how timing changes physical behaviour. The LCD project taught me how much work sits behind a simple display update.

The repositories are small, but they are honest snapshots of the work. They show the code and the hardware assumptions without pretending that a school project was a production system.

## What I took from it

These projects gave me a clearer view of the boundary between software and electronics. Controlling a motor and an LCD through an AT89C5131A made low-level code feel concrete, and strengthened my interest in robotics.
