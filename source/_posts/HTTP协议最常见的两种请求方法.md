title: HTTP协议最常见的两种请求方法
date: 2020-05-14 09:25:00
categories: web
tags: []
---
运行在网络中的诸多协议，组成了你生活中所有网络应用的基础。这些应用层协议常见的有如下几种：
 1. http：最常见的协议，实现超文本传输，浏览器中文本图像在服务器与客户端之间传递；
 2. ssh：安全shell，远程连接服务器的shell；
 3. ftp：远程文件系统；
 4. dns：域名解析；
 5. smtp：邮件协议；
等等等等……

只要掌握了这些协议的内部原理，我们就可以随意操作实现功能了。
这次我们来讲一下使用python的requests库实现http协议的请求
http协议通过客户端（浏览器）向服务器发出请求，服务器相应这些请求，文字，图像就能够显示在我们的浏览器上了！
这些请求有如下几种：
![Snipaste_2020-05-14_16-43-46.jpg][1]
我们主要讲解两种最常见的——GET、POST

## GET ##

GET请求是一种显式传递信息的方式，通常用于获取服务器发来的数据而做出请求。
常见发起GET请求的方式就是URL。
我们在浏览器中输入一个URL，点击访问，就是发起了一次GET请求
GET请求的内容通常是直接显式地显示在URL后面，以?分隔的。
GET返回的内容就会被浏览器理解，显示在界面上了：
使用浏览器自带的抓包工具，我们来看一下GET请求与响应都是什么样的
![Snipaste_2020-05-14_16-52-41.jpg][2]
点开B站的一瞬间，扑面而来的GET请求瞬间刷屏，当然这些都是第一个GET所带来的连锁反应
![Snipaste_2020-05-14_16-54-24.jpg][3]
首先General中告诉我们这是一个GET，目标URL是B站，IP也可以看见，status code就是状态码，200表示成功
大家常见的404、502也是状态码：        [关于状态码详细——百度百科][4]
![Snipaste_2020-05-14_16-56-30.jpg][5]
后面接着是Request Header，请求头，是我们发给服务器的数据：
![Snipaste_2020-05-14_16-58-34.jpg][6]
这其中包含着语言、所用浏览器、操作系统、编码方式等等，服务器拿到这些数据进行分析，来给你做出响应（反-反爬虫最基本的就是伪造请求头(●ˇ∀ˇ●)）
当然这里面最重要的是cookie信息，它保存着我的登录信息，利用cookie就可以实现免重复登陆的功能。
B站接到这个请求后，会进行处理，返回给我们一个Response Header：
![Snipaste_2020-05-14_17-02-55.jpg][7]
还有Response的内容，也就是B站主站的index.html，通过这个html我们就知道接下来该去哪些URL去GET些什么了。
![Snipaste_2020-05-14_17-31-24.jpg][8]
接下来，就是一系列GET来搭建出整个网站所呈现出的样子，比如一些图片啊、script啊之类的。至此，通过一系列的GET我们访问到了B站。

## POST ##

当我们想去向服务器传递内容时，比如登陆时传递用户名密码，发送弹幕、评论，该如何发送请求呢？这时就需要POST登场了。
与GET不同，POST是一种隐含的信息传递方式，因此它更安全，适合向服务器传递隐私内容。
常见发起POST请求的是FORM表单。
这次我们以发送弹幕为例来看看POST是如何工作的：
![Snipaste_2020-05-14_17-18-41.jpg][9]
点击发送弹幕，发现，我们确实发出了一次POST请求（忽略下面这个failed的GET）
除了Request Header和Response，我们发现，POST还多了一个Form Data表单：
![Snipaste_2020-05-14_17-22-29.jpg][10]
这个Form Data中就保存了我们要传递给服务器的数据，比如弹幕的字体大小、颜色、内容、发送时间、BV号等等。
服务器接收到这样的POST请求，就能做出反应（在视频上显示出该弹幕），同样，评论与登录也是一个道理。
得到的Response也挺有趣的(/▽＼)
![Snipaste_2020-05-14_17-25-22.jpg][11]


  [1]: http://www.starydy.xyz/usr/uploads/2020/05/1596536276.jpg
  [2]: http://www.starydy.xyz/usr/uploads/2020/05/1113348697.jpg
  [3]: http://www.starydy.xyz/usr/uploads/2020/05/330527918.jpg
  [4]: https://baike.baidu.com/item/HTTP%E7%8A%B6%E6%80%81%E7%A0%81/5053660?fr=aladdin
  [5]: http://www.starydy.xyz/usr/uploads/2020/05/1088359098.jpg
  [6]: http://www.starydy.xyz/usr/uploads/2020/05/3068723404.jpg
  [7]: http://www.starydy.xyz/usr/uploads/2020/05/2576890486.jpg
  [8]: http://www.starydy.xyz/usr/uploads/2020/05/2978689860.jpg
  [9]: http://www.starydy.xyz/usr/uploads/2020/05/1187310326.jpg
  [10]: http://www.starydy.xyz/usr/uploads/2020/05/910319602.jpg
  [11]: http://www.starydy.xyz/usr/uploads/2020/05/963849757.jpg