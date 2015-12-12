Airware Makers Blog [![Build Status](https://travis-ci.org/edj-boston/makers-airware-com.svg?branch=master)](https://travis-ci.org/edj-boston/makers-airware-com) [![Dependency Status](https://david-dm.org/edj-boston/makers-airware-com.svg)](https://david-dm.org/edj-boston/makers-airware-com) [![devDependency Status](https://david-dm.org/edj-boston/makers-airware-com/dev-status.svg)](https://david-dm.org/edj-boston/makers-airware-com#info=devDependencies)
===================

The Airware Makers blog highlights the work of our engineering and design teams. It features content about software engineering, firmware, hardware, aerospace, 3D printing, visual design, user experience, and more. We also are proud to open source certain aspects of our code for use and improvement by the community.


Setup
-----

Follow these steps to develop locally or contribute to the blog:

1. Install [Node and NPM](https://nodejs.org/en/)
2. Clone [https://github.com/airware/makers-airware-com](https://github.com/airware/makers-airware-com)
3. `cd` to your local copy and run `npm install` from your shell
4. Run `gulp` from your shell
5. Navigate to [http://localhost:3000](http://localhost:3000)


Contributing
------------

Check out [Understanding the Github Flow](https://guides.github.com/introduction/flow/) to get an overview of how contributing to an open source project works.

### Content

Content

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

* Eric J, Back end & blog editor
* Mark B, Design
* Nick I, Front end
* Caity C, Copy editing


To Do
-----

* Tag pages
* Author pages
* Separate test tasks for rapid local development versus full tests for CI runs
* Better management of gulp task dependency ordering with macros or wait for Gulp 4