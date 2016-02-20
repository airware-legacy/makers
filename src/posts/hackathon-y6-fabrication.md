---
title: The Hackathon Y6 Fabrication
author: eric-johnson
reviewers:
- chuck-taylor
- caity-cronkhite
category: engineering
date: 2016-02-16
comments:
  twitterHash: 'AirwareMakersY6Fab'
poster: /img/hackathon-y6-fabrication/poster.png
thumb: /img/hackathon-y6-fabrication/card.png
tags:
- Fabrication
- 3D Printing
- Hacks
---

Airware makes hardware components, firmware, and software for commercial drones. But a hackathon is a time to experiment and push the limits of what your experience and role dictate. A collection of engineers at Airware decided to take on the challenge of designing and fabricating a one-off drone from scratch for the first time in their careers--in just three days.

Y6 Configuration
----------------
To set the context, everyone is likely familiar with quadrotors that utilize a simple X-shaped frame. You may have even seen an “X8” without realizing it. X8s are similar but have two rotors per arm, whereas an octorotors would have all eight propellers arranged in a disc.

<img class="post-img-hover" src="/img/hackathon-y6-fabrication/comparison.png" alt="Quad/X8/Octo" />

Eight rotors gives you some redundancy compared with a standard quadrotor. The benefit of an X8 over an octorotor is that you get double the power in the same small package, so you can fly in tight spaces. There is no free lunch, however: you use more battery and lose 5-10% efficiency because the bottom props operate in the wash of the upper props.

X8s are more maneuverable than a large, disc-shaped octocopter. They are also far more compact for shipping and storage. We’ve learned that operational concerns like assembly and disassembly time, pack volume, and ease of use can equal or outweigh flight characteristics for many customers.

<img class="post-img-hover" src="/img/hackathon-y6-fabrication/y6_post_images.png" alt="Y6 image" />

The Y6 configuration shares the redundancy and compact format characteristics of the X8, but it only has three arms and six motors. This decreases weight and increases flight time marginally over the X8. You can also argue that it has a wider field of view for a suspended wide-angle camera, which may be desirable for applications like cinematography.

Unique Characteristics
----------------------

### Foldable Arms

The team wanted to further enhance the operational compactness of the Y6 configuration. They designed two of the arms to fold backward along the axis of the third arm. This allows the pack volume of the Y6 to be the width of it’s central cage.

<video autoplay loop>
  <source src="https://videos.airware.com/y6-moving-arms/high.mp4" type="video/mp4">
  <source src="https://videos.airware.com/y6-moving-arms/high.webm" type="video/webm">
  <source src="https://videos.airware.com/y6-moving-arms/high.ogg" type="video/ogg">
  <source src="https://videos.airware.com/y6-moving-arms/low.mp4" type="video/mp4">
</video>

Special fasteners hold the arms in place during flight. We had to take special care to make sure that vibration would not loosen the arms.

### Battery Masts

One unique design element is the battery masts. They use silicon bushings and isolate the battery from the rest of the frame, which protects it from vibration.

<img class="post-img-hover" src="/img/hackathon-y6-fabrication/battery_tray.png" alt="Battery tray" />

Somewhat counter-intuitively, the flight sensors (accelerometers, gyros, etc.) are also mounted on this component next to the battery. The added mass of the battery acts as a sort of ballast, which further isolates these sensitive components from the harsh vibration of the motors and propellers.

### Grounded Carbon Composite Cage

The construction of the Y6 body is sort of like a 2D plate sandwich. It’s reminiscent of the movement inside a mechanical watch. This allows moderately complicated forms without any complex tooling such as molding or [CNC](https://en.wikipedia.org/wiki/CNC_router) techniques needed to produce compound curves.

<img class="post-img-hover" src="/img/hackathon-y6-fabrication/carbon_cage.png" alt="Carbon cage image" />

Another benefit of the carbon material is that the frame naturally acts a [Faraday cage](https://en.wikipedia.org/wiki/Faraday_cage) or EMI shield to protect against electromagnetic interference. This simultaneously improves radio communication with the aircraft and the quality of the sensor data flowing into the flight controller.

### Field of View

To take advantage of the large field of view on this drone, the team installed a gimbal-stabilized GoPro video camera for night filming. To light the way, they installed a 100-watt LED with a high amperage, remotely-controlled relay. Warning: it will melt styrofoam cups at a range of three feet.

<img class="post-img-hover" src="/img/hackathon-y6-fabrication/lights.png" alt="Camera and lights" />

The Y6 also carries a video transmitter separate from the normal wireless communications systems that connect drone and operator. It also includes bright standard aviation lighting: red on left, green on right, and white on rear. All these auxiliary functions are mediated through a switch panel on the body of the drone for ground checks. For good measure, the team also used anti-spark connectors on the battery to prevent them from wearing out over time.

### Specifications

|Attribute|Value|
|---------|-----|
|Propellers|• 6 count<br>• Wood (for vibration characteristics)<br>• One top prop spins in the opposite direction (to help maintain yaw authority)<br>• Pairs (top/bottom) counter-rotate at constant speed|
|Batteries|6 cell Lithium Polymer batteries (due to current draw and efficiency)|
|Dry Weight (without batteries)|6 kg (with payload)|
|Flight time|~20 minutes|

### Tools

* [SolidWorks](http://www.solidworks.com/): 3d CAD software for design and simulation of moving parts (like the foldable arms)
* [Cut2D](http://www.vectric.com/products/cut2d.html): Vector-based drawing and editing tools for CNC routing (the composite body plates)
* [Cura](https://ultimaker.com/en/products/cura-software): Open source software for use with our [Ultimaker2](https://ultimaker.com/) 3D printer (to print the leg mounts and other small parts)

### The Team

|Name|Title|Biography|
|----|-----|---------|
|__Chuck Taylor__|_Lead Engineer, UAV Systems_|Chuck is an UAV Systems Engineer at Airware. Acting as an in-house customer, he integrates and tests the latest hardware and software across a variety of vehicles to ensure their functionality and safety. Chuck provided the inspiration for the Y6 project and did most of the CAD work.|
|__Geoffrey DuBridge__|_Engineer, UAV Systems_|Geoffrey integrates the Airware platform into customer vehicles and conducts flight testing of new aircraft, payloads, and sensors that will become Airware-compatible. Geoff led the manufacturing of the Y6.|
|__Doug Yukihiro__|_Senior Engineer, Electrical Hardware Integration_|Doug is a Production Lead at Airware. He builds all the products that Airware produces internally for engineering purposes and externally to our customers. Doug did all of the wiring and electronics for the Y6.|
