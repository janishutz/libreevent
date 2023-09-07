# Installation
Let's begin with setting up libreevent! If you are not technically savvy or want somebody else to set it up for you, please contact me [here](https://api.janishutz.com/contact/setup?origin=libreevent&campaign=installation-docs). If you want to set it up yourself, read on below! Soon, there will also be a video tutorial available.


# Selecting a webhosting company
Choosing the right hosting provider is not easy, especially since libreevent requires node.js. Therefore, we've listed a few really good options. Whatever hosting provider you end up going with, it is important that they explicitly list Node.js as a feature of that hosting account. All hosting providers below also include MySQL which is beneficial to have and a must-have when you are expecting to sell a lot of tickets simultaneously. This website here is hosted by asurahosting. *Note: I may receive a small commission when you buy webhosting using one of the links provided below. This won't affect the price you pay.*
https://clients.asurahosting.com/aff.php?aff=1997
https://www.novatrend.ch/en/
https://www.hostinger.com/
https://www.a2hosting.com/
https://www.hetzner.com/
https://www.digitalocean.com/

*Affiliate program*
https://affiliates.hostinger.com/users/signup/
https://www.a2hosting.com/about/affiliate-program/
https://www.digitalocean.com/go/affiliates


# Downloading libreevent
We are going to start off by downloading libreevent. On this website, open the navigation menu and head to "Downloads". (We would strongly suggest that you open the link in a new tab by right clicking on the link and hitting "Open in new tab"). Below, hit the download button. This will download a production ready build of libreevent as a zip file. Save it to any convenient location. Head there and extract the zip-Archive (On windows, right click, extract; On MacOS, just double click; on Linux, there is either a zip utility installed or otherwise use the unzip utility in the terminal).

## Database

TODO: Make it so that it's not necessary to mention this here.
In the database, all the userdata is stored. libreevent currently supports two different databases, MySQL and a custom database based on JSON. Which one to choose?

Generally MySQL, except:
- If your organisation is small and does only sell a few tickets at a time, the JSON based database works perfectly fine. 
- Your web hosting plan does not includes MySQL and you've got no access to MySQL in any other way. *NOTE: Free MySQL services should NEVER be used in such an application, as most hosting plans include MySQL (or MariaDB, which works similarly) which is much more reliable and if you lose access to the database, you can only access the root account and all other user data (and therefore all user accounts) is lost. The event data is always stored in JSON format as it is more efficient this way.*

**NOTE: The JSON database is really slow and should only be used if you have a small event where you expect to sell less than 5 ticket per minute! The amount of tickets sold per minute that the system can handle really depends on the speed of the server the website runs on.**

MySQL generally is more time consuming to set up, but we'll run you through the process here to make the process easier for you. 

If you are using the JSON-DB, continue reading:

Head into the folder you have downloaded libreevent into and open the "config" directory. In there you can see a few ".json" files. Open the "settings.config.json" file using a text editor (on Windows you could use Notepad, on MacOS TextEdit and on Linux, I personally like to use Nano or Vim, which are cli only or for graphical ones, use for example gedit).

In JSON, data is stored in so-called Key-Value-Pairs. Look for "db" in there and and replace the default "mysql" with "json". Keep this file and folder open and skip the next chapter.


## Setting up a MySQL database
At this point, we assume that you have already purchased webhosting and you are logged in to the administration panel of your webhosting provider. This guide will use the Web Control Panel called "Direct Admin", as it is fairly common, along with cPanel. Somewhere, there should be a button that says something like "MySQL Management". Click it, which will bring you to the MySQL-Database management page. Now, create a new database by clicking the "Create new database" (or similar) button which will bring up the database creation tool. Give the database any name you like and give the user any name you like. When creating a password, it is important that this password is long and complicated. What we recommend doing is using a password generator or to essentially "sit" onto your keyboard to get a random string of characters as the password. 

TODO: Make setup better (including db setup), add notes on setup key
Now copy this password and open the download location of libreevent. Inside of the libreevent folder and open the "config" folder and open the file called "db.config.json" using a text editor (on Windows you could use Notepad, on MacOS TextEdit and on Linux, I personally like to use Nano or Vim, which are cli only or for graphical ones, use for example gedit). Now, paste the password between the empty quotes after "password". For the host value type your domain, for the "database" parameter, type the name of the database you just created (including any prefixes shown there) and for the database user, type the username you just created (again, including any prefixes shown in the admin panel). 

Now hit "Create Database" to actually create the database.

And just like that, you have finished setting up your database.


# Uploading libreevent
It is now time to upload libreevent to your webhosting account. The recommended way of doing this is to download a FTP client like "FileZilla" and to connect to the hosting account in that way using the credentials provided by the hosting provider. In this guide we assume you use this way. 

Download and install FileZilla. It is a free and open source FTP client. Open it and you will see a few empty fields towards the top of the app. There you will need to fill in the information given by your hosting provider. Usually, the Host is ftp.yourDomain.com, the username and password are usually your admin account credentials and the port is usually 25552 or can be left empty. Then hit quick connect. At this point, a SSL warning might appear, as the certificate might not (yet) be configured correctly to also include FTP. Accept the certificate and you should be connected. 

Now create a new folder called "libreevent" by right clicking onto the empty space on the right pane (where it says "remote site") and selecting "create directory". Then on the left side (where it says "local side" navigate to the extracted libreevent folder and upload its contents by selecting it and right clicking to hitting "Upload"). Once that process is completed, you should be set to go to the next session.

**IMPORTANT:** Never upload libreevent into any public_html folders ever! This poses a SEVERE security risk and, if a JSON database is used, exposes ALL userdata to the internet! Always upload to a non-publicly accessible folder!


## npm install
This project relies on a variety of different node.js modules that need to be installed on the server. Most webhosting providers give you an easy way to run *npm install*. If not, you might be required to upload the *node_modules* folder yourself. You can create such a folder either by downloading the *node_modules.zip* folder from the GitHub releases page or by installing npm on your local machine and then by running *npm i* in the terminal. 

To set up the node application in most hosting providers, head to the admin panel of your hosting account once again. Navigate to the main page and scroll down until you find something that says "Setup Node.js App". Click it and wait for it to load. Click "Create Application" and select the newest available Node.js version and set the Application mode to "Production". For the application root insert the directory name which you have created just before when uploading.

For the Application URL field, click onto "Choose any value" and select an appropriate domain. 

For the Application startup file type "app.js".

In the section "Environment variables" hit "Add Variable" and in the appearing fields type beneath "Name" the following: "PORT" (without the quotes!) and under "Value" "8080" (again without quotes). Then hit done and at the top "create". If you end up on the start page again, hit the little pencil icon to get to the application editor. Scroll down to the "Detected configuration files" section and click "Run NPM Install". Once it shows a success message (at the top!), hit "Restart". 

CONGRATULATIONS! You are all set with the installation of libreevent! Now open a new tab in your webbrowser and type your domain name. If you can connect to your domain and libreevent is accessible, you are all set!

# Troubleshooting
Here are some tips for the most common problems that might arise from the installation

## Not accessible, but running
Some with some webhosting companies you need to remove the index.html file from the public_html directory of the domain you are running libreevent on. 

## Can access all libreevent backend files
You have most likely uploaded libreevent into the public_html file which you should NEVER do, as it poses an insane security risk. Delete it from that folder and put it into a different folder which is not publicly accessible. 

## libreevent doesn't start
On most webhosting accounts, there's a file created in the directory of libreevent called something like stderr.log. Have a look at that file and compare errors with the ones listed here:

### DB HAS TO USE InnoDB!
The MySQL database you are using is not supported by libreevent or is incorrectly configured. Please ensure that InnoDB is enabled. If you cannot enable it yourself, please contact the DB hosting provider.

### ERR_ENCODING_NOT_SUPPORTED
If this error occurs, most likely, the Node.js build of your hosting provider is set to small-icu mode, meaning some localizations are missing, one of which is ascii, which is required by the pdf generator that libreevent uses. To resolve this, please contact the support team of your web hosting company and ask them to enable full-icu for you. 

### Any other error
Please click [here](https://github.com/simplePCBuilding/libreevent/issues/new) to head to GitHub and open a new issue. You will need to have a GitHub Account to open an issue. If you don't have a GitHub account, you may also contact me using my [Bug reporting tool](https://api.janishutz.com/contact/report?origin=libreevent?error=unkown?lang=en).