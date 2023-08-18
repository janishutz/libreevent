# Account view:

- create function that parses DB every 15 minutes and clears out junk --> Also update data in db when user goes to purchase to prevent clearing during purchase

- Require user to confirm email before purchasing

- Load all orders of customer from db when selecting tickets and save to memory to check if ticket count has been exceeded or not.


- Create function that updates currency for every event when updating currency.

- Update files to import when deploying for included json files instead of secret.json files

- Fix text field overflow (text too big for box)
- Other optimization for seat plan editor


- Implement Permission system

- Seat numbering!!


- FUTURE: Add Admin profile (page to change account settings per person like changing pwd)
- FUTURE add multi-language support
- FUTURE: Guest purchase
- FUTURE: add webpack (or any other minifying tool) to project website to decrease file size (OPTIONAL)