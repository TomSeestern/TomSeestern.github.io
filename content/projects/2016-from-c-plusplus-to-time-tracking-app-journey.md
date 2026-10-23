---
id: from-c-plusplus-to-time-tracking-app-journey
title: "Qt and SQLite: Building a Time-Tracking Desktop App"
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

A time tracker looks trivial until the application closes in the middle of an entry. Then it becomes a lesson in persistence, validation, and everything users only notice when it fails.

## The problem

At Technisches Gymnasium, I spent 2016 to 2019 moving from C++ exercises into a time-tracking application. Before that final project, I built Snake and Sinking Ships clones. The small games gave me a safe place to make mistakes before I had to manage real user entries.

The time tracker used C++, Qt Creator, SQLite, and CSV export. I wanted employees to record and edit working time, but turning that into a useful desktop interface was harder than writing another game loop. A form that looked simple on screen raised questions about validation, editing, and what should happen when the application closed mid-entry.

## The build

I separated the data model from the widgets. SQLite gave entries a place to live between sessions, and CSV export made the data portable. Neither came for free. I had to connect UI actions, storage, and error cases into something that did not fall apart after a restart.

That meant thinking about transactions, default values, and how to show a failure without losing the user's work. I tested the storage layer without opening the UI, compared approaches with classmates, and kept refining the interface as I found assumptions that did not survive real use.

Qt's model/view separation made that boundary practical: I could change how an entry was displayed without rewriting the storage code, and I could test the storage code without clicking through a form. The CSV export was also a small lesson in product thinking. It gave users a way to move their data and made the application feel less like a sealed box.

The final application had to handle a failed save and an edited entry, and it had to keep the interface and the stored data in agreement. I added validation at the boundary and kept the calculation in one place so the interface and the export agreed. The goal was an application that could be trusted with someone's working time. A feature list was not the measure.

## The result

I shipped a time-tracking desktop app with a Qt GUI, SQLite storage, and CSV export. It was a school project, but it behaved like a small tool: data survived restarts, entries could be edited, and the export gave the user a way out of the application.

## What I took from it

This project showed me why I like building tools. It took classroom C++ into something practical and taught me that useful software depends on details users never see until they fail. The separation between UI and storage became a habit I carried into larger systems.
