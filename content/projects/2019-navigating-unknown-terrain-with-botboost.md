---
id: navigating-unknown-terrain-with-botboost
title: "BotBoost: Autonomous TurtleBot Navigation with ROS"
articleDate: 2019-02-16
articleContent: I led a university team building autonomous navigation for a TurtleBot, benchmarking control algorithms and shipping a ROS/Python system that handled an unknown obstacle course.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Lead developer and project manager
outcome: Built a ROS-based TurtleBot navigation stack and benchmarked control algorithms for an unknown obstacle course.
links:
  - label: BotBoost on GitHub
    href: https://github.com/TomSeestern/BotBoost
tags:
  - Robotics
  - Artificial Intelligence
  - Autonomous Navigation
  - TurtleBot
  - Control Algorithms
technologies:
  - Python
  - ROS
  - Gitlab
  - Ubuntu
---

BotBoost was a university project built around autonomous navigation in an unknown obstacle course. As lead developer and project manager, I coordinated the team's work from algorithm selection through simulation tests and the final competition.

We used Python 3.8 and ROS to connect the control program with TurtleBot hardware. LIDAR and GPS data supplied the inputs for real-time navigation, while GitLab and Ubuntu gave us a shared development and test environment. Keeping the sensor integration, control logic, and simulation work separate made it possible to compare approaches without rebuilding the whole system each time.

A* was one of several control algorithms we implemented and benchmarked. The final robot used a Bug v2 wall-following strategy, with front and side sensor thresholds tuned for the course. We evaluated the options in simulated trials before using them in the competition, focusing on how well each approach handled obstacles, route choice, and response time. This was not a case of picking an algorithm because it was well known. We used the benchmark results to decide what belonged in the final control program.

The project was an early lesson in systems thinking. Pathfinding on its own is not enough: sensor quality, real-time control, and how the team tests changes determine whether the robot actually reaches its destination. Leading the project also taught me to make roles and test criteria explicit when people bring different levels of robotics experience.

## What I took from it

If I revisited this project today, I would formalise benchmark scenarios and capture more telemetry from each run. The core experience remains valuable because it connected AI concepts, robotics hardware, and collaborative delivery under a fixed deadline.
