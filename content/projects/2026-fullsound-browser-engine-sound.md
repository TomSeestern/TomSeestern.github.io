---
id: fullsound-browser-engine-sound
title: "FullSound: Browser-Native Engine Sound Simulation"
articleDate: 2026-10-04
articleContent: I built FullSound, a browser engine simulator that synthesizes exhaust, intake, and mechanical sound from a WASM FDTD pipe network and renders the engine in 3D.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Solo developer
outcome: Built a browser-native engine simulator with real-time audio synthesis, WASM pipe physics, and a live Three.js engine view.
metrics:
  - label: Presets
    value: "6"
  - label: Audio thread
    value: AudioWorklet
  - label: Physics
    value: FDTD pipe network
  - label: Visualisation
    value: Three.js, 60 fps target
heroImage: /img/projects/fullsound-engine.png
tags:
  - Audio
  - Web Audio
  - WebAssembly
  - Simulation
  - Three.js
technologies:
  - TypeScript
  - Rust
  - WebAssembly
  - AudioWorklet
  - SharedArrayBuffer
  - Three.js
  - Vite
---

A recorded engine loop can sound right at one RPM and wrong everywhere else.

## The problem

Most engine sounds in a browser are recordings with a playback rate tied to RPM. They can sound convincing at one operating point, but they do not respond like a physical system when the throttle, load, or exhaust geometry changes.

FullSound synthesizes the sound instead. The audio path starts with a cylinder pressure model, adds intake and mechanical sources, and runs the exhaust through a per-preset pipe network solved with finite-difference time-domain physics in Rust/WASM. The result is an engine note that changes with RPM and throttle rather than a loop being pitched up and down.

## The build

The architecture is split across three execution contexts. An AudioWorklet processor owns the audio thread and consumes samples from a lock-free ring buffer. A Web Worker runs the simulation loop and builds the pipe network for the active preset. The two communicate through SharedArrayBuffer ring buffers, with a postMessage fallback when cross-origin isolation is unavailable.

That boundary mattered more than any individual DSP block: the audio thread must never wait for the simulation, and a missed deadline should degrade gracefully instead of blocking playback. The demo exposes RPM and throttle controls, a preset selector, a tachometer, a glitch counter, and a failure table. Six engine configurations are available, from an inline-four and V6 to a V8 crossplane, flat-four, rotary Wankel, and two-stroke single.

A Three.js view uses the same engine model to animate the crankshaft, pistons, valves, turbo, and Wankel rotor, with live telemetry for RPM, exhaust temperature, manifold pressure, air/fuel ratio, and per-cylinder combustion. The visualisation targets 60 fps and drops detail on low-end devices rather than hiding the physics. I kept the engine configurations data-driven so the audio and visual layers read the same preset definition.

The failure table made audio dropouts, missed deadlines, and fallback behaviour visible during development, which is essential when a problem in the audio thread can sound like a bad preset. I would rather ship a system that tells the user it is degrading than one that hides the failure behind a convincing noise.

## The result

FullSound is a browser-native engine simulator with real-time audio synthesis, WASM pipe physics, and a live Three.js engine view. It runs locally through Vite; there is no public deployment link, so this case file is the evidence trail rather than a live demo.

## What I took from it

The project made real-time boundaries concrete. The interesting part was keeping the audio thread deterministic while a separate worker ran a heavier simulation and a renderer drew the result. A single DSP block sounding good in isolation was only one part of the problem. That is the part I would carry into another simulation project: make the physical model the shared source of truth, then treat audio and graphics as two views of it.
