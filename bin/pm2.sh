git pull
yarn
pm2 delete kgb-hub-frontend
sudo rm -rf .next
yarn build
pm2 start "yarn next start -p 3001" --name kgb-hub-frontend