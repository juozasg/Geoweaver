[![Build Status](https://travis-ci.org/ESIPFed/Geoweaver.svg?branch=master)](https://travis-ci.org/ESIPFed/Geoweaver) [![License](https://img.shields.io/github/license/ESIPFed/Geoweaver.svg)](https://github.com/ESIPFed/Geoweaver/blob/master/LICENSE) [![Stars](https://img.shields.io/github/stars/ESIPFed/Geoweaver.svg)](https://github.com/ESIPFed/Geoweaver/stargazers) [![Forks](https://img.shields.io/github/forks/ESIPFed/Geoweaver.svg)](https://github.com/ESIPFed/Geoweaver/network/members) [![Issues](https://img.shields.io/github/issues/ESIPFed/Geoweaver.svg)](https://github.com/ESIPFed/Geoweaver/issues) [![Coverage](https://img.shields.io/badge/covarege-100%25-success.svg)](https://codecov.io/)

# [Geoweaver](https://esipfed.github.io/Geoweaver/)

2018 ESIP Lab Incubator Project

Geoweaver is a web system allowing users to easily compose and execute full-stack deep learning workflows via taking advantage of online spatial data facilities, high-performance computation platforms, and open-source deep learning libraries. It is a perfect alternative to SSH client (e.g., Putty), FTP client, and scientific workflow software. 

##### Table of Contents

- [1. Project Goals](#project-goals)
- [2. Installation](#installation)
  * [2.1 Dependencies](#dependencies)
  * [2.2 Quick Install](#quick-install)
    + [Linux](#linux)
    + [Mac](#mac)
    + [Windows](#windows)
  * [2.3 Developer Install](#developer-install)
    + [Docker](#docker)
    + [Tomcat War](#tomcat-war)
    + [Cloud VM Template](#cloud-vm-template)
  * [2.4 Build from source](#build-from-source)
- [3. Demo](#demo)
- [4. Usage](#usage)
  * [4.1 Add A Server](#add-a-server)
  * [4.2 Create A Process](#create-a-process)
  * [4.3 Create A Workflow](#create-a-workflow)
  * [4.4 Run Workflow](#run-workflow)
  * [4.5 Browse Provenance](#browse-provenance)
  * [4.6 Retrieve and Display Results](#retrieve-and-display-results)
  * [4.7 I/O workflows](#i-o-workflows)
- [5. Documentation](#documentation)
- [6. Dependencies](#dependencies)
- [7. License](#license)
- [8. Author](#author)


# 1. Project Goals

1) turning large-scale distributed deep network into manageable modernized workflows;

2) boosting higher utilization ratio of the existing cyberinfrastructures by separating scientists from
tedious technical details;

3) enhancing the frequency and accuracy of classified land cover land use maps for agricultural purposes;

4) enabling the tracking of provenance by recording the execution logs in structured tables to evaluate the
quality of the result maps;

5) proof the effectiveness of operationally using large-scale distributed deep learning models in classifying
Landsat image time series.

# 2. Installation

## 2.1 Dependencies

If you choose "Quick Install", no need to install these dependencies separately. The install scripts will retrieve these dependencies automatically.

Java 1.8+ (OpenJDK 8 or higher)

Tomcat 8.0+ 

Apache Maven 3.5+ (optional for building from source)

[Docker](https://docs.docker.com/install/) 18.09.1+ (for install via docker)

[Docker-compose](https://docs.docker.com/compose/install/) 1.23.1+ (for install via docker)

## 2.2 Quick Install

### Linux

This way works for most linux releases, e.g., Ubuntu, CentOS, RedHat, OpenBSD, etc.

* Step 1: clone the github repo

```shell
git clone https://github.com/ESIPFed/Geoweaver.git
```

* Step 2: enter the folder and start the install

```shell
cd Geoweaver
chmod 755 install-linux.sh
./install-linux.sh
```

* Once the script stops, the Geoweaver should already be up and running. Enter URL http://127.0.0.1:8080/Geoweaver/web/geoweaver in browser to open it. 

* Optional: To stop Geoweaver, type: `install/apache-tomcat-9.0.22/bin/shutdown.sh`. To start Geoweaver again, type: `install/apache-tomcat-9.0.22/bin/startup.sh`

### Mac

* Step 1: clone the github repo

```shell
git clone https://github.com/ESIPFed/Geoweaver.git
```

* Step 2: enter the folder and start the install

```shell
cd Geoweaver
chmod 755 install-mac.sh
./install-mac.sh
```

* Once the script stops, the Geoweaver should already be up and running. Enter URL http://127.0.0.1:8080/Geoweaver/web/geoweaver in browser to open it.

* Optional: To stop Geoweaver, type: `install/apache-tomcat-9.0.22/bin/shutdown.sh`. To start Geoweaver again, type: `install/apache-tomcat-9.0.22/bin/startup.sh`

### Windows

* Step 1: clone the github repo

```shell
git clone https://github.com/ESIPFed/Geoweaver.git
```

* Step 2: enter the folder and start the install

```shell
cd Geoweaver
./install-windows.bat
```

* Once the script stops, the Geoweaver should already be up and running. Enter URL http://127.0.0.1:8080/Geoweaver/web/geoweaver in browser to open it.

* Optional: To stop Geoweaver, type: `install/apache-tomcat-9.0.22/bin/shutdown.bat`. To start Geoweaver again, type: `install/apache-tomcat-9.0.22/bin/startup.bat`

## 2.3 Developer Install

This section is dedicated for high-level users who have better background on web technologies and familiar with MySQL, Tomcat and Docker. If you are not familiar with either of them, we strongly suggest you use the "Quick Install" way to install Geoweaver. 

### Docker

We use `docker-compose` to establish the containers for Geoweaver. As the DockerHub is not very friendly for docker-compose yaml at present, we only suggest manual to start from GitHub repo. It only has three steps.

#### Install

* Clone this repo to your machine 
```shell
git clone https://github.com/ESIPFed/Geoweaver.git
```
* Enter the repo and create a new folder `target`. Download a Geoweaver war package from the [release page](https://github.com/ESIPFed/Geoweaver/releases) and save it in the created `target` folder.
```shell
cd Geoweaver && mkdir target && cd target
wget https://github.com/ESIPFed/Geoweaver/releases/download/v0.7.1/Geoweaver.war -O Geoweaver.war
```

* Run docker to start rolling. After the command is finished, Geoweaver should be up and running. 

```shell
cd .. && docker-compose up -d
```

The address is:

```html
http://your-ip:your-port/Geoweaver/web/geoweaver
```

Replace the `your-ip`, `your-port` with the real domain of your tomcat. For example, `localhost:8080`.

Notice: Make sure the local services like mysql and tomcat are shut down before starting `docker-compose`. Otherwise there might be port conflict error on `3306` and `8080`. Or you can change the port to some other free ports in the docker-compose.yml.

If you don't have docker or docker-compose installed, these documents will help. [docker](https://docs.docker.com/install) [docker-compose](https://docs.docker.com/compose/install/)

#### Shutdown

To stop Geoweaver, type:
```shell
docker stop $(docker ps -aq)
```

### Tomcat War

#### Install

* Download [the latest release war](https://github.com/ESIPFed/Geoweaver/releases) and copy it to the webapps directory of Tomcat (e.g. /usr/local/tomcat). Start Tomcat. 


```shell

wget https://github.com/ESIPFed/Geoweaver/releases/download/v0.7.1/Geoweaver.war -O Geoweaver.war
cp Geoweaver.war /usr/local/tomcat/webapps/
/usr/local/tomcat/bin/startup.sh

```

* After the tomcat is fully started, configure the database connection. The configuration files are `WEB-INF/classes/config.properties` 

```shell
nano /usr/local/tomcat/webapps/Geoweaver/WEB-INF/classes/config.properties
nano /usr/local/tomcat/webapps/Geoweaver/WEB-INF/classes/cc_secret.properties
```

Fill the fields with correct values. (database url, default: jdbc:mysql://localhost:3306/cyberconnector) and `WEB-INF/classes/cc_secret.properties` (database username and password: database_user=root database_password=xxxxxxxx). 

(**Note: the database must be initiated by the SQL file under the folder Geoweaver/docker/db first.**)

```shell
mysql -u root -p < docker/db/gw.sql
```

* Enter the following URL into browser address bar to open Geoweaver:
```html
http://your-ip:your-port/Geoweaver/web/geoweaver
```

#### Shutdown

To stop Geoweaver, use:
```shell
/usr/local/tomcat/bin/shutdown.sh
```

### Cloud VM Template

#### Install

We provide a ready-to-use cloud template for you to install on mainstream cloud platforms like AWS, Google Cloud, Azure, OpenStack and CloudStack. Please go [here](http://cloud.csiss.gmu.edu/public/geoweaver-0.6.8.qcow2) to download the template (3.1 Gigabytes). The username and password of the instance would be `csiss` and `password` respectively. 

To start Geoweaver, go to directory /home/csiss/Geoweaver and execute docker-compose up -d. With no accident, Geoweaver will be up and running. 

```shell
cd /home/csiss/Geoweaver && docker-compose up -d
```

#### Shutdown

To stop Geoweaver, use:

```shell
docker stop $(docker ps -aq)
```

## 2.4 Build from source

Use maven to build. In the command line go to the root folder and execute `mvn install`. After a success build, the Geoweaver war package will be under the directory: `Geoweaver/target/Geoweaver-<version>.war`. 

# 3. Demo

A live demo site is available in George Mason University: [I am a link, hit me](https://cloud.csiss.gmu.edu/Geoweaver).

Here is a use case of Geoweaver, using deep neural network like LSTM RNN and SegNet to classify landsat images into agricultural land use maps. In this case, Geoweaver can help stakeholders get crop maps with better accuracy and high temporal resolution by providing a deep-learning-powered and distributed workflow system. 

![Result Demo](demo.png)

![LSTM-Crop concept](lstm.png)

Animation demo:

![AnimationDemo](geoweaver-demo.gif)


# 4. Usage

## 4.1 Add A Server

Enroll a server to Geoweaver is simple. The server must have SSH server installed and enabled. The server must be accessible from Geoweaver host server. 

![Add a host](addhost.gif)

## 4.2 Create A Process

Geoweaver supports Bash Shell scripts as processes. You can write bash command lines in the code area. Note: the commands should exist on the target hosts.

![Add a process](addprocess.gif)

## 4.3 Create A Workflow

Geoweaver can link the processes together to form a workflow. To connect two processes, press `shift` key while dragging from one process to another.

![Create a workflow](createworkflow.gif)

## 4.4 Run Workflow

Geoweaver can run the created workflows on the enlisted servers. During the running, Geoweaver is monitoring the status of each process. The color of process text in their circles indicate the process status. Yellow means running, green means completed, and red means failure.

![Run a workflow](runworkflow.gif)

## 4.5 Browse Provenance

Geoweaver stores all the inputs and outputs of each process run. Users can check the workflow provenance by simply clicking.

![Check provenance](checkprovenance.gif)

## 4.6 Retrieve and Display Results

Geoweaver can retrieve the result files of the executed workflows and visualize them if the format is supported (png, jpg, bmp, etc. The list is expanding. I am on it.).

![Get result](getresult.gif)

## 4.7 I/O workflows

The workflows can be exported and move around and imported back.

![Export workflow](exportworkflow.gif)

# 5. Documentation

[Project Proposal](geoweaver-proposal-revised-v4.pdf)

[August Report](ESIP-Geoweaver-Report-1.docx)

[September Report](ESIP-Geoweaver-Report-2.docx)

[October Report](ESIP-Geoweaver-Report-3.docx)

[November Report](ESIP-Geoweaver-Report-4.docx)

[December Report](ESIP-Geoweaver-Report-5.docx)

# 6. Dependencies

This project is impossible without the support of several fantastic open source libraries.

[d3.js](https://github.com/d3/d3) - BSD 3-Clause

[graph-creator](https://github.com/cjrd/directed-graph-creator) - MIT License

[bootstrap](https://github.com/twbs/bootstrap) - MIT License

[CodeMirror](https://github.com/codemirror/CodeMirror) - MIT License

[JQuery Terminal](https://github.com/jcubic/jquery.terminal) - MIT License

# 7. License

MIT

# 8. Author

[developer list](https://github.com/ESIPFed/Geoweaver/graphs/contributors)

