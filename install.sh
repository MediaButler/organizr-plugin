#!/bin/sh

ORGANIZR_PATH=/config/www

echo "Organizr-MediaButler Plugin Installer - v0.1"
cp ./api/mediabutler.php $ORGANIZR_PATH/api/plugins/api/
cp ./config/mediabutler.php $ORGANIZR_PATH/api/plugins/config/
cp ./js/mediabutler.js $ORGANIZR_PATH/api/plugins/js/
cp ./images/mediabutler.png $ORGANIZR_PATH/plugins/images/
cp ./mediabutler.php $ORGANIZR_PATH/api/plugins/
echo "Complete"