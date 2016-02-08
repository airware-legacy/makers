---
title: Flight Planning in the Airware Cloud
author: mark-bauer
reviewers:
- eric-johnson
- caity-cronkhite
category: design
date: 2015-12-11
poster: /img/flight-planning-in-the-airware-cloud/poster.png
thumb: /img/flight-planning-in-the-airware-cloud/card.png
tags:
- Sketch
- Process
- Art
---

The goal of this project was to design a UI in the Airware Cloud that enables users to create a new job as easily as possible. This is an crucial experience because a “job” is the fundamental unit of work here at Airware. It encapsulates all of the work that goes into collecting data with a drone—from planning the flight, through the collection of data, and ultimately the creation of a data product.


The Problem Space
-----------------
Before a job ever makes it into the hands of a drone operator, it needs to pass through a rigorous  approval process. This process ensures that the job is safe to fly and able to capture all of the necessary data.

The challenge is that the person who creates the job and submits it for approval will not know much about flight planning or drone operation. In fact, our target persona was someone working in the home office of a small to medium-sized business—the folks who create and manage work. These people don’t necessarily operate the drone: Their role is more analogous to a dispatcher than a drone operator. We needed to design a way of abstracting the complex flight planning workflow into a much simpler one for this new audience.


Our Process
-----------

### Raw

The first thing we did was break the workflow down into all of the necessary tasks and put them up on the whiteboard.

![Whitboard](/img/flight-planning-in-the-airware-cloud/whiteboard.png)

After that, we scrutinized our list. We asked questions like: Is this task necessary? Could we automate this? Can we combine these tasks? Our goal was to organize all of the tasks into a logical sequence by grouping them into “steps.” During this process, we came up with some clever and technically ambitious ideas to streamline the workflow, including auto-generating elements of the flight plan, but more on that later.  

![Disorganized](/img/flight-planning-in-the-airware-cloud/disorganized.png)

Once the workflow was broken down into steps, we started iterating on how these steps should be represented in the UI. We laid out our options in a series of whiteboard sketches. We were shooting for volume at this point in the project; we wanted to explore as many ideas as possible in low fidelity to quickly get a sense of what worked and what didn't. We identified pros and cons of each sketch, pruned the truly crazy ideas, and were left with a list of viable contenders.

![Organized](/img/flight-planning-in-the-airware-cloud/organized.png)


### Refinement

We recognized that the designs fell into two camps: single page layouts and multi-page flows. Since creating a flight plan is such an interaction-heavy task, we decided to quickly prototype some options to make a more informed decision about which direction to take. Once the prototypes were built, it became obvious that the single page options weren’t going to cut it.The multi-step flows broke up this relatively large workflow into smaller, less daunting steps much more effectively.

The multi-step options also gave us opportunities to provide the user with feedback at each step. The prototypes also taught us how precious map real estate was in this context, so we focused on designs that utilized as much screen real estate as possible.

![](https://placehold.it/750x400)

Prototype of the full screen “panel” animation


### Polish

Knowing this, we decided to place this workflow in new a full-screen view we now refer to as the “panel.” We were concerned that transitioning into this view would be jarring and potentially disorienting for the user. To mitigate that, we animated the view in and out from the bottom of the screen to provide some spatial context.

Although it’s fairly common in native mobile and tablet applications, I had my doubts about how well it would perform in a web browser. However, I underestimated how far CSS transitions have come over the past few years! The transition felt smooth and natural. This transition, along with the dark color palette, helped to focus the user and made it clear that they were transitioning into a new “mode.”

![](https://placehold.it/750x400)


Final Idea
----------

The final design ended being a simple three-step process.

### Step 1
In step one, we ask the user to give us the location where they will be flying and what data products they want to generate with the flight data. Special thanks to Jona Dinges for the beautiful low-poly artwork that we use to represent our data products.

![Info](/img/flight-planning-in-the-airware-cloud/1-info.png)

### Step 2

Step two is where the user actually creates the flight plan. Although a flight plan is technically a complex combination of aircraft maneuvers, parameters, and contingency responses, we realized that we could actually abstract that complexity and derive the more technical bits from three concepts that we thought would be more salient to our users:

* A geofence: The boundaries that the drone must stay within
* A survey area: The area that you want a map or model of
* A launch/land location. The location from which the drone will take off and return when it’s done collecting data.

My favorite part about this is that we auto-generate both the geofence and the survey area based on the information that the user gave us in the previous step. It’s not a perfect system yet—we still rely on the user's judgement to make adjustments. However, auto-generating speeds up the process and considerably reduces the learning curve.

![Plan](/img/flight-planning-in-the-airware-cloud/2-plan.png)

### Step 3

After creating a flight plan, the user picks a date or date range to fly the job, assigns an available operator to it, and submits the job for approval. The job is then put into a “pending” state until it is processed based on each company’s approval workflows. In most cases, we can automatically return a decision about whether or not the job is approved within seconds. However, some companies may require a human being to make the final decision about whether to approve the job, which would obviously take longer.

![Operators](/img/flight-planning-in-the-airware-cloud/3-operators.png)

Conclusion
----------

Once the job is approved, the flight plan is sent to the operator, who flies the drone and collects data. What happens after that is another post for another day.
