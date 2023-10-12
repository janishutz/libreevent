# Packaging
libreevent has a very simple packaging script built in, it's called package.sh and can be run on any bash-compatible shell. This is another thing that should be improved: Add a batch script for the same purpose, it makes Windows user's life so much easier! 

You can just run the script in a terminal by typing 
```
./package.sh
```
when in the main directory (Linux and MacOS only, requires installed Node.js and npm). 


# Setting up the development environment

To be able to work on libreevent, you need to have node.js and npm installed on your computer.

Then, to set up the development environment, run 
```
npm i
```

in the *src/server*, *src/webapp/main* and *src/webapp/setup* directories. This creates the *node_modules* folder in each of those directories. This is also what you need to do, if you want to upload the development version of libreevent. 