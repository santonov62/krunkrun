KRUNKER BOT SERVER
=============================

It's app for auto start Krunker game server through telegram bot message.

> Krunker - first person web shooter in web browser.
> [www.krunker.io](http://www.krunker.io)


REQUIREMENTS
------------

NodeJs 12.x.x or higher
    
    curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
    n lts


INSTALLATION
------------

     npm i

QUICK START
-----------

    KRUN_KRUN_TOKEN="12345678:QWERTYUIOPASFDHJKLZXCVBNM" GAME_TIME="10" npm run app

KRUN_KRUN_TOKEN - telegram bot token
GAME_TIME - Game time in minutes 

BOT COMMANDS
-----------

    "го" - start game


HEROKU DEPLOY [GitHub]
-----------

1. Login to[www.heroku.com](https://heroku.com/)
2. New -> Create new app
3. Deploy -> Deployment method = `GitHub` -> Connect to GitHub -> repo-name -> Connect
4. Settings -> Buildpacks
    * Add build pack -> `heroku/nodejs`
    * Add build pack -> `https://buildpack-registry.s3.amazonaws.com/buildpacks/jontewks/puppeteer.tgz`
5. Settings -> Config Vars - Reveal Config Vars
    * Add `HEADLESS = 1` 
    * Add `KRUN_KRUN_TOKEN = Your telegram token` 
    * Add `GAME_TIME = 10` 


The 406 Developers Team