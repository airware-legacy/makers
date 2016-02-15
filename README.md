Airware Makers Blog [![Build Status](https://travis-ci.org/airware/makers.svg?branch=master)](https://travis-ci.org/airware/makers) [![Dependency Status](https://david-dm.org/airware/makers.svg)](https://david-dm.org/airware/makers) [![devDependency Status](https://david-dm.org/airware/makers/dev-status.svg)](https://david-dm.org/airware/makers#info=devDependencies)
===================

The Airware Makers blog highlights the work of our engineering and design teams. It features content about software engineering, firmware, hardware, aerospace, 3D printing, visual design, user experience, and more. We also are proud to open source certain aspects of our code for use and improvement by the community.


Setup
-----

Follow these steps to develop locally or contribute to the blog:

1. Install [Node 4.x (and NPM)](https://nodejs.org/en/)
2. Fork/clone [https://github.com/airware/makers](https://github.com/airware/makers)
3. `$ cd` to your local copy and run `npm install` from your shell
4. Install gulp globally: `$ npm install -g gulp`
5. Run `$ gulp` from your shell
	* Optionally specify your own port `$ gulp -p 3333`
6. Navigate to [http://localhost:3000](http://localhost:3000) (or add your custom port)


Contributing
------------

Check out [Understanding the Github Flow](https://guides.github.com/introduction/flow/) to get an overview of how contributing to an open source project works.

### Content

#### Simple

1. Create a Google doc with your content
2. Share it with the maintainers to make sure your ideas and composition are consistent with the goals and voice of the blog
3. Move to the "advanced" steps below or let the maintainers create it for you


#### Advanced

Once you've published a few articles you're likely ready to fly solo. The steps are pretty simple once you get the hang of it. But they go into extra depth in case you've never contributed to an open source project before. If you're having trouble, talk to one of the maintainers and they will help you create content.

1. Fork the repo on Github
2. Create a new branch from `develop` called something like `feature/my-post-title`
3. Create an author Markdown file in the `/src/authors` directory (if one does not already exist)
	* The file name should be lower case, dash-delimited, and will turn into a slug for referencing it throughout the site
4. Create a post Markdown file in the `/src/posts` directory
	* The file name should be lower case, dash-delimited, and will turn into a slug for referencing it throughout the site
	* Write in Github Flavored Markdown (GFM)
	* Include YAML FrontMatter with name, email, org, and other properties
5. Check [http://localhost:3000](http://localhost:3000) for your changes
6. Submit a PR when you are ready
7. Prepare to collaborate with the maintainers on the following steps:
	* Content Editing
	* Copy editing
	* Marketing/PR
	* Legal


### Development

These steps assume you're a Software Engineer and experienced Open Source contributor.

1. Fork the repo on Github
2. Develop locally in a feature branch
	* Tests will be run automatically each time code in `/src` or `/test` changes by `gulp.watch()`
	* Code will be linted automatically each time code in `/src` or `/test` changes by `gulp.watch()`
3. Submit a PR when you are ready
4. Collaborate with maintainers on the code review process

Note: Pushing to feature branches hosted on Github will trigger a build and test run on Travis-CI.org.


Maintainers
-----------

* Eric J: Backend & blog editor
* Mark B: Design
* Nick I: Front end
* Caity C: Copy editing


To Do
-----

* Tags on post cards
* Tag pages
* Author pages
* Tech tags on OS projects
* Separate test tasks for rapid local development versus full tests for CI runs
* Upgrade to Gulp 4 (when out)
* Upgrade to Bootstrap 4 (when out)

Licenses
--------

### Content

The writing, visual design, imagery, video, and other media of the Airware Makers Blog are subject to copyright as this agreement below.

```
You are granted a limited, royalty-free, non-sublicensable,
non-exclusive license to copy, reproduce, and privately display the
content for the sole and limited purpose of testing an installation of
the code. You may not distribute, publicly display, or create derivative
works of the content. The code is licensed under separate terms.

THE CONTENT IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE CONTENT CREATORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF, OR IN CONNECTION WITH THE CONTENT OR THE USE OF THE
CONTENT.
```


### Code

The code of the Airware Makers blog is covered by the Apache V2 software license. You're welcome to use it as inspiration or borrow specific peices for your own project.

```
Copyright 2016 Airware

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
