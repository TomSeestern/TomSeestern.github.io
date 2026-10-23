---
id: 2014-altis-life-roleplay-gamemode
title: "Altis Life: Operating a Roleplay Server at 300+ Concurrent Players"
articleDate: 2014-12-31
articleContent: With a small team, I built and operated an Altis Life roleplay gamemode for Arma 3 that peaked at more than 300 concurrent players.
authorName: Tom Segbers
authorImgSrc: /img/logo.png
role: Lead developer and project manager
outcome: Reached more than 300 concurrent players and supported a community of developers, moderators, and affiliated servers.
metrics:
  - label: Peak concurrent players
    value: 300+
  - label: Project span
    value: 2014–2016
tags:
  - Game Development
  - Arma 3
  - Modding
  - Multiplayer
technologies:
  - SQF
  - SQL
  - Windows
  - Arma 3
  - Teamspeak3
---

Altis Life was the first time software I wrote had a queue of people waiting to use it. That changes the definition of done.

## The problem

From 2014 to 2016, I worked with a small group of friends on an Altis Life roleplay gamemode for Arma 3. I was the lead developer and project manager. We used SQF, SQL, Windows Server 2012, Arma 3, and TeamSpeak 3 to turn a military simulation into a persistent player-run world.

The core idea was a gamified version of real life. Players chose a side, civilian or police, then picked a legal or illegal job, earned money, bought vehicles, and built and customised their own house. Each player created a character and stayed in role during interactions. Later versions added stock markets, more factions, additional jobs, clothing, skins, and unique events.

The first challenge was scale. More players meant more server pressure, more edge cases in custom mechanics, and more community work. A feature that worked with twenty players could fail with two hundred, and the only reliable way to find out was to test it under load.

## The build

I led a small team of developers and moderators, oversaw the servers, and handled project management. That meant splitting work, reviewing changes, and deciding when a feature was stable enough to ship. We kept adding features, watching performance, collecting feedback, and updating the gamemode instead of treating launch as the finish line.

The technical work was only half of it. A roleplay server is a social product: the economy has to feel fair, the rules have to be understandable, and the moderation tools have to let people resolve conflicts without breaking the world. I learned to design changes around player behaviour as well as what the code made possible.

On the server side, persistence was the difference between a scenario and a world. Player money, vehicles, houses, and faction state had to survive restarts without becoming a source of duplication or loss. We treated the database as part of the game design, not a storage detail, and added checks around the actions that could change an economy fastest. That is where I learned to think about exploits as ordinary failure modes rather than as something a moderator would clean up later.

## The result

Altis Life reached more than 300 concurrent players on our community servers, and affiliated servers adopted the project. That number was exciting, but it also made every bad decision visible. A broken economy or a confusing rule did not stay in a test environment; it became a conversation in the community.

## What I took from it

This was the first project where I had to lead both technical work and people. It taught me that roleplay systems only work when code, server performance, and clear shared rules hold together. It also taught me to respect the operational side of software: the release is the beginning of the work, not the end.
