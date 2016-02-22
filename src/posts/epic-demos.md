---
title: Epic Demos
author: eric-johnson
reviewers:
- volkan-gurel
- caity-cronkhite
category: engineering
date: 2016-02-10
comments:
  twitterHash: 'AirwareMakersEpicDemos'
  redditURL: 'https://www.reddit.com/r/softwaredevelopment/comments/47187z/airware_makers_epic_demos/'
poster: /img/epic-demos/poster.png
thumb: /img/epic-demos/card.png
tags:
- Agile
- Scrum
---

Agile helps teams of engineers make complicated things. If you're running an agile development process, you're regularly holding demo meetings at the end of your sprints. I hope you leave your product owners saying "Epic!" at the end of the demos, but that's not what this article is about. At Airware we demo our epics, or development initiatives that span multiple sprints. This is about the unique challenges we face, how we demo, and how it might help you.

The Challenge of Integration
----------------------------
At Airware, we're developing a Cloud platform that manages and analyzes data that should be conceptually familiar to every technologist in the Bay Area. We're also developing our own native clients, firmware, and hardware. These disparate systems are expected to integrate seamlessly with one another. An example of one of our past epics is "Fixed-Wing Flight,". If you're in a pure software business, take a moment to reflect on the complexity that implies. Some components are even expected to work offline. It's a classic set of distributed computing problems.

![Airware Cloud](/img/epic-demos/cloud_app.png)

What's interesting about the mixture of cloud, native, firmware, and hardware components is that our platform essentially represents a spectrum of agility. On the cloud side, we are hyper agile and practice [continuous delivery](https://en.wikipedia.org/wiki/Continuous_delivery). At the other extreme our hardware is necessarily waterfall--a mistake means waiting weeks for the next spin of boards. In between, our native apps and firmware are reasonably agile with the help of SIL and [HIL simulation](https://en.wikipedia.org/wiki/Hardware-in-the-loop_simulation) testing.

![Spectrum of Agility](/img/epic-demos/agility_spectrum.png)

Did I mention our stuff lives in the physical world and flies through the air? We're in an industry where safety is critical. Aerospace doesn't [move fast and break things](http://www.businessinsider.com/mark-zuckerberg-2010-10). We do, however, need to move as fast as our ridiculously high standards for quality allow. This means missing no opportunity to prove to ourselves that things work together as designed.

How We Demo
-----------

The process starts with our product managers, engineering managers, and relevant tech leads. They sit down with the features in the next release and turn it into an end-to-end workflow that a real customer might follow. An example epic is "Fixed-Wing Flight."

### The Script

It may begin with a back-office persona creating an area of interest (such as a field) on a map in the Airware Cloud UI. That item is accessed through our APIs by a different persona in our native client. They make some tweaks to the flight plan, connect to an aircraft, and begin flying. The drone will fly a [Zamboni pattern](https://en.wikipedia.org/wiki/Ice_resurfacer), take pictures, and log the telemetry. This data will be retrieved from the aircraft, uploaded to the Airware Cloud, and finally processed into an [orthomosaic](https://en.wikipedia.org/wiki/Orthophoto).

![Fixed Wing Flight](/img/epic-demos/fw_photo_survey.png)

Ideally each step in the script highlights a new feature we're building in that release. We occasionally insert existing features if they are necessary to create a seamless series of steps. The steps are grouped into phases that are mostly owned by a team or lead. This is useful later for charting the progress of features or teams individually to surface problems earlier.

### Short, Short, Long

A lead from each team involved in the epic gather periodically with a demo master. The first meeting is a dress rehearsal. The demo will evolve slightly through the development period so this dry run is the first chance for staff to shake down the script:

1. Identify any ambiguities
2. Call out any surplus steps
3. Uncover any gaps

Since little progress is made immediately, the meetings may happen just once a week. Once feature development picks up, so does the frequency. As the final deadline approaches we may demo every day (or twice a day) if necessary.

A key optimization we made after repeating this process successfully multiple times was to abbreviate most of the demos. This concentrates us on unfinished, in-progress items of work. It also saves time and keeps the meetings to 30 minutes or less. We make certain to periodically run through the full script, however. A full run-through reveals any regressions that may have occurred.

### The Scorecard

The demo master grades each step during the demo meeting. To make it less subjective, we use a scale that is widely understood and communicated. A good scale reflects a smooth progression that follows the feature from beginning to end. A bad scale would skew high or low, obscuring work that's being done or hiding problems. Ours looks something like this:

Grade|Points|Description
-----|------|:----------
A    |4.00  |Complete according to "definition of done" and merged into develop
A-   |3.66  |
B+   |3.33  |
B    |3.00  |Mostly done but requires polish
B-   |2.66  |
C+   |2.33  |
C    |2.00  |Mostly incomplete or buggy
C-   |1.66  |
D+   |1.33  |
D    |1.00  |Functionality is in some rudimentary state
D-   | 0.5  |
F    |0.00  |Story is not yet started or cannot be shown

We translate the grades into a [GPA](https://en.wikipedia.org/wiki/Grading_(education). Airware is fortunate to have many past top performers from excellent schools. Sufficed to say, these individuals are not accustomed to anything below a 4.0. There's a [natural drive](https://en.wikipedia.org/wiki/Gamification) to push the GPA upward, which helps working through problems that may not be the most fun aspects of the project.


<a class="external" href="https://docs.google.com/spreadsheets/d/14V7ep0_V6PEPoFJ1dWoo0U6QGRK-zlmqMNR76ojukvc/edit">
    <img class="post-img-hover" src="/img/epic-demos/grades.png" alt="The Scorecard" />
</a>

Why does this work?
-------------------

This process works in part because it's a macro version of sprint demos. Sprint demos are all about demonstrating working features. Epic demos exercise working interfaces.

> Working software is the primary measure of progress <cite>—Agile Manifesto</cite>

Secondly, the process of developing a scorecard constrains the set of problems you must solve. It's your acceptance criteria expressed in a compact, actionable form. This is invaluable when you consider the [combinatorial explosion](https://en.wikipedia.org/wiki/Combinatorial_explosion) of edge cases that arise when you're integrating hardware, firmware, and software that must fly.

Thirdly, this process demonstrates incremental improvement. This keeps us on track and allows us to see and celebrate some of the smaller wins. It also allows us to make better predictions. We observe problems well in advance and can make corrections in the form of resources and scope decrease if necessary. For instance, it's trivial to chart of our GPA of each phase over time. The slope of the lines indicates your projected completion date.

![Scorecard Chart](/img/epic-demos/chart.png)

Arguably the greatest benefit is that the script represents an end-to-end workflow. This puts emphasis on the seams or interfaces between each component that might normally receive less attention if they were developed in isolation from one another according to a mere spec.

Conclusion
----------

Making large, complex, and multidisciplinary systems sometimes requires original thinking. This extension of vanilla agile works great for us, and we've now run it successfully six times, spanning almost a year. If you'd like to try it, [download this sample scorecard](https://docs.google.com/spreadsheets/d/14V7ep0_V6PEPoFJ1dWoo0U6QGRK-zlmqMNR76ojukvc/edit) to get started.

Here's some other things to keep in mind:

* Time your demos and try to keep them under 30 minutes.
* Rotate members of the demo meetings from epic to epic.
* Let your demo master lead two processes in a row to lend continuity and confidence to the next team.
* Use some of your budget to celebrate a successful epic with drinks, bowling, or whatever your team enjoys.
