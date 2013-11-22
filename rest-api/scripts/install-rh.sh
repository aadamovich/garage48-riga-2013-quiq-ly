sudo yum -y update

echo "[MongoDB]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
gpgcheck=0
enabled=1" | sudo tee -a /etc/yum.repos.d/mongodb.repo

sudo yum -y install -y mongo-10gen-server
sudo yum -y erase java-1.6.0-openjdk
sudo yum -y install java-1.7.0-openjdk

sudo mkdir -p /var/lib/quiq-ly
sudo mkdir -p /var/lib/quiq-ly/storage

sudo service iptables stop
sudo service ip6tables stop

sudo yum -y install unzip
sudo yum -y install nginx

sudo service mongod start
sudo service nginx start

