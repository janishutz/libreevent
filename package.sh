#
#				libreevent - package.sh
#
#	Created by Janis Hutz 10/12/2023, Licensed under the GPL V3 License
#			https://janishutz.com, development@janishutz.com
#
#

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

==> Collecting files to archive <==

"

sleep 1

cd ../../

mkdir dist/

cd dist

cp -r ../src/server .

ls