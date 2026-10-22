---
id: from-c-plusplus-to-time-tracking-app-journey
title: From C++ Courses to Crafting a Time Tracking App
articleDate: 2016-07-10
articleContent: I built a time-tracking desktop application in high-school C++ courses, using Qt Creator, SQLite persistence, and CSV export.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Student developer
outcome: Shipped a time-tracking desktop app with a Qt GUI, SQLite storage, and CSV export.
tags:
  - C++
  - Time Tracking App
  - Coding Education
  - Project Development
technologies:
  - C++
  - QT Creator
  - SQL
---

At Technisches Gymnasium, I spent 2016 to 2019 moving from C++ exercises into a time-tracking application. Before that final project, I built Snake and Sinking Ships clones. The small games gave me a safe place to make mistakes before I had to manage real user entries.

The time tracker used C++, Qt Creator, SQLite, and CSV export. I wanted employees to record and edit working time, but turning that into a useful desktop interface was harder than writing another game loop. GUI decisions and reliable persistence kept exposing gaps in my understanding. A form that looked simple on screen raised questions about validation, editing, and what should happen when the application closed mid-entry.

I worked with fellow students, compared solutions, and kept refining the app. SQLite gave entries a place to live between sessions, while CSV export made the data portable. Neither came for free. I had to connect UI actions, storage, and error cases into something that did not fall apart after a restart. That meant thinking about transactions, default values, and how to show a failure without losing the user's work.

The project also taught me to separate the data model from the widgets. Once the storage layer had a clear interface, I could test it without opening the UI and reason about edge cases more precisely.

## What I took from it

This project showed me why I like building tools. It took classroom C++ into something practical and taught me that useful software depends on details users never see until they fail.
