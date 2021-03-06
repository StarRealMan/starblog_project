title: 对比ARM与x86的boot过程
date: 2020-02-20 10:30:00
categories: 开发
tags: []
toc: true
---
大家都应该熟悉x86架构cpu的启动方式
**首先是BIOS芯片，是一个固化了程序的CMOS芯片：**
作为设备上电第一个被执行的程序，无论是BIOS还是UEFI都会先取得设备的硬件信息，其中重要的就包括启动设备的查找顺序！下一步，BIOS会按照这个顺序检测到第一个设备的MBR区（BootSector），其中就存放着bootloader，BIOS会把bootloader加载到内存运行。
**bootloader：**
最常见的bootloader就是grub了，bootloader的最重要的作用是识别操作系统的文件系统格式，并且加载到内存中去运行，每个操作系统都应该有对应的bootloader。另外，bootloader还有另外一个作用，就是可以将启动管理的功能交给其他系统的bootloader，这也就是我们能在同一台电脑上同时安装Windows和Linux两个操作系统的原因了。当然加载完内核后还有初始化虚拟根目录，配置驱动程序，挂载根目录和systemd服务开启的诸多任务。

而对于经常玩STM32的我，bootloader一般是芯片厂商固化在芯片中的一段程序。由于STM32不需要把程序加载到内存中运行，而是在flash中直接被运行，bootloader可以被直接执行。bootloader的作用就是：1、选择启动方式；2、初始化芯片的一些基本功能能保证程序在flash中运。，之后，就可以把cpu使用权转交给程序了。当然，如果厂商提供的内嵌bootloader不能满足你的需求（比如需要在线升级固件的产品，即IAP），你也可以自己写 bootloader，将其烧在flash的某个特定区域，用自己的bootloader去引导程序执行。同时，我们熟知的startup启动文件也属于这个bootloader

最近一段时间看到了嵌入式Linux的启动方式，正是结合了上面两种启动方式的来的，最长用的嵌入式Linux的bootloader是U-Boot，相当于一段裸机程序，链接到第一个执行的位置，当然在启动时会被拿到ram中第一个执行。它的作用也是为Linux开路，配置Linux所需外设，初始化DDR，并且把Linux内核程序加载到ram中。之后的过程就与x86架构大同小异了。

由此可见，U-Boot可以说是发挥了BIOS与boootloader的作用，主要作用就是1、配置；2、加载内核。
