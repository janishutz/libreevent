<div id="title" align="center">
    <img src="./assets/logo.png" width="300">
    <h1>myevent</h1>
</div>

<div id="badges" align="center">
    <img src="https://img.shields.io/github/release/simplePCBuilding/myevent.svg">
    <img src="https://img.shields.io/github/license/simplePCBuilding/myevent.svg">
    <img src="https://img.shields.io/github/repo-size/simplePCBuilding/myevent.svg">
    <img src="https://img.shields.io/tokei/lines/github/simplePCBuilding/myevent">
    <img src="https://img.shields.io/github/directory-file-count/simplePCBuilding/myevent.svg">
    <img src="https://img.shields.io/github/package-json/v/simplePCBuilding/myevent.svg">
</div>

A fully featured, fully free and open source event management solution you can host yourself, to manage your event and sell tickets. All you need is a webserver that can run node.js!

Visit our [website](https://myevent.janishutz.com)

# System requirements
- node.js V16.0+
- npm
- (OPTIONAL) MySQL
- any CPU from the last 10 years
- Any operating system that can run node.js

# Download
You may download this project using the GitHub releases page or the direct links on the [myevent website](https://myevent.janishutz.com/download) as this only downloads the ready-to-distribute version, not the development version.
Alternatively, you may download the project directly from GitHub (by cloning it or downloading the code) but you'll have to compile and package the project [manually](https://myevent.janishutz.com/docs/contributing/packaging).

# Contributing
If you want to contribute to this project, please read more [here](https://myevent.janishutz.com/docs/contributing). Until the end of October 2023, no contributions can be accepted into master. 

# Supporting the project
If you like this project and it helped you save money, please consider donating to help fund the continuous development. If you are a company, please contact me [here](https://myevent.janishutz.com/docs/sponsoring) if you want to sponsor the project and become an official partner.

# Repository structure
- [assets/](/assets/): contains the logo (as png and GIMP file), also iOS and Android marketing materials, just global assets (images / videos)
- [src/](/src/): contains all of the source code of the project:
    - [src/apps](/src/apps/): contains the source code of the iOS and Android app.
    - [src/server](/src/server/): contains the source code for the node.js application that runs on the server side.
    - [src/webapp](/src/webapp/): contains the source code for the frontend, contains lots of vue files.
- [website/](/website/): contains all of the website files:
    - [website/dist/](/website/dist/): contains all the ready to distribute website files
    - [website/src/](/website/src/): contains all of the source files (markdown format) for the website. These files are converted into HTML by the build script.
- [package.js](/package.js): collects all of the files of the project and copies them into the [dist/](/dist/) folder. It also minifies the files in the process to reduce package size.
- [.eslintrc.js](/.eslintrc.js): ESlint config, the linter used for the project
- [.gitignore](/.gitignore): ignored files, currently is node_modules & log files.

You may notice some additional folders appearing after running 
```
npm run package
```
This is to shrink the repository size. Distribution ready files can be found in the releases or on our [website](https://myevent.janishutz.com/download).

## This project is currently NOT ready to be used! 
Development of this project is currently ongoing and no stable version is available yet. 


## ROADMAP
The goal is to get this tool fully functioning by the End of September 2023.
