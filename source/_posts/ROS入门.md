title: ROS入门
date: 2020-08-28 14:08:00
categories: 工具
tags: []
toc: true
---
进入大四，终于要开启我的ROS之旅。
接触了几天ROS，越发发觉它的便利，今天来记录一下最基础的ROS操作。（大部分来自[ROS官网][1]，俗话说官网是学习的最佳路径）

## ROS项目管理机制 ##

ROS使用Workspace+Package的方式来管理一个项目。比如以一个机器人为例，机器人的每一个功能（比如传感器数据接收，运动控制，导航感知，决策）都会对应一个Package，这些Package之间可能互相依赖，他们共同构成一个Workspace，就构成了这个机器人整体。
从零开始构建一个项目，首先需要构建一个Workspace，使用：

    $ mkdir -p ~/catkin_ws/src        #用来存放Package
    $ cd ~/catkin_ws/
    $ catkin_make
在家目录构建一个空的，名为catkin_ws的Workspace，使用**catkin_make**可以自动生成一些所需的配置文件和目录（这个命令也充当着ROS管理工程中CMake的作用）。
如果想让ROS命令认识这个包，需要把他的位置加入到环境变量中去，这时我们就需要使用source（用来执行命令行脚本）执行～/catkin_ws/devel/中的 setup.bash命令了。这时$ROS_PACKAGE_PATH变量就包含了我们的工作区/src/目录。
如果想要使用官方的一些Package，他们的初始化脚本是/opt/ros/<distri>/setup.bash。（也可将其放入~/.bashrc中，在启动终端后自动执行）
对ROS的Package的一些操作：

    $ rospack find [package_name]
    $ roscd [locationname[/subdir]]
    $ roscd log
    $ rosls [locationname[/subdir]]

如何创建一个Package？
一个Package由一个独立的文件夹内的package.xml和一个CMakeists.txt文件（以及其他必要文件）组成，如下所示：

    workspace_folder/        -- WORKSPACE
      src/                   -- SOURCE SPACE
        CMakeLists.txt       -- 'Toplevel' CMake file, provided by catkin
        package_1/
          CMakeLists.txt     -- CMakeLists.txt file for package_1
          package.xml        -- Package manifest for package_1
        ...
        package_n/
          CMakeLists.txt     -- CMakeLists.txt file for package_n
          package.xml        -- Package manifest for package_n
如何自动创建这些文件？在~/catkin_ws/src目录中使用

    $ catkin_create_pkg <package_name> [depend1] [depend2] [depend3]
创建一个依赖于dependx的Package。
使用

    $ catkin_make
    $ . ~/catkin_ws/devel/setup.bash
build这个Workspace（内的所有Package），并且将其（内的所有Package）加入环境变量。

这些Package都有着各自（直接）依赖的Package，catkin_create_pkg命令中的dependx会体现在package.xml中。
直接的依赖Package使用以下命令查看：
$ rospack depend1 [Package name]
间接的依赖Package使用以下命令查看：
$ rospack depends [Package name]
对于你自己的项目，可以通过修改package.xml和CMakeLists.txt来进行定制化的操作。（详细略）

就如同CMake管理的项目一样，ROS管理的项目使用catkin_make进行项目的编译构建。
在～/catkin_ws/中使用：

    $ catkin_make
    $ catkin_make install  # (optionally)
这个命令会build整个Workspace下的所有Package，与cmake命令有相同作用。

## ROS通信机制 1##

ROS不仅为我们提供了一种项目管理的功能，还提供了一种便利的多进程通讯机制。
要启用这个多进程通讯机制，首先我们要启动ROS内核，使用：

    $ roscore
这个roscore进程是ROS进程间通讯的核心，起到了中继站的作用。一切ROS应用都少不了它。
ROS中，node代表一个可以进行通讯的节点，使用以下命令查看node属性：

    $ rosnode list
    $ rosnode info /[node name]
    $ rosnode ping /[node name]
使用rosrun来运行一个Package中的node。

    $ rosrun [package_name] [node_name]
    $ rosrun turtlesim turtlesim_node __name:=my_turtle
node之间通讯是通过node-msg-topic机制，两个或多个node向同一个topic发送消息msg，并接收其他node的特定的消息msg，就能实现通讯。
使用以下命令可以图形化查看当前运行中的node和topic：

    $ rosrun rqt_graph rqt_graph
为了查看运行中topic中传递的数据和一些其他信息，使用：

    $ rostopic echo [topic]
    $ rostopic list -h
    $ rostopic list -v
    $ rostopic type [topic]
    $ rosmsg show [msg type]
    $ rostopic hz
    $ rosrun rqt_plot rqt_plot
手动上传msg到指定的topic，使用：

    $ rostopic pub [topic] [msg_type] [args]
（注意，我们在命令行中使用的一些命令也是通过创建节点来实现功能的）

## ROS通信机制 2##

除了node-msg-topic的通信方式，我们还可以通过service实现通信。
rosservice的基本使用方法：

    $ rosservice list         print information about active services
    $ rosservice call         call the service with the provided args
    $ rosservice type         print service type
    $ rosservice find         find services by service type
    $ rosservice uri          print service ROSRPC uri

总而言之，每个Package会包含一些service，使用rosservice call可以调用这些service（可以理解为调用方法），实现某些功能。

使用rosparam可以存储某个Package参数，调整Package的功能：

    $ rosparam set            set parameter
    $ rosparam get            get parameter
    $ rosparam load           load parameters from file
    $ rosparam dump           dump parameters to file
    $ rosparam delete         delete parameter
    $ rosparam list           list parameter names

使用图形化界面管理ROS，使用如下命令：

    $ rosrun rqt_console rqt_console
    $ rosrun rqt_logger_level rqt_logger_level

使用.launch文件一键启动整个项目：

    $ roslaunch [package] [filename.launch]

    <launch>
    
      <group ns="turtlesim1">
        <node pkg="turtlesim" name="sim" type="turtlesim_node"/>
      </group>
    
      <group ns="turtlesim2">
        <node pkg="turtlesim" name="sim" type="turtlesim_node"/>
      </group>
    
      <node pkg="turtlesim" name="mimic" type="mimic">
        <remap from="input" to="turtlesim1/turtle1"/>
        <remap from="output" to="turtlesim2/turtle1"/>
      </node>
    
    </launch>

使用rosed进行编辑：

    $ rosed [package_name] [filename]

创建Package_dir/msg/Num.msg文件，来规定传递的msg。
创建Package_dir/srv/AddTwoInts.srv文件，来规定service的类型。
（需要在package.xml和CMakeists.txt声明该文件）

    $ rosmsg show [message type]
    $ rosmsg -h
    $ rossrv show <service type>

最后，我们可以在C++程序中使用ROS的库来实现msg和service的操作。
（对于我们添加的msg和srv，make后会自动生成对应的头文件，便于对其进行操作）

    #include "ros/ros.h"
    #include "std_msgs/String.h"
    #include "Package_dir/AddTwoInts.h"

  [1]: https://www.ros.org/



