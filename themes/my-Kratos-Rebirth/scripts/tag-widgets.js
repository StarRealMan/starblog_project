/*!
  标签小组件文件
  Created by [Candinya](https://candinya.com)
  Created for [Kratos-Rebirth](https://github.com/Candinya/Kratos-Rebirth)
*/

// 提示横幅
hexo.extend.tag.register('alertbox', function(args){
    // const content = hexo.render.renderSync({text: args[1], engine: 'markdown'});
    return `<div class="alert alert-${args[0]}">${args[1]}</div>`;
});

// 折叠内容
hexo.extend.tag.register('collapse', function(args, content){
    content = hexo.render.renderSync({text: content, engine: 'markdown'});

    return `<div class="xControl">
    <div class="xHeading"><div class="xIcon"><i class="fa fa-plus"></i></div><span>${args[0]}</span></div>
    <div class="xContent"><div class="inner">
        ${content} 
    </div></div>
    </div>`;
}, {ends: true});

// 提示面板
hexo.extend.tag.register('colorpanel', function(args, content){
    content = hexo.render.renderSync({text: content, engine: 'markdown'});

    return `<div class="panel panel-${args[0]}">
    <div class="panel-title">${args[1]}</div>
    <div class="panel-body">
        ${content}
    </div>
    </div>`;
}, {ends: true});

