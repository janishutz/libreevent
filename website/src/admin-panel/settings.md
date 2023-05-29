# Settings

## 2FA
libreevent offers two different 2fa modes: 
- Standard mode: The user has to click on a link that was sent to him via email. He'll automatically be logged in as soon as the page loads.
- Enhanced mode: The user has to click on a link that was sent to him via email and then has to confirm it by entering the code that is shown to him on the 2FA page. After that he'll automatically be logged in.

In both modes, the system informs the user about the IP address that tried to log into the account.

This setting can be changed individually for admin and user accounts and 2FA can be disabled entirely. It is highly encouraged to enable this at least for the admin accounts and for user accounts set the requirement to 'User-defined' or 'Always required' instead of 'Disabled'. 

## User account passwords
Here you may set password requirements for the user accounts. The system will always be offering the users to generate a password that is strong for them to facilitate the process of setting a password.

## Guest purchase
Choose if a user may purchase a ticket without creating an account. An email address is always required as the system sends the tickets via email to the customers for easier access.

## Allow overbooking
Activate this and set a percentage of overbooking, if you want to enable overbooking of the event to ensure that every single spot is occupied even if somebody does not show up. Use is strongly discouraged and currently only works with events that have no seating plan.

## Special requirements
Here you may set a special requirement that a person booking a ticket has to fulfill, like the email address has to be ending in @yourdomain.com or they need to live in a certain street / town / city / country in order for them to be allowed to buy a ticket. You may also require that they provide a certain number, code or similar. Finally, you may choose to limit the amount of tickets a single person may reserve. 


## Change organisation name
This should be self explanatory, but keep in mind that this change will only take effect after the next restart of the node app.