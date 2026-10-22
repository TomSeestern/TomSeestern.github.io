---
id: ai-drone-based-change-detection
title: "ISeeUNet: Real-Time Drone Change Detection in Scrubland"
articleDate: 2021-03-30
articleContent: For my bachelor thesis, I built ISeeUNet, a modified U-Net trained on hybrid real and synthetic datasets for real-time change detection on Nvidia Jetson NX hardware.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
featured: true
role: Bachelor thesis author
outcome: Built and evaluated ISeeUNet, a real-time change-detection model that runs on Nvidia Jetson NX hardware.
metrics:
  - label: Thesis grade
    value: "1.0"
  - label: Training
    value: ~12 GPU-months
  - label: Inference
    value: Nvidia Jetson NX
heroImage: /img/projects/iseeu-net-change-detection.jpg
links:
  - label: ISEEU-Net on GitHub
    href: https://github.com/TomSeestern/ISEEU-Net
  - label: Bachelor thesis PDF
    href: https://github.com/TomSeestern/ISEEU-Net/blob/master/doc/Detecting_Change_in_Scrubland_Enviroment.pdf
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

I created a hybrid dataset from HD source material and synthetic scenes generated with Unity and Real Virtuality 4. Synthetic data let me control scene composition, object movement, and lighting conditions that would have been expensive or unsafe to capture repeatedly in the field. I used Python, Keras, TensorFlow, and OpenCV for the training and evaluation workflow, and trained the model on 1080 GPUs for roughly 12 GPU-months.

The model was a modified U-Net architecture, chosen because pixel-level change detection needs spatial detail, not only an image-level label. I evaluated architecture and dataset choices against the conflicting constraints of detection quality and runtime cost. The final system was designed to identify small movements, tolerate changing light, and operate during omnidirectional flight. It also had to cope with camera ego-motion, which makes naive frame differencing unreliable.

Deployment mattered from the beginning. I targeted an Nvidia Jetson NX rather than treating inference hardware as an afterthought. That forced tradeoffs between model size, input processing, and real-time performance. Working with RWU and HATtec GmbH gave the thesis access to domain feedback and a more realistic benchmark for the work.

## What I took from it

The result was a real-time change-detection model that ran effectively on Jetson NX hardware and performed well on standard benchmarks. The thesis received a grade of 1.0. If I continued the project, I would expand field validation, measure failure modes by weather and terrain type, and formalise the synthetic-to-real transfer evaluation.

The thesis taught me to treat datasets, model architecture, and deployment hardware as one system rather than separate phases.
