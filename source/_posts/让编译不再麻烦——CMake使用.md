title: 让编译不再麻烦——CMake使用
date: 2020-06-10 05:41:00
categories: 工具
tags: []
---
相信大家在进行C/C++开发时，经常会遇到项目管理的问题。如果你只有一个源文件，那么这将不是什么难事，一条gcc/g++指令，配合上合适的参数，就能够做得很好。但是对于像这样庞大的工程：
![Snipaste_2020-06-10_13-40-06.jpg][1]
每个源文件需要一行编译命令，之后还需要链接，才能编译成二进制可执行文件与库，想着想着，我人都傻了Σ(っ °Д °;)っ
幸好有的IDE已经很智能地帮我们做了这一点，我们只需要用图形界面配置好工程中文件的组织形式，引用路径，库的位置，就能够一键编译了。（比如交叉编译IDE 我们熟知的Keil）
但是IDE灵活性不足，并且有平台的局限性，不能做到轻量化，在使用VSCode这种不带编译器的编辑器的时候，想要更多地自己配置编译方式，就需要用到我们今天的主角Makefile与CMake了！

## Makefile
为了能够自动化地配置工程，完成编译，人们发明了Makefile这样的文件。在含有Makefile文件的目录下执行make命令就可以执行编译动作。使用设定好的编译器，系统会读取Makefile文件的内容进行编译。
Makefile按照目标：依赖的结构组织工程，后面紧接着由依赖变化到目标的gcc（g++）命令。使用自动化变量加上自动寻找依赖的机制，Makefile的确使得编译更加方便，但是要写好Makefile，还是离不开gcc（g++）繁琐的语法，同时还要满足Makefile的语法格式。人们又发明了自动生成Makefile文件的工具CMake。
##![Snipaste_2020-06-10_14-42-50.jpg][2]
Makefile的语法

## CMake ##
想要使用Makefile，一般的Linux系统都会自带Makefile工具。但是CMake需要自行安装。CMake的设计初衷就是使用简单易懂的CMake语法生成晦涩难懂的Makefile语法，使得配置编译设置就像在IDE使用图形化配置一样方便（事实上确实有图形化的CMake——CMake GUI）。
在工程目录创建一个CMakeLists.txt文件，并且创建子目录build，用于放置编译生成的中间文件，进入build，执行cmake ..（注意这个..，表示上一级目录），就会生成我们想要的Makefile文件了，相信这个步骤使用源码安装Linux软件的同学都不陌生。

CMake语句：

    project(main)
    cmake_minimum_required(VERSION 2.8)
新建一个CMake项目main，确定cmake需要的最低版本为2.8
    set(CMAKE_BUILD_TYPE "Release")
    set(CMAKE_CXX_FLAGS "-O3")
    set(CMAKE_CXX_FLAGS "-std=c++11")
确定编译发布版，优化-o3，C++标准为c++11，set就是进行变量的赋值
    set(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)
    set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)
确定输出可执行文件、库文件的位置
    find_package(OpenCV REQUIRED)
找到系统已经安装的库文件的路径，将其赋值给对应变量。一些比较大的库自己能够告知CMake自己的位置，但是有时就需要我们把FindXXlib.cmake文件告诉CMake（一般库中会提供的）：
    list(APPEND CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake)
确定cmake文件的位置
    include_directories(${OpenCV_INCLUDE_DIRS})
添加头文件目录，相当于gcc（g++）命令中的-I
    add_subdirectory(./src)
添加一个子目录，需要保证子目录中有CMakeLists.txt文件，然后就会执行子目录中的CMake文件，用于多个目录的工程。一般在子目录中将源文件编译为库文件，再在根目录的CMake中链接这个库。
    add_library(HELLO hello.cpp)
    add_executable(main main.cpp)
生成一个库、可执行文件，使用源文件（可以是多个），进行编译、链接，生成一个二进制文件，相当于gcc（g++）中的 -o
    target_link_libraries(common ${OpenCV_LIBS})
给可执行文件链接一个库，这个库可以是绝对路径，也可以是已经放在环境变量中的变量。

总而言之这就是CMake的基本原理，确实是大大方便了工程项目配置，已经逐渐成为了主流。

附上在学习高翔老师《视觉SLAM14讲》时使用的CMake文件，留做参考。

./中的CMakeLists.txt
    project(main)
    cmake_minimum_required(VERSION 2.8)
    
    set(CMAKE_BUILD_TYPE "Release")
    #set(CMAKE_BUILD_TYPE "Debug")
    set(CMAKE_CXX_FLAGS "-O3")
    set(CMAKE_CXX_FLAGS "-std=c++11")
    set(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)
    set(CMAKE_CXX_FLAGS "-std=c++11 -O2 ${SSE_FLAGS} -g -march=native")
    set(G2O_LIBS g2o_core g2o_stuff g2o_types_sba g2o_types_slam3d
                 g2o_solver_csparse g2o_csparse_extension cholmod g2o_solver_cholmod cxsparse)
    
    list(APPEND CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake)
    
    find_package(Sophus REQUIRED)
    find_package(OpenCV REQUIRED)
    find_package(Pangolin REQUIRED)
    find_package(Ceres REQUIRED)
    Find_Package(CSparse REQUIRED)
    find_package(G2O REQUIRED)
    
    
    include_directories(${G2O_INCLUDE_DIRS})
    include_directories( ${CSPARSE_INCLUDE_DIR} )
    include_directories(${OpenCV_INCLUDE_DIRS})
    include_directories(${Sophus_INCLUDE_DIRS})
    include_directories(${CERES_INCLUDE_DIRS})
    include_directories(/usr/include/eigen3)
    include_directories(./src)
    include_directories(./include)
    
    
    add_subdirectory(./src)
    add_executable(main main.cpp)
    target_link_libraries(main HELLO)
    target_link_libraries(main common)
    target_link_libraries(main ${Pangolin_LIBRARIES})
    target_link_libraries(main ${OpenCV_LIBS})
    target_link_libraries(main ${CERES_LIBRARIES})
    target_link_libraries(main ${G2O_LIBS})

./src中的CMakeLists.txt
    cmake_minimum_required(VERSION 2.8)
    
    set(CMAKE_BUILD_TYPE "Release")
    # set(CMAKE_CXX_FLAGS "-O3")
    set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)
    set(G2O_LIBS g2o_core g2o_stuff g2o_types_sba g2o_types_slam3d
                 g2o_solver_csparse g2o_csparse_extension cholmod g2o_solver_cholmod cxsparse)
    
    list(APPEND CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake)
    
    find_package(Sophus REQUIRED)
    find_package(OpenCV REQUIRED)
    find_package(Pangolin REQUIRED)
    find_package(Ceres REQUIRED)
    find_package(G2O REQUIRED)
    
    include_directories(${G2O_INCLUDE_DIRS})
    include_directories(${OpenCV_INCLUDE_DIRS})
    include_directories(${Sophus_INCLUDE_DIRS})
    include_directories(${CERES_INCLUDE_DIRS})
    include_directories(/usr/include/eigen3)
    include_directories(../include)
    
    add_library(HELLO hello.cpp)
    add_library(common common.cpp)
    target_link_libraries(common ${Pangolin_LIBRARIES})
    target_link_libraries(common ${OpenCV_LIBS})
    target_link_libraries(common ${CERES_LIBRARIES})
    target_link_libraries(common ${G2O_LIBS})

  [1]: /old_images/2020/06/3640866494.jpg
  [2]: /old_images/2020/06/2855613712.jpg
