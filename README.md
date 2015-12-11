Airware Makers Blog
===================

The Airware Makers blog highlights the work of our engineering and design teams. It features content about software engineering, firmware, hardware, aerospace, 3D printing, visual design, user experience, and more. We also are proud to open source certain aspects of our code for use and improvement by the community.


Setup
-----

Follow these steps to develop locally or contribute to the blog:

1. Install [Node and NPM](https://nodejs.org/en/)
2. Clone [https://github.com/airware/makers-airware-com](https://github.com/airware/makers-airware-com)
4. `cd` to your local copy and run `npm install` from your shell
5. Run `gulp` from your shell
6. Navigate to [http://localhost:3000](http://localhost:3000)


Contributing
------------

### Content

1. Fork the repo on Github
2. Open it in your favorite CLI or Git UI client
3. Create a feature branch per Gitflow
4. Create an author Markdown file in the `/src/authors` directory (if one does not already exist)
	* The file name should be lower case, dash-delimited, and will turn into a slug for referencing it throughout the site
5. Create a post Markdown file in the `/src/posts` directory
	* The file name should be lower case, dash-delimited, and will turn into a slug for referencing it throughout the site
	* Write in Github Flavored Markdown (GFM)
	* Include YAML FrontMatter with name, email, org, and other properties
6. Check [http://localhost:3000](http://localhost:3000) for your changes
7. Submit a PR when you are ready
8. Collaborate with editors, copywriting, marketing/PR, and legal for content and publishing approval


### Development

1. Fork the repo on Github
2. Develop locally
	* Tests will be run automatically each time code in `/src` or `/test` changes by `gulp.watch()`
	* Code will be linted automatically each time code in `/src` or `/test` changes by `gulp.watch()`
3. Submit a PR when you are ready
4. Collaborate with maintainers on the code review process

Note: Pushing to feature branches hosted on Github will trigger a build and test run on Travis-CI.org.


To Do
-----

* Tag pages
* Author pages
* Separate test tasks for rapid local development versus full tests for CI runs
* Better management of gulp task dependency ordering with macros or wait for Gulp 4