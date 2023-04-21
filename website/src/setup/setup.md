# Setup of myevent
At this point we assume you've completed the initial install of myevent. If not, you may find a guide on how to do it [here](&/setup/getting-started). Let's get started setting up your event management system!

## Connecting to the server
As discussed in the previous part where we installed the system, you can connect to your server simply by opening a web browser and typing your domain name into the address field. After that you should be greeted by the myevent post-install landing page. Once there, you'll need the setup key you defined during the installation. Type it into the field and hit "Start setup".

*Note: This is only available during the setup process of myevent and will afterwards be deactivated to ensure safety of the system.*

## Root account
This is the most powerful account in this system. From it you can control EVERY aspect of your system. 

**Remark: You may (and definitely should) add other accounts with less privileges after completing setup and only use the root account when it is actually necessary**

Please choose an email address to which you want to link the root account. Two-Factor-Authentication is ALWAYS required when logging into an account that has root privileges to ensure a higher degree of security, so please ensure you have access to that email address at all times.

When choosing a password, please ensure it meets the minimum requirements of the system or let the system generate one for you by clicking the 'generate password' button, which will generate a password that fulfills all requirements and exceeds the minimum requirements for password length. In the table below, you may see all the password requirements:

Factor              | Requirement
--------------------|--------------------------------------------------
Length              | At least 15 characters
Special characters  | At least 2 required
Numbers             | At least 2 required
Upper / Lower case  | At least 2 upper & 2 lower case letters required

Please avoid using easy to guess combinations like names & birth dates of you or your relatives, zip codes & cities and obvious words like 'password', 'myevent', 'admin', 'root' and your organisation / event's name.

After this, the system will email you an email confirmation link using the email you've previously configured in the config.json file during installation.

## Page setup
After having set up the root account and confirmed the email address, it is now time to set the name of the webpage. For this, you'll need to enter your organisation's name and choose the offered languages. Note that for every language you select, you need to add a promotional text. Please select a homepage template from [here](&/homepage/templates). You also have to upload an/some image(s) at this stage, if the selected template requires (an) image(s).


## Payment methods
Now it is time to set up some payment methods. You may find advantages / disadvantages of each payment gateway [here](&/payments). It is advised to only choose one payment gateway which provides lots of different payment options, but cost of usage can also be a factor to consider. You may add more payment options by downloading a plugin through the plugin installer in the admin panel. *Note: You'll have to restart the node app whenever you install a new plugin!*

## Event setup
With payment methods sorted, you now have to add an event. For this, you'll need to create tickets by hitting the plus icon. 

## TOS
This is an optional step. Here you may add your own terms of services (TOS), next to the ones that are given by myevent itself. Your TOS will be inserted at the top.

## Setup complete
With this, you've completed the setup of the event. We now ask you to restart the node application. You may do this by stopping the process (if logged in via SSH, press Ctrl + C, if you've got a graphical user interface for setting up the node app, it should be self explanatory) and restarting it as described [here](&/setup/installation#starting).


**Congratulations! You've now successfully set up your event management solution. You may now log into the admin panel. You can find your admin panel at /admin (example: myevent.janishutz.com/admin, replace myevent.janishutz.com with your own domain).**

*You may find documentation on the admin panel [here](&/admin-panel/)*