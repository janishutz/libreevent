# Settings

## 2FA
You can require the users to enable Two-Factor Authentication when confirming their email.
The following settings are available: 

Setting         | Explanation
----------------|-----------
always require  | Always require the user to use Two-Factor Authentication (will be enforced at account confirmation)
user can decide | Allow the user to decide if they want to enable Two-Factor Authentication (default, recommended)
disable         | Disable Two-Factor-Authentication entirely (only for users, root account still has 2FA enforced!)


## Currency
This setting allows you to change the currency in which you want your customers to pay. The code has to be a valid ISO 4217 currency code. See more [here](https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes) (Wikipedia). This setting defaults to USD.

## Ticket Timeout
The ticket timeout setting allows you to specify for how much time of inactivity the ticket is reserved for a user. The value is to be entered in seconds. The database is parsed every five minutes by default (can be changed in the config file) and, if the threshold set here is exceeded, the session is garbage collected and all tickets selected are returned to the available tickets pool.


## Payment gateway
### Select a gateway
With this setting, you can select the payment gateway to use. You may follow the link [here](https://libreevent.janishutz.com/docs/payments) to get more information on the payment gateway. You need to hit save to enable editing for the gateway settings.

### Gateway settings
Here you need to enter gateway specific settings to make them work. Do note, that some gateway plugins might crash libreevent on startup if these settings aren't entered, if you are using an unofficial plugin. All officially supported plugins will not crash it if the values entered are incorrect


# Admin Accounts
On this page you may add, modify or remove admin accounts. <!--Note that in order for you to see this page, you'll need to be logged in as the user root.-->

## Adding an account

<!-- ### Privileges
TODO: will be added in future version
libreevent features a privilege system where you can choose to what group of users you want to add a user you are currently creating. Possible values are:

Group           | Allowed settings
----------------|------------------
Root            | All pages. Can only be one account (the root account)
Admin           | Can access all pages and settings except for Admin Accounts
Event-Manager   | Access the events & pages page
Event-Handler   | Can log into the apps to do entry control -->

### Username
Give the user a username that can be used for internal recognition. It does not currently have any other use. 

### Email
An email address is required to allow the user to log in (it's their username) and for Two-Factor-Authentication.

### Password
The password of the admin account does not have any specific requirements (yet), but we strongly encourage you to follow these guidelines: 

Factor              | Requirement
--------------------|--------------------------------------------------
Length              | At least 15 characters
Special characters  | At least 2 required
Numbers             | At least 2 required
Upper / Lower case  | At least 2 upper & 2 lower case letters required

### 2FA
With this setting, you can choose one of three Two-Factor-Authentication modes, namely, disabled for no 2FA, Simple for one where the user has to verify the login by clicking a link in an email sent to them or Enhanced for one where the user has to enter a code after having opened up the link in the email sent to them.


## Modifying an account
You can update the username and the password of any admin account by clicking onto it. 


## Removing an account
You can delete an admin account by right clicking on it (yes, right click) and hit delete. Confirm again that you want to delete the account and then it's gone. 