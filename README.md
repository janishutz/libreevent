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

# Contributing
If you want to contribute to this project, please read more [here](https://myevent.janishutz.com/docs/contributing). Until the end of October 2023, no contributions can be accepted into master. 

# Supporting the project
If you like this project and it helped you save money, please consider donating to help fund the continuous development. If you are a company, please contact me [here](https://myevent.janishutz.com/docs/sponsoring) if you want to sponsor the project and become an official partner.

# Repository structure
- [assets/](/assets/): contains the logo (as png and GIMP file), also iOS and Android marketing materials, just global assets (images / videos)
- [dist/](/dist/): contains all files needed to run the app, set up correctly so you can just copy the folder.
- [src/](/src/): contains all of the source code of the project:
    - 
    - 
- [website/](/website/): contains all of the website files:
    - [website/dist/](/website/dist/): contains all the ready to distribute website files
    - [website/src/](/website/src/): contains all of the source files (markdown format) for the website. These files are converted into HTML by the build script.
- [package.js][/package.js]: collects all of the files of the project and copies them into the [dist/](/dist/) folder.
- [.eslintrc.js](/.eslintrc.js): ESlint config, the linter used for the project
- [.gitignore](/.gitignore): ignored files, currently is node_modules.

## This project is currently NOT ready to be used! 
Development of this project is currently ongoing and no stable version is available yet. 


## ROADMAP
The goal is to get this tool fully functioning by the End of September 2023.
