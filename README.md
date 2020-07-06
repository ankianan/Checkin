# Checkin

Its a geo-tagging app, where one can checkin a message tagged to certain location. The checkin will act as a memory for the user.

User can anytime see all his previous checkins or checkins done nearby.

### Deployed at 
https://gallant-murdock-77cfc4.netlify.com/

### App features
* Make checkin
* View your checkins
* View other's checkins (WIP)

### Planned improvements
* Security
  * Permission model (Personal and publick checkins)
  * Encryption
* UI Engagement
  * Show name location, than just lat long.
  * List messages, with date, time and venue details.
  * Allo photo checking
  * Push notification
* UI Reliability
  * Offline access
  
### TechStack
* Blockstack
* HyperHTML


## Install

npm install

## Build

1. npm run start:build: Start webpack, build and exit
1. npm run start:watch : Start webpack in watch mode
1. node server.js : Start server at [http://localhost:8081](http://localhost:8081)

## Test
npm run test : Single test run

npm run test:watch : Watched test run

