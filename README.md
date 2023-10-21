<div id="title" align="center">
    <img src="./assets/logo.png" width="300">
    <h1>libreevent</h1>
</div>

<div id="badges" align="center">
    <img alt="Project License" src="https://img.shields.io/github/license/simplePCBuilding/libreevent.svg">
    <img alt="GitHub Repo size" src="https://img.shields.io/github/repo-size/simplePCBuilding/libreevent.svg">
    <img alt="Project code lines count" src="https://img.shields.io/tokei/lines/github/simplePCBuilding/libreevent">
    <img alt="GitHub Repo issues" src="https://img.shields.io/github/issues-pr-raw/simplePCBuilding/libreevent">
    <img alt="Top Languages" src="https://img.shields.io/github/languages/top/simplePCBuilding/libreevent">
    <img alt="GitHub Repo filecount" src="https://img.shields.io/github/directory-file-count/simplePCBuilding/libreevent.svg">
    <br>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/simplePCBuilding/libreevent">
    <img alt="GitHub watchers" src="https://img.shields.io/github/watchers/simplePCBuilding/libreevent">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/simplePCBuilding/libreevent">
    <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/simplePCBuilding/libreevent">
    <br>
    <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/simplePCBuilding/libreevent/total?label=Downloads (total)">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/downloads/simplePCBuilding/libreevent/latest/total?label=Downloads (latest)">
    <img alt="Latest release" src="https://img.shields.io/github/release/simplePCBuilding/libreevent.svg">
    <img alt="App Version" src="https://img.shields.io/github/package-json/v/simplePCBuilding/libreevent.svg?label=Development Version">
</div>

A fully featured, free and open source event management solution you can host yourself, to manage your event and sell tickets. All you need is a webserver that can run node.js!

Visit the project's [website](https://libreevent.janishutz.com)

libreǝvent IS FREE SOFTWARE. IT IS PROVIDED "AS IS" AND AS SUCH COMES WITH ABSOLUTELY NO WARRANTY TO THE EXTENT PERMITTED BY APPLICABLE LAW. If anything does not work, please report it back, but do not expect it to be fixed immediately, as this software is developed by volunteers in their free time.

# Download
You may download this project using the GitHub releases page or the direct links on the [libreevent website](https://libreevent.janishutz.com/download) as this only downloads the ready-to-distribute version, not the development version.
Alternatively, you may download the project directly from GitHub (by cloning it or downloading the code) but you'll have to compile and package the project [manually](https://libreevent.janishutz.com/docs/contributing/packaging).

# System requirements
- node.js V16.0+
- npm
- (OPTIONAL) MySQL
- any CPU from the last 10 years
- Any operating system that can run node.js

# Contributing
If you want to contribute to this project, please read more [here](https://libreevent.janishutz.com/docs/contributing). Until the end of October 2023, no contributions can be accepted into master. 

# Supporting the project
If you like this project and it helped you save money, please consider donating to help fund the continuous development. If you are a company, please contact me [here](https://libreevent.janishutz.com/docs/sponsoring) if you want to sponsor the project and become an official partner.

# Repository structure
- [assets/](/assets/): contains the logo (as png and GIMP file), also iOS and Android marketing materials, just global assets (images / videos)
- [src/](/src/): contains all of the source code of the project:
    - [src/apps](/src/apps/): contains the source code of the iOS and Android app.
    - [src/server](/src/server/): contains the source code for the node.js application that runs on the server side.
    - [src/webapp](/src/webapp/): contains the source code for the frontend, contains lots of vue files.
- [website/](/website/): contains all of the website files:
    - [website/dist/](/website/dist/): contains all the ready to distribute website files
    - [website/src/](/website/src/): contains all of the source files (markdown format) for the website. These files are converted into HTML by the build script.
- [package.sh](/package.sh): collects all of the files of the project and copies them into the [dist/](/dist/) folder. It also automatically compiles the webapps and removes unnecessary files as well as resetting the databases and settings to the defaults. 
- [.eslintrc.js](/.eslintrc.js): ESlint config, the linter used for the project. Before starting a PR, make sure the linter is happy!
- [notes.md](./notes.md): Project notes, including future plans for it.

You may notice some additional folders appearing after running 
```
npm run package
```
This is to shrink the repository size. Distribution ready files can be found in the releases or on our [website](https://libreevent.janishutz.com/download).
