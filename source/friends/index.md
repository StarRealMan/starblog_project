---
title: 好伙伴们
date: 2020-12-12 12:44:02
comments: true
description: 好伙伴们在哪里~
---
<div class="linkpage"><ul id="friendsList"></ul></div>

<script type="text/javascript">
{
    const myFriends = [
        ["https://yochamzheng.github.io/", "https://avatars3.githubusercontent.com/u/39761153?s=64&v=4", "阿虎", "中国微电子行业栋梁之材"],
        ["https://delayzzz.github.io/", "https://avatars.githubusercontent.com/u/68680327?v=4", "驰酱", "生物医学工程治不了脑溢血"],
        ["https://shawlyu.github.io/", "https://avatars.githubusercontent.com/u/34409608?v=4", "晓阳学长", "教练，我想搞机器人"],
        ["https://AlbertFeng.github.io/", "https://avatars.githubusercontent.com/u/63229950?v=4", "冯少", "RoboMaster"],
        ["https://bigbird.fun", "https://avatars.githubusercontent.com/u/46832648?v=4", "鸟哥",  "我的偶像"]
    ];

    let friendNodes = '';
    while (myFriends.length > 0) {
        const rndNum = Math.floor(Math.random()*myFriends.length);
        friendNodes += `<li><a target="_blank" href="${myFriends[rndNum][0]}"><img src="${myFriends[rndNum][1]}"><h4>${myFriends[rndNum][2]}</h4><p>${myFriends[rndNum][3]}</p></a></li>`;
        myFriends.splice(rndNum, 1);
    }
    document.getElementById("friendsList").innerHTML = friendNodes;
}
</script>
