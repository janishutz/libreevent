# Design Guidelines

Everything in libreevent should be designed in a way that puts legibility and ease of use as its priority, instead of opting for special effects that are, undeniably, nice, but do not contribute to improved usability and, as every effect needs some lines of code, also wastes bandwidth that is very limited if a lot of people access the sites simultaneously. 

All color used in libreevent should be a color variable that is defined in the App.vue files which means those colors can be changed easily in the future or as part of switching to dark mode. When designing something, please avoid adding more colors whenever possible.