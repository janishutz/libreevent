# Installation
Let's begin with setting up libreevent! If you are not technically savvy or want somebody else to set it up for you, please contact me [here](https://support.janishutz.com/index.php?a=add&category=8). If you want to set it up yourself, read on below!


# Selecting a webhosting company
Choosing the right hosting provider is not easy, especially since libreevent requires node.js. Therefore, we've listed a few excellent options. Whatever hosting provider you end up going with, it is important that they explicitly list Node.js as a feature of that hosting account. All hosting providers below also include MySQL which is beneficial to have and a must-have when you are expecting to sell a lot of tickets simultaneously. This website here is hosted by asurahosting. *Note: I may receive a small commission when you buy webhosting using one of the links provided below. This won't affect the price you pay.*
- [asurahosting](https://clients.asurahosting.com/aff.php?aff=1997)
- [novatrend](https://www.novatrend.ch/en/)
- [hetzner](https://www.hetzner.com/) (though make sure that you have a sufficiently high-end account!)

<!-- *Affiliate programs: TODO: Sign up*
https://affiliates.hostinger.com/users/signup/
https://www.a2hosting.com/about/affiliate-program/
https://www.digitalocean.com/go/affiliates -->


# Downloading libreevent
We are going to start off by downloading libreevent. On this website, open the navigation menu and head to "Downloads". (We would strongly suggest that you open the link in a new tab by right-clicking on the link and hitting "Open in new tab"). Below, hit the download button. This will download a production ready build of libreevent as a zip file. Save it to any convenient location. Head there and extract the zip-Archive (On Windows, right click, extract; On MacOS, just double click; on Linux, there is either a zip utility installed or otherwise use the `unzip` utility in the terminal).


# Defining a setup key
libreevent uses what we call a setup key. You need to set this manually, as it needs to be different for every install because otherwise the whole point of this setup key is to prevent unauthorized access to the setup program. The setup will be disabled once you have first completed it. 

To set the setup key, navigate to the extracted libreevent folder and open it. In there you should find a file called "setupkey.txt". Open it up and add any random assortment of characters and numbers in there. What we recommend is that you just roll your hand over your keyboard in any way you like as this generates a very much unpredictable assortment of characters. Then, hit Ctrl + S (or Command + S on MacOS) to save the file. We would recommend leaving this file open, as you will need the setup key at a later point. 


# Uploading libreevent
It is now time to upload libreevent to your webhosting account. The recommended way of doing this is to download an FTP client like "FileZilla" and to connect to the hosting account in that way using the credentials provided by the hosting provider. In this guide we assume you use this way. 

Download and install FileZilla [for Windows (64-bit)](https://filezilla-project.org/download.php?platform=win64), [for MacOS](https://filezilla-project.org/download.php?platform=osx) or for Linux (available in all major distro repos). It is a free and open source FTP client. Open it, and you will see a few empty fields towards the top of the app. There you will need to fill in the information given by your hosting provider. Usually, the Host is ftp.yourDomain.com, the username and password are usually your admin account credentials and the port is usually 25552 or can be left empty. Then hit quick connect. At this point, an SSL warning might appear, as the certificate might not (yet) be configured correctly to also include FTP. Accept the certificate and you should be connected. 

Now create a new folder called "libreevent" by right-clicking onto the empty space on the right pane (where it says "remote site") and selecting "create directory". Then on the left side (where it says "local side" navigate to the extracted libreevent folder and upload its contents by selecting it and right-clicking to hitting "Upload"). Once that process is completed, you should be set to go to the next session.

**IMPORTANT:** Never upload libreevent into any public_html folders ever! This poses a SEVERE security risk and, if a JSON database is used, exposes ALL user data to the internet! Always upload to a non-publicly accessible folder!


## npm install
This project relies on a variety of different node.js modules that need to be installed on the server. Most webhosting providers give you an easy way to run *npm install*. If not, you might be required to upload the *node_modules* folder yourself. You can create such a folder either by downloading the *node_modules.zip* folder from the Download page or by installing npm on your local machine and then by running *npm i* in the terminal. 

To set up the node application in most hosting providers, head to the admin panel of your hosting account once again. Navigate to the main page and scroll down until you find something that says "Setup Node.js App". Click it and wait for it to load. Click "Create Application" and select the newest available Node.js version and set the Application mode to "Production". For the application root insert the directory name which you have created just before when uploading.

For the Application URL field, click onto "Choose any value" and select an appropriate domain. 

For the Application startup file type "app.js".

In the section "Environment variables" hit "Add Variable" and in the appearing fields type beneath "Name" the following: "PORT" (without the quotes!) and under "Value" "8080" (again without quotes). Then hit done and at the top "create". If you end up on the start page again, hit the little pencil icon to get to the application editor. Scroll down to the "Detected configuration files" section and click "Run NPM Install". Once it shows a success message (at the top!), hit "Restart". 

CONGRATULATIONS! You are all set with the installation of libreevent! Now open a new tab in your web browser and type your domain name. If you can connect to your domain and libreevent is accessible, you are all set!

You may now continue reading the [Setup guide](&/setup/setup)


# Troubleshooting
Here are some tips for the most common problems that might arise from the installation

## A placeholder is shown
With some webhosting companies you need to remove the index.html file from the public_html directory of the domain you are running libreevent on. 

## Can access all libreevent backend files
You have most likely uploaded libreevent into the public_html file which you should NEVER EVER do, as it poses an insane security risk. Delete it from that folder and put it into a different folder which is not publicly accessible. 

## libreevent doesn't start
On most webhosting accounts, there's a file created in the directory of libreevent called something like stderr.log. Have a look at that file and compare errors with the ones listed here:

### DB HAS TO USE InnoDB!
The MySQL database you are using is not supported by libreevent or is incorrectly configured. Please ensure that InnoDB is enabled. If you cannot enable it yourself, please contact the DB hosting provider.

### ERR_ENCODING_NOT_SUPPORTED
If this error occurs, most likely, the Node.js build of your hosting provider is set to small-icu mode, meaning some localizations are missing, one of which is ascii, which is required by the pdf generator that libreevent uses. To resolve this, you will need to download a special package.json file and add two (more) environment variables:
- For the package.json file, download it from [here](https://api.janishutz.com/download/libreevent?v=latest&type=icu)
- For the environment variables, add the following: 
```
NODE_ICU_DATA=./node_modules/full-icu
FULL_ICU_PREFER_NPM=true
```
![EnvVars](/assets/environmentVariables.png)

### Any other error
Please click [here](https://github.com/simplePCBuilding/libreevent/issues/new) to head to GitHub and open a new issue. You will need to have a GitHub Account to open an issue. If you don't have a GitHub account, you may also contact me using my [Bug reporting tool](https://support.janishutz.com/index.php?a=add&category=9).