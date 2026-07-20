---
id: ai-drone-based-change-detection
title: "ISeeUNet: Real-Time Drone Change Detection in Scrubland"
articleDate: 2021-03-30
articleContent: For my bachelor thesis, I built ISeeUNet, a modified U-Net trained on hybrid real and synthetic datasets for real-time change detection on Nvidia Jetson NX hardware.
authorName: Tom Segbers
authorImgSrc: https://placehold.co/512x512.png?text=Tom
tags:
  - Artificial Intelligence
  - Drone Technology
  - Change Detection
  - Synthetic Datasets
  - Real-Time Analysis
technologies:
  - Python
  - Keras
  - TensorFlow
  - Unity
  - OpenCV
---

ISeeUNet was my six-month bachelor thesis on real-time change detection for drone footage in scrubland environments. The core research problem was a data problem as much as a model problem: public training datasets did not cover the conditions needed for reliable detection from a moving drone.

I created a hybrid dataset from HD source material and synthetic scenes generated with Unity and Real Virtuality 4. Synthetic data let me control scene composition, object movement, and lighting conditions that would have been expensive or unsafe to capture repeatedly in the field. I used Python, Keras, TensorFlow, and OpenCV for the training and evaluation workflow.

The model was a modified U-Net architecture, chosen because pixel-level change detection needs spatial detail, not only an image-level label. I evaluated architecture and dataset choices against the conflicting constraints of detection quality and runtime cost. The final system was designed to identify small movements, tolerate changing light, and operate during omnidirectional flight.

Deployment mattered from the beginning. I targeted an Nvidia Jetson NX rather than treating inference hardware as an afterthought. That forced tradeoffs between model size, input processing, and real-time performance. Working with RWU and HATtec GmbH gave the thesis access to domain feedback and a more realistic benchmark for the work.

The result was a real-time change-detection model that ran effectively on Jetson NX hardware and performed well on standard benchmarks. If I continued the project, I would expand field validation, measure failure modes by weather and terrain type, and formalize the synthetic-to-real transfer evaluation. The thesis taught me to treat datasets, model architecture, and deployment hardware as one system rather than separate phases.
