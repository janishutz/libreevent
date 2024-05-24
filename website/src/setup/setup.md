# Setup of libreevent
At this point we assume you've completed the initial installation of libreevent. If not, you may find a guide on how to do it [here](&/setup/installation). Let's get started setting up your event management system!

## Connecting to the server
As discussed in the previous part where we installed the system, you can connect to your server simply by opening a web browser and typing your domain name into the address field. After that you should be greeted by the libreevent post-install landing page. Once there, you'll need the setup key you defined during the installation. Type (or copy) it into the field and hit "Start setup". You will now land on the setup start page. You may hit "Start setup" below to start the setup.

*Note: This is only available during the setup process of libreevent and will afterwards be deactivated to ensure safety of the system.*

## Basic Setup
This page prepares libreevent for use, covering all the basics, the name of the website, database and email accounts.
The first setting you may change here is the name of the website. Choose wisely, as changing the name at a later point is hard, not explained in the documentation and also doesn't make for a good image.

### Database
In the database, all the user data is stored. libreevent currently supports two different databases, MySQL and a custom database based on JSON. Which one to choose?

Generally MySQL, except:
- If your organization is small and does only sell a few tickets at a time, the JSON based database can be an easy to set up alternative. 
- Your web hosting plan does not include MySQL, and you've got no access to MySQL in any other way. *NOTE: Free MySQL services should NEVER be used in such an application, as most hosting plans include MySQL (or MariaDB, which works similarly) which is much more reliable and if you lose access to the database, you can only access the root account and all other user data (and therefore all user accounts) is lost. The event data is always stored in JSON format as it is more efficient this way.*

**NOTE: The JSON database is really slow and should only be used if you have a small event where you expect to sell less than 10 tickets per minute at any time! The amount of tickets sold per minute that the system can handle really depends on the speed of the server the website runs on.**

MySQL generally is more time-consuming to set up (taking about ten minutes compared to zero), but we'll run you through the process here to make the process easier for you. 

If you are really sure that you want to use the JSON-based database, skip the next section.


### Setting up a MySQL database
At this point, we assume that you are logged in to the administration panel of your webhosting provider. This guide will use the Web Control Panel called "Direct Admin", as it is fairly common, along with cPanel. Somewhere, there should be a button that says something like "MySQL Management". Click it, which will bring you to the MySQL-Database management page. Now, create a new database by clicking the "Create new database" (or similar) button which will bring up the database creation tool. Give the database any name you like (libreevent would though be a reasonable choice) and give the user any name you like. When creating a password, it is important that this password is long and complicated. What we recommend doing is using a password generator or to essentially "sit" onto your keyboard to get a random string of characters as the password. 

Now copy this password and head back to the libreevent setup page. In the "Database host name" field, change the domain, if libreevent hasn't recognized the correct one automatically (do not enter the protocol (like http:// or https://) in the host name field!). Under "database name", enter the name you just entered before when creating the database (including any prefixes shown there) and for the "database user" field, type the username you just created (again, including any prefixes shown in the admin panel). Now paste the password you just copied before into the "Password" field. The port should usually be fine.

Now head back to the admin panel of the webhosting provider. Hit "Create Database" to actually create the database.

And just like that, you have finished setting up your database.

### Email
libreevent needs to have access to an email address to be able to send emails to customers. In the "Account" section, you need to enter the mail connection details. You only need the data for the outgoing mail server, namely for a SMTP server, as this is what libreevent uses. 

In the "display" section, you can customize how the email address shows up for customers. What we are doing here is known as email address spoofing, if you change what email address is shown. This is being shunned actively by some email providers, which means, the value entered in the "Email address to show" field should be the same as the actual email address. For the display name, you can get creative. 

With the main part of setup complete, hit continue, to advance to root account setup.

## Root account
This is the most powerful account in this system. From it, you can control EVERY aspect of your system. 

<!-- **Remark: You may (and definitely should) add other accounts with less privileges after completing setup and only use the root account when it is actually necessary** -->

Please choose an email address to which you want to link the root account. Two-Factor-Authentication is ALWAYS required when logging into an account that has root privileges to ensure a higher degree of security, so please ensure you have access to that email address at all times.

When choosing a password, please ensure it meets the minimum requirements of the system or let the system generate one for you by clicking the 'generate password' button, which will generate a password that fulfils all requirements and exceeds the minimum requirements for password length. In the table below, you may see all the password requirements:

Factor              | Requirement
--------------------|--------------------------------------------------
Length              | At least 15 characters
Special characters  | At least 2 required
Numbers             | At least 2 required
Upper / Lower case  | At least 2 upper & 2 lower case letters required

Please avoid using easy to guess combinations like names & birthdates of you or your relatives, postcodes & cities and obvious words like 'password', 'libreevent', 'admin', 'root' and your organization / event's name.

After this, the system will email you an email confirmation link using the email you've previously configured in the config.json file during installation.

## Setup complete
With this, you've completed the setup of the event. We now ask you to restart the node application. You may do this by stopping the process (if logged in via SSH, press Ctrl + C, if you've got a graphical user interface for setting up the node app, it should be self-explanatory) and restarting it.

libreevent already gives you the link to the admin panel, which you can click, but if you already closed the page, here's how to reach it:

*You can find your admin panel at /admin (example: libreevent.janishutz.com/admin, replace libreevent.janishutz.com with your own domain).*

**Congratulations! You've now successfully set up your event management solution.**

*You may find documentation on the admin panel [here](&/admin-panel/)*