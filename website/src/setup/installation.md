# Installation
Let's begin with setting up myevent! If you are not technically savvy or want somebody else to set it up for you, please contact me [here](https://api.janishutz.com/contact/setup?origin=myevent&campaign=installation-docs). If you want to set it up yourself, read on below!


# Selecting a webhosting company
Choosing the right hosting provider is not easy, especially since myevent requires node.js. Therefore, we've listed a few really good options. This website here is hosted by asurahosting. *Note: I may receive a small commission when you buy webhosting using one of the links provided below. This won't affect the price you pay.*
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

## Database
In the database, all the userdata is stored. myevent currently supports two different databases, MySQL and a custom database based on JSON. Which one to choose?

Generally MySQL, except:
- If your organisation is small and does only sell a few tickets at a time, the JSON based database works perfectly fine. 
- Your web hosting plan does not includes MySQL and you've got no access to MySQL in any other way. *NOTE: Free MySQL services should NEVER be used in such an application, as most hosting plans include MySQL which is much more reliable and if you lose access to the database, you can only access the root account and all other data (and therefore all user accounts) is lost.*

MySQL generally is more difficult to set up, but we'll run you through the process here to make the process easier for you. If you chose the JSON based database, skip ahead to the next chapter.