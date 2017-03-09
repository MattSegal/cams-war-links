# Link-Sharing-Website

[View Live Website Here](http://www.mattdsegal.com/links)


    /*
    
    TODO: 
         add signup
         add new styles
         add tags
         group links by month
         group recent links by days
         add user comments
         add 'read' checkbox and 'to-read'
             we can have views of these
         use soft delete
         reconstruct created data?
         add links as Anon
             claim links later
             sign in with Google?
         search

    */

### Overview
The aim of this website is to allow me and my friends to share interesting links with each other. 

I initially made this site to help me learn Flask and JavaScript/jQuery in 2015.
I refactored the front-end to use TypeScript and the backend to use SQLAlchemy in 2016.
Now in 2017 I've re-written the back-end in Django and the front-end with React/Redux to help me learn these frameworks.
  
### Stack
* Django
* React/Redux + ES6
* SASS

### Implementation notes

#### Back-end

The back end is separated into two modules
* links - serves the webpage, contains all page content
* api  - handles changes to application state, wraps the database

#### Front-end


### To Do - New Features (sorted by importance)
reconstruct created dates
ship it!

# NEXT DEPLOYMENT
Add HTTPS
Add server-side rendering
Add tags
Add list manipulations:
	filter on tags 
	change sort order
Add sign in with Google https://developers.google.com/identity/sign-in/web/sign-in
Add 'read' checkbox and 'to-read' list
Change delete to 'soft' delete
Detect gifs / images and optionally show them
Add user comments
Search links

### To Do - Improvements

Add automatic db backups
Add API regression tests
Add responsive design back again


### To Do - Hacks and Bugfixes

Session timeout is 12 months