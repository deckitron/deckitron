# Deckitron

Collaborative deck building for Magic: The Gathering.

![screenshot](https://raw.githubusercontent.com/Matthew-Smith/deckitron/master/docs/screenshot.png)

## Description

Deckitron is a tool for creating a deck for Magic: The Gathering with friends.
Start a new deck and invite your friends to help you create great decks for your next MTG game.

## Setup

1. Download and install [Mongo DB community server](https://www.mongodb.com/download-center?jmp=nav#community)
2. In a terminal start mongodb with a database path
    ```
    "C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --dbpath "C:\deckitronDB"
    ```
    Note: this is the default installation path for MongoDB server 3.2 and an example database path. You can specify anywhere for dbpath
3. Run the data import script
    ```
    cd <deckitron repo location>
    node scripts\importAllData.js
    ```
    Note: this will probably take a while as it has to process the data from every Magic set.
4. Run Deckitron
    ```
    cd <deckitron repo location>
    npm start
    ```
5. Open your browser and goto http://localhost:5000

## Instructions

Create a deck
Send your link to your friends
Start adding cards to your deck


## Resources

[Angular](https://www.npmjs.com/package/angular)
[Angular Animate](https://www.npmjs.com/package/angular-animate)
[Angular Aria](https://www.npmjs.com/package/angular-aria)
[Angular Material](https://www.npmjs.com/package/angular-material)
[Angular Slug](https://www.npmjs.com/package/angular-slug)
[body-parser](https://www.npmjs.com/package/body-parser)
[Express](https://www.npmjs.com/package/express)
[Gatherer](http://gatherer.wizards.com/Pages/Default.aspx)
[jQuery](https://jquery.com/)
[Less](https://www.npmjs.com/package/less)
[Mongoose](https://www.npmjs.com/package/mongoose)
[MongoDB](https://www.mongodb.com/)
[MTG JSON](https://mtgjson.com/)
[NodeJS](https://nodejs.org/en/)
[Raptorize](http://zurb.com/playground/jquery-raptorize)
[Socket.IO](https://www.npmjs.com/package/socket.io)
[SwearJar](https://www.npmjs.com/package/swearjar)
[Unzip](https://www.npmjs.com/package/unzip)
