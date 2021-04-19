---
title: C++常用数据结构使用方法
top: false
date: 2021-04-15 22:38:00
categories: 开发
tags:
pic:
toc: true
---

最近为了找实习，简单地复习了一下C++常用的数据结构，在此做个笔记。

## vector<typeA> ##

	首先是最常见的vector，和数组很类似，可以使用索引进行读写操作。

	常用方法：

	```
	myvector(size, a)
	resize(size)
	reserve(spacesize)
	push_back(a)
	pop_back()
	myvector[i]
	size()
	clear()
	empty()
	reverse(myvector.begin(), myvector.end())
	sort(myvector.begin(), myvector.end())
	```
	迭代器使用begin()、end()进行正向遍历，由于不支持减一操作，使用rbegin()、rend()进行反向遍历，其他数据结构都类似。

## list<typeA> ##

	实现了链表的结构，不同于vector，在进行插入删除操作时效率很高，但是在进行随机读取时效率较低。

	常用方法：
	```
	mylist(size, a)
	push_back(a)
	push_front(a)
	pop_back()
	pop_front()
	back()
	front()
	size()
	clear()
	empty()
	insert(it, num)
	erase(it, num)
	```

## set<typeA>, unordered_set<typeA> ##
-----
	使用红黑树实现的set，主要用于保留一系列**不重复**的值，并且进行了排序，查找具有O(logn)的复杂度。
	使用哈希表实现的unordered_set，基本方法与set相同，但是不具备顺序，查找具有O(1)的复杂度。

	常用方法：
	```
	insert(a)
	erase(a)
	count()		//可以用来查找值是否存在
	find()		//同样用于查找是否存在，但是使用的是迭代器，通常语法为：set.find(x) != end，若为真，则代表存在x。
	size()
	clear()
	empty()
	//遍历使用iterator实现：
	set<typeA>::iterator it = myset.begin();
	while(it != myset.end())
	{
		cout << \*it << endl;
		it++
	}
	```

## map<typeA, typeB>, unordered_map<typeA, typeB> ##
-----
	使用红黑树实现的map，主要用于保留一系列**不重复**的键值对，即可以使用键进行索引，并且对键进行了排序，查找具有O(logn)的复杂度。
	使用哈希表实现的unordered_map，基本方法与map相同，但是不具备顺序，查找具有O(1)的复杂度。

	常用方法：
	```
	insert(make_pair(key, value))
	erase()
	mymap[key]	//使用key作为索引进行读写map的 操作
	count()		//可以用来查找值是否存在
	find()		//同样用于查找是否存在，但是使用的是迭代器，通常语法为：map.find(x) != end，若为真，则代表存在x
	size()
	clear()
	empty()
	//遍历使用iterator实现：
	map<typeA>::iterator it = mymap.begin();
	while(it != mymap.end())
	{
		cout << it->first << endl;
		cout << it->second << endl;
		it++
	}
	```

## stack<typeA> ##
-----
	最常见的栈结构，一种先入后出的结构，但是不具有迭代器，主要用于存储某些状态的特定元素使用。

	常用方法：
	```
	push(a)
	pop()
	top()
	size()
	empty()
	//由于没有迭代器，所以不能进行遍历，唯一方法是遍历容器内容，并移除访问过的每一个元素
	```
	
## queue<typeA> ##
-----
	最常见的队列结构，一种先入先出的结构，但是不具有迭代器，主要用于某种状态下待处理元素的记录，常见于BFS算法中。

	常用方法：
	```
	push(a)
	pop()
	front()
	back()
	size()
	empty()
	//与stack一样没有迭代器，所以不能进行遍历，唯一方法是遍历容器内容，并移除访问过的每一个元素
	```
	
## deque<typeA> ##
-----
	与queue相似的双向队列结构，能够进行首尾的读取，加入与弹出，拥有迭代器。

	常用方法：
	```
	push_back(a)
	pop_back()
	push_front(a)
	pop_front()
	back()
	front()
	at(i)等价于[i]
	size()
	clear()
	empty()
	```

## heap ##
-----
	实际上C++并没有堆这个类，使用的是对另一个数据结构的迭代器进行建堆操作来创建一个堆。
	堆使用完全二叉树实现的，大根堆即代表根节点大于（或等于）叶子节点，小根堆同理。堆方便指出就在于便于进行排序（处在堆顶的一定是最大值）。

	常用方法：
	```
	vector<typeA> myvector;
	make_heap(myvector.begin(), myvector.end());				//默认为大根堆
	make_heap(myvector.begin(), myvector.end(), greater<type>);		//创建小根堆，创建堆会改变原始数据结构的顺序为堆树的层次遍历
	myvector.push_back(a);
	push_heap(myvector.begin(), myvector.end());				//push操作先对原数据进行
	pop_heap(myvector.begin(), myvector.end());				//pop操作先对堆进行
	myvector.pop_back(a);
	sort_heap(myvector.begin(), myvector.end());				//核心操作，进行堆排序（大根堆进行升序排序，小根堆进行降序排序）
	```

## priority_queue ##
-----
	C++没有堆，但是我们还可以通过priority_queue来实现有排序功能的数据结构，当然，内部结构还是堆的原理。
	priority_queue的方法与上面的队列queue基本相同，只不过在我们把新元素入队时，会自动更新这个堆，使得我们每次出队的元素都是当前队列最大/最小的。
	
	常用方法：
	```
	priority_queue<int, vector<int>, greater<int>> up;		//升序队列（小根堆）
	priority_queue <int, vector<int>, less<int>> down;		//降序队列（大根堆）
	push(a)
	pop()
	front()
	back()
	size()
	empty()
	```

## string ##
-----
	不同于C语言中使用char\*或char[]来维护字符串，C++使用string类进行字符串的操作，其中之前C语言对于char\*字符串的操作方法大多数也适用于string类型。

	常用方法：
	```
	mystring("Hello")
	mystring(size, 'A')				//注意C++中 'A'表示一个字符（char），"A"表示一个字符串（char\*）
	char* mychar = "Hello";				//char* 与 string的转换：
	mystring = mychar;
	mychar = mystring.c_str();
	mystring = mystring1 + mystring2;		//字符串的拼接：
	mystring.append(mystring1);
	substring = mystring.substr(start, size);	//提取、插入、删除、替换子串：
	newstring = mystring.insert(start, substring);
	mystring.erase(start, size);
	mystring.replace(start, size, substring);
	char mychar = mystring[i];			//索引读写：
	//与其他STL数据结构类似，也可以使用迭代器进行string的操作。
	```
