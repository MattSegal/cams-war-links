# Link-Sharing-Website

[View Live Website Here](http://www.mattdsegal.com/links)

### Overview
The aim of this website is to allow me and my friends to share interesting links with each other. 

I initially made this site to help me learn JavaScript/jQuery in 2015. Now I'm looking to expand its features and learn TypeScript
  
### Stack
* Flask webserver + SQLAlchemy ORM + MySQL database
* TypeScript
* SASS + Jade for CSS/HTML

### Implementation notes

#### Back-end

The back end is separated into two modules
* page - serves the webpage, contains all page content
* api  - handles changes to application state, wraps the database

#### Front-end

The single-page app is implemented using a home-rolled psuedo MVC pattern, which I have been playing around with for a while, trying to get it to make sense. The app has the following components:
* views - represent page components, these fire events and render DOM elements
* events - these are mediated by an observer object and handled by several 'event' objects
* controllers - these wrap data sources and models
* models - store app state
* repository - wrap external data sources

This system feels a bit clunky - I might just re-write the whole thing in React sometime and see if it is much simpler. I use jQuery and Mustache to help me manipulate the view layer - no framework is being used. All the TypeScript is in /app/page/dev_content/ts.

### To Do - New Features
* Add optional link description to each link
* Add a refresh button or polling mechanism to keep content up to date
* Add list manipulations:
	- filter on tags 
	- change order
* Detect gifs / images and optionally show them
* Add user accounts and logins
	- Only authorised users can edit/delete links (optional?)

### To Do - Improvements
* Add Flask manager
    * Add automatic db backups
* Add selenium regression tests
* Add API regression tests
* Add responsive design back again