# Plugins

libreevent features extensive plugin support, with all internal libreevent libraries also working together with plugins. This though poses a potential risk if the user is installing harmful plugins. This is why there is a curated list of secure plugins that the users might use [here](/plugins). Note that with one of the next major versions, libreevent's plugin API will change and break all plugins in their current form.

# Plugin installation

**Installing plugins currently isn't easy. We expect you to know how to upload files to a server. If you don't know, a guide on how to upload things can be found in the setup guide which is meant for beginners**

## Acquiring the plugins
You can find a list of plugins that libreevent supports [here](/plugins). Choose one and click it to be directed to the download page. 

## Installing payment gateway plugins
You can install a new plugin by navigating to the libreevent directory on the server and then by navigating to */backend/plugins/payments* and uploading the plugin folder into there. Now, restart libreevent.

## Installing other plugins
You can install a new plugin by navigating to the libreevent directory on the server and then by navigating to */backend/plugins/others* and uploading the plugin folder into there. Now, restart libreevent.