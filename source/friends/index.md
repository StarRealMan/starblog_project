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
        ["https://yochamzheng.github.io/", "https://avatars3.githubusercontent.com/u/39761153?s=64&v=4", "zyc1", "喵喵喵~"],
        ["https://github.com/hit-zyc", "https://avatars3.githubusercontent.com/u/56548980?s=64&v=4", "zyc2", "喵喵喵~"]
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
