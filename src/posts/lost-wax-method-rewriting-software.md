---
title: The Lost Wax Method of Rewriting Software
author: eric-johnson
reviewers:
- dennis-jackson
- caity-cronkhite
- mek-stittri
- volkan-gurel
category: engineering
date: 2015-12-07
poster: https://placehold.it/1200x1080
thumb: https://placehold.it/250x250
tags:
- Software
- Node
- Go
---

Rewriting software means completely reimplementing existing features, often in a new language. This is more drastic than a refactor, where large swaths of code are rewritten in the same language. Rewriting carries risk and can expose your users to new bugs or broken features. It can also impact your team by ballooning into an unreasonable time or resource commitment. Surprisingly, there is a 6000-year-old maker technique we can use to mitigate these risks and in some cases produce the mythical "perfect" deployment.

At Airware, we made the decision to rewrite our [REST](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) APIs from [Node](https://nodejs.org/) to [Go](https://golang.org/). We still love Node and use it in production today. But for a mixture of business, technical, and human reasons, we decided to make the switch in one of our critical services. It was the right decision for us and we'll likely write about how we make effective technology decisions in the future.

There is a passionate debate amongst [the](http://www.joelonsoftware.com/articles/fog0000000069.html) [internet](https://www.jwz.org/doc/cadt.html) [sages](https://blog.codinghorror.com/when-understanding-means-rewriting/) about the value of rewriting software. Many will tell you rewriting software is always exclusively a bad idea. So first, let's assume you've already done a thorough analysis of the risk versus reward and have committed to a rewrite. If you're on the fence, perhaps this technique will convince you to push forward.

The Lost Wax Method
-------------------
The lost wax method is a 6000-year-old production technique that duplicates a delicate model in a more durable material. Usually this technique was used for sculpture, and the final sculpture was made from a material like metal like silver, gold, brass, or bronze.

The earliest known examples were found in modern day southern Israel and date to around 3700 BC. This technique is still used today by artisans working on original or low-volume pieces. There are roughly five steps in the process:

1. Create a wax model.
2. Pack one side in clay.
3. Pack the opposite side in clay.
4. Apply heat and deposit new material.
5. Let cool and hand-finish the piece.

Let's go step-by-step, and I'll fill in the analogy to modern technology as we go.

Create a Wax Model
------------------
The process begins with a model of your finished product. It's usually made from a material like wax that's easy to work with, yet capable of representing both structure and finished detail. The material should have a low melting point so it can be easily removed. Also it ideally possesses a low viscosity so it flows cleanly and completely out of the mold.

![Original Model](https://placehold.it/750x400)

In our case, the existing material for our REST APIs is Node. We originally chose it for human reasons: the members of our small team were familiar with it, and it allowed everyone to work full stack. It also allowed everyone to work full stack. We also consider it to be fast and easy to work with because of the vibrant ecosystem available for things like OAUTH, AWS, Redis, and Postgres.

Node's melting point is low for us because of the DevOps decisions we made early on. All of our services run in [Docker](https://www.docker.com/) containers, so they are easily portable. Its viscosity is also low because we orchestrate our cluster with [Kubernetes](http://kubernetes.io/), so there is no custom tooling to deploy, run a Node container, or discover other services.

Pack One Side in Clay
---------------------
Next, pack one side of your model in wet clay and allow it to dry and harden. This creates the first half of a mold. It should sharply capture the contour of your model. Any air gaps will result in a defect of the structure or complicate the surface of your final piece.

![First Half of Mold](https://placehold.it/750x400)

In software, the first half of the mold are [unit tests](https://en.wikipedia.org/wiki/Unit_testing). They negatively define the shape of your application at the most granular scale. Using a coverage tool that supplies [branch information](https://en.wikipedia.org/wiki/Code_coverage#Basic_coverage_criteria) will allow you to ensure that every code path is tested. Gaps are bad.

In general, the right percentage of coverage is the amount that supplies the level of quality (measured in terms of bugs) with the lowest amount of effort. However, if ever there was a case to hit 100% test coverage, a software rewrite is it. So take this opportunity to max out the most quantitative part of this process.

Unfortunately, unit tests are written in your original language of choice. So completing the first half of your mold means porting all of them to your new code base to define the shape of the application that will live there. A purist would write unit tests on the original repo, validate the coverage percent, and then port them to the new repository. But this is arguably wasted effort, so consider porting your existing tests, then adding additional coverage to the new app.

Pack the Opposite Side in Clay
------------------------------
After the first side of your mold is dry, and you've created an effective drain, you need to pack the opposite side of your model with clay. This new clay will dry and harden without bonding to the first half. The seam between the two sides will allow you to pull them apart later.

![Second Half of Mold](https://placehold.it/750x400)

The second half of the mold are your [functional tests](https://en.wikipedia.org/wiki/Functional_testing). Unlike your unit tests, they exist outside your application and treat it like a [black box](https://en.wikipedia.org/wiki/Black_box). They define the interfaces that your application exposes to the outside world or consumes from other services. They are also an expression of your business logic and the use cases your product managers define and your users enact.

In the case of a REST API, your functional tests would authenticate and feed input to your service. They receive the output and compare it to a known list of acceptable responses. Ideally, this would happen in a test or staging environment, so you catch problems prior to deployment and don't disrupt production users.

Functional tests are not easy to instrument for code coverage, and there is no telltale metric that says you've got enough. They are higher effort to create and maintain than unit tests. Also, your engineers may not have the ability to run these locally during development, which decreases the time between iterations and increases velocity.

However, because functional tests live outside your codebase, they can exist in any language and don't need to be rewritten as a part of this process. In fact, it's advantageous to use the exact same set of tests for both the old and new versions of your application.

Apply Heat and Deposit New Material
-----------------------------------
You need to create a small hole or spout in the bottom of your mold to allow the existing material to drain out. It's best to locate this somewhere inconspicuous. It's not a part of your sculpture so you'll want it hidden or you have significant work to do to remove evidence of it later.

When you raise the temperature the wax will melt and clear your mold. Pour in your new molten metal and it'll take the shape of the mold. Allow it to cool before you open the mold to ensure the new piece is an accurate representation of your original model.

![Heat and New Material](https://placehold.it/750x400)

The new material in our case is Go. We're already familiar with Go from working with three of our DevOps tools: Docker, Terraform, and Kubernetes. We also used it to write several internal CLIs. Just as important, much of our team is most comfortable in strongly typed, compiled languages. But it's a bet because the language and ecosystem are young.

We like Go's imperative style because it's easy to reason about. Go optimizes for readability as opposed to writability, which we think speeds up code reviews, maintenance, and extending features. We also like Go's performance characteristics and concurrency primitives. We're confident that our Go services will be solid, reliable, and durable.

Whatever your technology choice, creating your new application at this point is essentially a form of [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD). The new code must pass all the unit tests that make up one half of the definition of your application. These are [buttressed](https://en.wikipedia.org/wiki/Buttress) by the functional tests that make up the second half. Using the exact same functional tests make up for any mistakes you might have made porting the unit tests.

The metaphorical spout in software terms is a simple, isolated way to replace your old application with the new one. [Reverse proxies](https://en.wikipedia.org/wiki/Reverse_proxy) or [load balancers](https://en.wikipedia.org/wiki/Load_balancing_%28computing%29) do a fine job of handling large amounts of traffic and routing effectively between multiple pools of application servers. At Airware we employ both [AWS Elastic Load Balancers](https://aws.amazon.com/elasticloadbalancing/) and our own [HAProxy](http://www.haproxy.org/) instances.

You may want to give yourself the ability to progressively siphon traffic on a high volume production workload from the old to the new cluster. Twitter famously used a simple [modulo](https://en.wikipedia.org/wiki/Modulo_operation) 10,000 rule to begin experiments with new features.

Let Cool and Hand-Finish the Piece
----------------------------------
Give the molten metal in your mold time to cool and harden. Impatient makers get burnt fingers. After a suitable period of time you should have confidence to handle your new sculpture.

Notice the rough areas around the seam between the two halves of the mold, near the spout, or caused by any gaps or air bubbles between the model and the mold. You may also see defects related to pouring the new metal too quickly or at the wrong temperature.

These defects or gaps require some handiwork. Polish or sand down any rough edges. Fill in any gaps with additional metal.

![Finished Peice](https://placehold.it/750x400)

Keep an eye on your metrics and logs while you turn up the heat and perform the switch. Dashboards that display 500 errors, CPU utilization, or RAM usage will let you know if your proxies are performing as intended. We use a mixture of [Kibana](https://www.elastic.co/products/kibana) and [Systig](http://www.sysdig.org/) to introspect our environments and containers for health. Stay on call in case your new application cracks under stress. Jump instantly on any [regressions](https://en.wikipedia.org/wiki/Software_regression) that your users experience.

Once your traffic is fully switched over and your new application is stable, you still have some work to do to finish the process. Remove every trace of the traffic routing or load balancing scheme so it's not accidentally reactivated at some point in the future. Also don't forget to deprecate your old repos and update your system diagrams.

Conclusion
----------
We're big believers in milestones at Airware. They are a great, lightweight way to ensure your agile development methodology is meeting your goals. If you've committed to a rewrite project, and think the lost wax method may help, consider planning around these specific milestones. It should help break up the effort and allow you to measure success along the way:

1. Meet your unit test coverage goal and ensure you have branch instrumentation.
2. Complete a healthy bank of functional tests that can run against a non-production environment.
3. Create a robust traffic management scheme and write a new application that passes all tests.
4. Monitor your logs and metrics in the relevant environments.
5. Remove any remnants of the switch after a reasonable cool-down period.

Happy rewriting!
