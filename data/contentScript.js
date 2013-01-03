/**
 * Created by azu.
 * Date: 12/10/08 19:22
 * License: MIT License
 */

var panel = {
    clear : "kPanelClear",
    seeing : "kSeeing"
};
window.addEventListener("click", function(event){
    var target = event.target
    if (target.nodeName == 'A'){
        event.preventDefault();
        self.port.emit('click-link', target.toString());
    }
}, false);
self.port.on(panel.seeing, function(data){
    // 前回の位置が残るので、トップにスクロールしておく
    window.scrollTo(0, 0);
    var insertElem = document.querySelector(data.insertElementSelector);
    // 既に中身があるなら消す
    emptyElem(insertElem);
    //テンプレートの取得
    var source = document.querySelector("#entry-template").innerHTML;
    // autolink
    Handlebars.registerHelper('auto_link_comment', function(text){
        var escapedComment = Handlebars.Utils.escapeExpression(text);
        return new Handlebars.SafeString(
                window.autolinkTwitter(escapedComment)
        );
    });
    //テンプレートのコンパイル
    var template = Handlebars.compile(source, function(){
    });
    //テンプレートとパラメータをマージ
    var result = template(data);
    //結果を出力
    insertElem.innerHTML = result;

    var loadingElem = document.querySelector(data.insertElementSelector + "> .loading");
    loadingElem.classList.remove("loading");
});
// クリア
function emptyTemplate(selector){
    if (selector){
        var elem = document.querySelector(selector);
        console.log(selector);
        emptyElem(elem);
    }else{
        var siteDiv = document.querySelectorAll("#contents > div");
        for (var i = 0, len = siteDiv.length; i < len; i++){
            var div = siteDiv[i];
            emptyElem(div);
        }
    }
}
self.port.on(panel.clear, emptyTemplate)

// elementの子を消す
function emptyElem(element){
    while (element.firstChild){
        element.removeChild(element.firstChild);
    }
}

// https://github.com/tokuhirom/autolink.js
// http://tokuhirom.mit-license.org/
(function(){
    "use strict";

    var global = this;
    var Y;
    if (typeof exports !== 'undefined'){
        Y = exports;
    }else{
        Y = window;
    }

    function escapeHTML(str){
        return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, '&#39;');
    }

    Y.autolink = function(src){
        return src.replace(
                /(https?:\/\/[^:/<>&\s]+(?::\d+)?(?:\/[^#\s<>&()"']*(?:#(?:[^\s<>&"'()]+))?)?)|(.)/gi,
                function(all, url, normal){
                    if (url){
                        return "<a href='" + escapeHTML(url) + "'>" + escapeHTML(url) + "</a>"
                    }else{
                        return escapeHTML(normal);
                    }
                }
        );
    };
    Y.autolinkTwitter = function(src){
        return src.replace(
                /(https?:\/\/[^:/<>&\s]+(?::\d+)?(?:\/[^#\s<>&()"']*(?:#(?:[^<>&"'()]+))?)?)|(?:@([a-zA-Z0-9_-]+))|(#[A-Za-z0-9_-]+)|(.)/gi,
                function(all, url, name, hashtag, normal){
                    if (url){
                        return "<a href='" + escapeHTML(url) + "'>" + escapeHTML(url) + "</a>"
                    }else if (name){
                        return "<a href='http://twitter.com/" + escapeHTML(name) + "'>@" + name + "</a>";
                    }else if (hashtag){
                        return "<a href='https://twitter.com/#!/search/?q=" + encodeURIComponent(hashtag) + "'>" + escapeHTML(hashtag) + '</a>';
                    }else{
                        return escapeHTML(normal);
                    }
                }
        );
    }
})();

