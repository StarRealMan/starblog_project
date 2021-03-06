title: 利用ANSYS进行叶轮动态流场仿真分析实例
date: 2020-08-15 15:37:05
categories: 开发
tags: []
toc: true
---
大家好，我是Albert！没错，我又来了！最近题主正在做一个小项目，其中一个功能就是利用一个半开离心泵进行对一个有限固定水域（就是一个小泳池）进行水循环，我们都知道洗衣机滚筒就是一个典型的离心泵，所以有很大可能将离心泵开口后，里面的水有可能流不出来，或者说达不到预期参数，为了直观快速地看到整个流场情况以确定下一步迭代方向，题主选择了ANSYS中的Fluent作为仿真平台，借着这个项目正好分享一下动态仿真如何进行。下图是离心泵模型图和简化模型图（因为是几小时出的初稿，很丑）。

![离心泵模型图.PNG][1]

![简化模型图.PNG][2]

***一、模型前处理及导出***

从上面两张图可以看出，简化模型主要保留了离心泵特征和开口尺寸等关键信息，这样的处理是为了减少计算量，突出问题主要矛盾。除此之外呢，可能比较注重细节的同学看到了简化模型有些许不同，在叶轮外加了一个圆柱体，这部分叫做仿真的前处理，在进行动态流场仿真的时候，流体的传递并不是像真实物理世界连续传递那样，那样的计算量过于庞大，效率很低，Fluent的解决方式是通过interface连接动域和静域，将流动流体（interior）交互到静止流体（interior）中，所以在前处理就是要建立流动域和静止域，方便后面几何处理，从简化模型中可以看出，圆柱体作为旋转域，外部的几何体为静止域，通过圆柱外表面作为interface进行交互。将简化后的模型导出为STEP格式、igs格式或Parasolid格式均可，即可进行下一步操作。

***二、ANSYS中几何处理及划分网格***

题主使用的版本是ANSYS 17.0，下一步就是打开Workbench，将Geometry模块拖入工作区然后打开Geometry后，将刚刚导出的模型文件导入Geometry中，结果就像下图所示，可能不同格式文件导入会出现一些不同，比如题主使用的是STEP格式，会导致圆柱面分离，即图中看到的圆柱壁面分成了两个面，这时候使用Tools下面的merge指令选择需要合并的面，合并一些面，做成连续面，这样处理也是为了减小运算量和避免一些玄学BUG。

![1.PNG][3]

![2.PNG][4]

基本上模型处理成这样就可以了，下一步就要建立旋转域和静止域，这里用到的是Tools下的Enclosure指令，因为我们是自己创建的几何体，所以类型选择User Defined，这里面有一个点是需要关注，以旋转域为例，所谓旋转域就是由于叶轮运动而旋转的水，所以旋转域应当是圆柱体与叶轮实体的差集，在类型选择上，User Defined Body选择圆柱体，即基本几何轮廓，Target Body选择叶轮，即内部实体，两者取差集得到流动域。如下图所示。

![3.PNG][5]

![4.PNG][6]

静止域的处理方法与旋转域相同，题主只把最后得到的效果放出来，这一步处理之后我们就可以close Geometry了，然后进入下一步了。

![5.PNG][7]

此时返回Workbench主界面，将Fluid Flow（Fluent）拖入界面连接到Geometry上，并双击打开mesh进行网格划分。这里的mesh是ANSYS自带的网格划分软件，一些基本处理是可以完成的，是基于ICEM，所以和ICEM界面一样感人。

![6.PNG][8]

当我们进入mesh后，第一步在左侧结构树中先找到叶轮，将其suppress掉，方便后续处理，接下来是设置一下进出口面（inlet和outlet），目的是方便观察，还有就是气动仿真中会用到计算起点，对于液体来说就是方便观察。第二步是最关键的，即在旋转域中建立动力交互面interface，我们先把刚刚得到的旋转域独立出来（即将其余body隐藏掉），将光标选择换为Box Select。

![7.PNG][9]

然后长按鼠标左键框选旋转域中的叶轮表面，记住此时的叶轮形状并不属于叶轮实体，而是旋转域的内壁表面，然后右键绿色区域，并Create Named Selection，这样导入Fluent就可以自动生成interface了。

![8.PNG][10]

下一步就是自动划分网格了，直接点击mesh，generate即可，因为是自动划分的网格，所以网格尺寸较大，可根据需要调整尺寸大小，在Body Sizing中调整element size。

![9.PNG][11]

![11.PNG][12]

 网格划分完毕后，我们的前处理就完成了，即可进入Fluent里进行计算了。

***三、仿真计算***

我们close meshing后返回Workbench主界面，先update一下mesh文件，然后双击打开Setup，这里设置一下计算方式换为并行计算，将核数改为6，增加一个GPU，提高计算速度。

![10.PNG][13]

将General设置如下图，我们这次选择的是瞬时分析，由于流体是水，一定要加上重力加速度。

![12.PNG][14]

粘性模型选择K-omega下的SST模型，在Model下的Viscous选项中选择，并在材料中，将液态水添加进流体类型中，关键步骤，设置旋转域旋转，旋转域转轴及转速，如下图所示，选择mesh motion，右侧是旋转轴方向，左侧是旋转轴相对于世界坐标系的偏移量，由于我的叶轮旋转轴与世界坐标系Y轴重合，即无需偏移，转速设置为25rad/s。

![13.PNG][15]

下一步就是进行初始化，选择Hybrid Initialization，初始化后的步骤就是preview，及观察叶轮是否转动，保证我们的计算是有效的。在preview中，设置步长0.01s，先跑10步。

![14.PNG][16]

preview验证 - 知乎
https://www.zhihu.com/zvideo/1277979482393960448

从preview的视频中看出，叶轮的转动是正常，我们就可以开始仿真了，由于仿真时间太长，收敛后是十分密的锯齿曲线，直接上结果，速度场变化的动画。从仿真视频中可以看出，水是可以从离心泵中流出来，但是流域不是很理想，这就需要后面慢慢改导流机构啦！（由于这个Blog添加不了视频，我就把视频放到了知乎上，后面的连接复制打开一下就能看到结果啦！）

速度场结果 - 知乎
https://www.zhihu.com/zvideo/1277981000899616768

下次看个人情况更新机器人学或者SLAM十四讲的学习笔记吧！希望对你有用，bye！


  [1]: /old_images/2020/08/615084051.png
  [2]: /old_images/2020/08/1060845710.png
  [3]: /old_images/2020/08/2072954433.png
  [4]: /old_images/2020/08/3016259840.png
  [5]: /old_images/2020/08/3614482147.png
  [6]: /old_images/2020/08/1639294894.png
  [7]: /old_images/2020/08/4046785801.png
  [8]: /old_images/2020/08/482966380.png
  [9]: /old_images/2020/08/1083781610.png
  [10]: /old_images/2020/08/2373904712.png
  [11]: /old_images/2020/08/350215919.png
  [12]: /old_images/2020/08/1791974604.png
  [13]: /old_images/2020/08/437577698.png
  [14]: /old_images/2020/08/3976439614.png
  [15]: /old_images/2020/08/502004202.png
  [16]: /old_images/2020/08/4228770977.png
