#
#				libreevent - package.sh
#
#	Created by Janis Hutz 10/12/2023, Licensed under the GPL V3 License
#			https://janishutz.com, development@janishutz.com
#
#

v="V1.0.0"

echo "
 _ _ _                                   _   
| (_) |                                 | |  
| |_| |__  _ __ ___  _____   _____ _ __ | |_ 
| | | '_ \\| '__/ _ \\/ _ \\ \\ / / _ \\ '_ \\| __|
| | | |_) | | |  __/  __/\\ V /  __/ | | | |_ 
|_|_|_.__/|_|  \\___|\\___| \\_/ \\___|_| |_|\\__|
                                             
                                             


    -------------------------------

    ==> Preparing packages for libreevent


"

echo "  

==> Compiling setup... <==

"

sleep 0.5

cd src/webapp/setup
npm i
npm run build

echo " 

==> Compiling main webapp... <==

"

sleep 0.5

cd ../main


npm i
npm run build

echo " 

==> Resetting databases <==

"

sleep 1

cd ../../server
node prepareDB.js

sleep 1

echo " 

==> Collecting files to archive <==

"

sleep 1

cd ../../

rm -rf dist/
mkdir dist/

cd dist

shopt -s extglob
cp -r ../src/server/!(node_modules) .

rm webapp
mkdir webapp
mkdir webapp/main
mkdir webapp/setup

cp -rv ../src/webapp/main/dist ./webapp/main/dist
cp -rv ../src/webapp/setup/dist ./webapp/setup/dist
rm .gitignore
rm prepareDB.js
rm test.js
rm config/*.secret.json
rm backend/plugins/payments/*/*.secret.json
echo "agdhgasjlgagaldusaglueagelwadgl" >> setupkey.txt

echo " 

==> Collected files to archive <==
==> Archiving... <==

"

sleep 1

cd ..
zip -9r libreevent-$v-prebuilt.zip dist

echo " 

==> Created prebuilt archive <==
==> Creating archive for node_modules <==

"

sleep 1

cd src/server
npm i
cd ../../
zip -9r libreevent-$v-npm.zip src/server/node_modules

echo " 

==> Created npm archive <==
==> Creating archive for full-icu package.json <==

"

sleep 1

cd src/server
npm i full-icu
cd ../../

zip -9r libreevent-$v-full-icu.zip src/server/package.json src/server/package-lock.json

cd src/server
npm uninstall full-icu

cd ../../
rm -rf dist

echo " 

 _ _ _                                   _   
| (_) |                                 | |  
| |_| |__  _ __ ___  _____   _____ _ __ | |_ 
| | | '_ \\| '__/ _ \\/ _ \\ \\ / / _ \\ '_ \\| __|
| | | |_) | | |  __/  __/\\ V /  __/ | | | |_ 
|_|_|_.__/|_|  \\___|\\___| \\_/ \\___|_| |_|\\__|
                                             
                                             


    -------------------------------

    ==> Done
    ==> Successfully packaged libreevent $v

    Next steps: 
        - Check that everything was packaged correctly
        - Create a release on GitHub

"