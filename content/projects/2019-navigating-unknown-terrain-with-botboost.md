---
id: navigating-unknown-terrain-with-botboost
title: "BotBoost: Autonomous TurtleBot Navigation with A* and ROS"
articleDate: 2019-02-16
articleContent: Led a university project team building autonomous navigation for a TurtleBot with ROS, Python, LIDAR, GPS, and the A* pathfinding algorithm.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
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

BotBoost was a university project built around autonomous navigation in an unknown obstacle course. As lead developer and project manager, I coordinated the team’s work from algorithm selection through simulation tests and the final competition.

We used Python 3.8 and ROS to connect the control program with TurtleBot hardware. LIDAR and GPS data supplied the inputs for real-time navigation, while GitLab and Ubuntu gave us a shared development and test environment. Keeping the sensor integration, control logic, and simulation work separate made it possible to compare approaches without rebuilding the whole system each time.

A\* was one of several control algorithms we implemented and benchmarked. We evaluated algorithms in simulated trials before using them in the competition, focusing on how well each approach handled obstacles, route choice, and response time. This was not a case of picking an algorithm because it was well known. We used the benchmark results to decide what belonged in the final control program.

The project was an early lesson in systems thinking. Pathfinding on its own is not enough: sensor quality, real-time control, and how the team tests changes determine whether the robot actually reaches its destination. Leading the project also taught me to make roles and test criteria explicit when people bring different levels of robotics experience.

If I revisited this project today, I would formalize benchmark scenarios and capture more telemetry from each run. The core experience remains valuable because it connected AI concepts, robotics hardware, and collaborative delivery under a fixed deadline.
