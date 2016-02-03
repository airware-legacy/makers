---
title: "Case Study: Aircraft to Ground Connection"
author: mark-bauer
reviewers:
- eric-johnson
- caity-cronkhite
category: design
date: 2015-01-15
poster: /img/casestudy/poster.png
thumb: /img/casestudy/card.png
tags:
- User Experience
---

We recently allocated two sprints to improve the usability of our Ground Control Station. The Ground Control Station is a Windows application that acts as the interface between an aircraft and its operator. It assists operators with routine calibrations, planning autonomous flights, and monitoring aircraft during flight.

Background
----------
Our plan was to identify and address the most significant pain points in the application. To determine what those pain points were, we conducted a series of interviews with operators, the folks who use the Ground Control Station on a daily basis. Every operator we talked to mentioned that the experience of connecting the Ground Control Station to an aircraft was clunky and frustrating. This connection flow is something that operators go through nearly every time they interact with the Ground Control Station, so it became clear that this was the perfect place to focus our efforts.

The Problem Space
-----------------
The problem with the old connection flow was that it lacked cohesion. Even though the ultimate user goal of connecting to an aircraft was straightforward, the workflow required users to navigate to different areas of the application to perform checks and set values. From our user interviews, we learned that the operators were hoping for a more opinionated workflow, one that walked them through each step in the process.

![Before: The old workflow required users to bounce back and forth between the Preflight and Operator tabs multiple times during the connection process.](/img/casestudy/preflight.png)

The fact that such a critical flow required multiple context switches spoke to a larger problem with the app’s Information Architecture. The high-level navigation of the app did not reflect how operators actually used it. We knew that we needed to address some of these more fundamental organization problems to improve the connection experience. However, restructuring high-level navigation can be a slippery slope that leads to a full-fledged redesign, and we didn’t have the time to invest in that. So our approach was to design the ideal connection flow and to make any information architecture changes necessary to support that, and nothing more.

The Solution
------------
We landed on a solution that converted the four horizontal blades (Preflight, Operator, Flight Planning, and Data) into three vertical tabs (Plan, Fly, and Analyze). We chose this structure so the navigation would more closely reflect the actual workflow of an operator in the field. We were able to accomplish this by dissolving the functionality in the Preflight tab into into the rest of the application.

We realized that nearly everything in the Preflight tab was either a setting or part of the connection workflow. So we took all of the settings, organized them into logical groups, and relocated them to the header. This way, settings would be accessible from anywhere in the application, and it would free us up to move all of the aircraft connection functionality into one place.

![After: Simplified navigation and connected aircraft panel](/img/casestudy/connect_new.png)

![After: Settings were relocated to a global menu in the header](/img/casestudy/operator.png)

The connection functionality would now live in the Fly tab in the new aircraft pane. We merged all of the aircraft information and actions into this pane and used the connection flow as the way to “unlock” it. When we had operators walk through the new flow for the first time, their feedback was overwhelmingly positive: “Why hasn’t it been this way all along?” The new flow was much more intuitive and saved them a significant amount of time in the field.

![Step-by-step aircraft connection flow from start to finish](/img/casestudy/connect_details.png)

Overall, this project was a successful exercise in making a big impact in a short amount of time. In two engineering sprints, we were able to greatly improve a critical workflow while simultaneously updating the navigation, settings, and visual styling. To me, this drove home the importance of focus when changing a core piece of functionality. Even the change required that we restructure a significant portion of the application, we were able to navigate the myriad tough decisions and tradeoffs because we had our overarching user goal of improving the connection flow to ground the project.
