var data = require("self").data;
var hatebu = require("./hatebu");
var topsyTwitter = require("./topsy-twitter");
var tabs = require("tabs");
var pageMod = require("page-mod");
var Hotkey = require("hotkeys").Hotkey;
var fbug = require("./fbug").fbug;
require("console-dir");
var prefSet = require("simple-prefs");
var constants = require("./constants");

/* オブジェクト */
var SSS = {};
(function initialize(){
    SSS.panel = require("panel").Panel({
        width : prefSet.prefs.panelWidth,
        height : prefSet.prefs.panelHeight,
        contentURL : data.url("view.html"),
        contentScriptFile : [data.url("handlebars-1.0.rc.1.js"), data.url("contentScript.js")],
        onHide : function(){
            SSS.panel.port.emit(constants.panel.clear);
        }
    });
    // パネル内でリンクをクリックしたらタブで開く
    SSS.panel.port.on("click-link", function(url){
        tabs.open(url);
    });

    // Widget
    SSS.Widget = require("widget").Widget({
        id : "social-siteseeing-button",
        label : "Social Siteseeing",
        contentURL : data.url("icon.png"),
        panel : SSS.panel,
        onClick : socialSeeing
    });

    // HotKey
    SSS.showHotKey = createHotKey();

    // Livedoor Reader
    pageMod.PageMod({
        include : ["http://reader.livedoor.com/reader/"],
        contentScriptWhen : 'ready',
        contentScriptFile : data.url("ldr-hook.js"),
        onAttach : function onAttach(worker){
            worker.on('message', function(obj){
                if (obj.hide){
                    SSS.panel.hide();
                }else{
                    socialSeeing(obj.url, function(err, doc){
                        var item = getItemNodeForWidget(SSS.Widget);
                        SSS.panel.show(item);
                    });
                }
            });
        },
        onError : function(err){
            console.log(err);
        }
    });

    // Topsy's API
    topsyTwitter.setAPIKey(prefSet.prefs.topsyAPIKey);
    // 設定の変更を検出する
    attachToHandleConfig();
})();

function getItemNodeForWidget(widget){
    var item;
    for (var win in require("window-utils").windowIterator()){
        var doc = win.document;
        var bar = doc.getElementById("addon-bar");
        var selector = 'toolbaritem[id$="' + widget.id + '"]';
        item = bar.querySelector(selector);
    }
    return item;
}
function attachToHandleConfig(){
    // 設定が変更されたらパネルをリサイズする
    var resizePanel = function(width, height){
        if (width && height){
            SSS.panel.resize(width, height);
        }else{
            SSS.panel.resize(prefSet.prefs.panelWidth, prefSet.prefs.panelHeight);
        }
    };
    prefSet.on("panelWidth", resizePanel);
    prefSet.on("panelHeight", resizePanel);
    prefSet.on("shortCutKey", function(){
        SSS.showHotKey.destroy();
        SSS.showHotKey = createHotKey();
    });
    prefSet.on("topsyAPIKey", function(){
        topsyTwitter.setAPIKey(prefSet.prefs.topsyAPIKey);
    });
}

function createHotKey(){
    return Hotkey({
        combo : prefSet.prefs.shortCutKey,
        onPress : function(){
            if (SSS.panel.isShowing){
                SSS.panel.hide();
            }else{
                socialSeeing(tabs.activeTab.url, function(err, doc){
                    var item = getItemNodeForWidget(SSS.Widget);
                    SSS.panel.show(item);
                });
            }
        }
    });
}


// コメントを取得して表示する
function socialSeeing(targetURL, callback){
    targetURL = targetURL || tabs.activeTab.url;
    hatebu.getHatebuJSON(targetURL, function(err, doc){
        if (err){
            console.log("getHatebuJSON:", err);
            SSS.panel.port.emit(constants.panel.clear, "#hatena-bookmark");
            return;
        }
        var hasResJSON = (!err || doc != null);
        var hatena = {
            "insertElementSelector" : "#hatena-bookmark",
            "title" : "はてなブックマーク",
            "url" : doc.entry_url,
            "count" : hasResJSON ? doc.count : 0,
            "comments" : hatebu.format(doc, {
                ignoreNoComment : true
            })
        };
        SSS.panel.port.emit(constants.panel.seeing, hatena);
        if (typeof callback === "function"){
            callback(err, doc);
        }
    })
    topsyTwitter.getTopsyJSON(targetURL, function(err, doc){
        if (err){
            console.log("getTopsyJSON:", err);
            SSS.panel.port.emit(constants.panel.clear, "#topsy-twitter-comment");
            return;
        }
        var hasResJSON = (!err || doc != null);
        var topsyObject = {
            "insertElementSelector" : "#topsy-twitter-comment",
            "title" : "Topsy/Twitter",
            "url" : doc.response.topsy_trackback_url,
            "count" : hasResJSON ? doc.response.total : 0,
            "comments" : topsyTwitter.format(doc, {
                ignoreNoComment : true,
                ignoreReTweet : true
            })
        };
        SSS.panel.port.emit(constants.panel.seeing, topsyObject);
        if (typeof callback === "function"){
            callback(err, doc);
        }
    });
}
