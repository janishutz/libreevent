# Settings

## 2FA
libreevent offers two different 2fa modes: 
- Standard mode: The user has to click on a link that was sent to him via email. He'll automatically be logged in as soon as the page loads.
- Enhanced mode: The user has to click on a link that was sent to him via email and then has to confirm it by entering the code that is shown to him on the 2FA page. After that he'll automatically be logged in.

In both modes, the system informs the user about the IP address that tried to log into the account.

This setting can be changed individually for admin and user accounts and 2FA can be disabled entirely. It is highly encouraged to enable this at least for the admin accounts and for user accounts set the requirement to 'User-defined' or 'Always required' instead of 'Disabled'. 

## User account passwords
Here you may set password requirements for the user accounts. The system will always be offering the users to generate a password that is strong for them to facilitate the process of setting a password.


## Change organisation name
This should be self explanatory, but keep in mind that this change will only take effect after the next restart of the node app.


# Admin Accounts
On this page you may add, modify or remove admin accounts. Note that in order for you to see this page, you'll need to be logged in as the user root.

## Adding an account

### Privileges
libreevent features a privilege system where you can choose to what group of users you want to add a user you are currently creating. Possible values are:

Group           | Allowed settings
----------------|------------------
Root            | All pages. Can only be one account (the root account)
Admin           | Can access all pages and settings except for Admin Accounts
Event-Manager   | Access the events & pages page
Event-Handler   | Can log into the apps to do entry control


### Email
An Email address is required for account activation and to recover a password in case it gets lost. The system will automatically send an activation email so the user can confirm that the email address is valid. 


### 2FA
With this checkbox you can choose if this user needs to do two factor authentication, meaning, if the user needs to authorise the login using a link. In the [Settings](&/admin-panel/settings#2fa) you may choose between the two different 2FA modes that libreevent offers.


## Modifying an account

## Removing an account