
sudo apt-get install mongodb
sudo apt-get install openjdk-7-jdk
sudo apt-get install unzip
sudo apt-get install nginx

sudo mkdir -p /var/lib/quiq-ly
sudo mkdir -p /var/lib/quiq-ly/storage

sudo service ufw stop
sudo service nginx start
sudo service mongod start

