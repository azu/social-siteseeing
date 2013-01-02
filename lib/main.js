var data = require("self").data;
var hatebu = require("./hatebu");
var topsyTwitter = require("./topsy-twitter");
var tabs = require("tabs");
var Hotkey = require("hotkeys").Hotkey;
var fbug = require("./fbug").fbug;
var prefSet = require("simple-prefs");
var constants = require("./constants");

var SSS = {};
function createDescriptor(name){
    var value;
    return {
        get : function(){
            if (value){
                return value;
            }
            value = require("panel").Panel({
                width : prefSet.prefs.panelWidth,
                height : prefSet.prefs.panelHeight,
                contentURL : data.url("view.html"),
                contentScriptFile : [data.url("handlebars-1.0.rc.1.js"), data.url("contentScript.js")],
                onHide : function(){
                    SSS.panel.port.emit("clear");
                }
            });
            return value;
        }

    }
}
Object.defineProperty(SSS, "panel", createDescriptor("panel"));
// 設定が変更されたらパネルは作りなおす
var resizePanel = function(width, height){
    if(width && height){
        SSS.panel.resize(width, height);
    }else{
        SSS.panel.resize(prefSet.prefs.panelWidth, prefSet.prefs.panelHeight);
    }
};
prefSet.on("panelWidth", resizePanel);
prefSet.on("panelHeight", resizePanel);
// パネル内でリンクをクリックしたらタブで開く
SSS.panel.port.on("click-link", function(url){
    tabs.open(url);
});
var socialWidget = require("widget").Widget({
    id : "social-siteseeing-button",
    label : "Social Siteseeing",
    contentURL : "http://www.mozilla.org/favicon.ico",
    panel : SSS.panel,
    onClick : socialSeeing
});

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
var showHotKey = Hotkey({
    combo : "meta-shift-c",
    onPress : function(){
        if (SSS.panel.isShowing){
            SSS.panel.hide();
        }else{
            socialSeeing(function(err, doc){
                var item = getItemNodeForWidget(socialWidget);
                SSS.panel.show(item);
            });
        }
    }
});

function socialSeeing(callback){

    var targetURL = tabs.activeTab.url;
    hatebu.getHatebuJSON(targetURL, function(err, doc){
        if (err){
            console.log("getHatebuJSON:", err);
            return;
        }
        var hasResJSON = (!err || doc != null);
        var hatena = hasResJSON ? {
            "insertElementSelector" : "#hatena-bookmark",
            "title" : "はてなブックマーク",
            "count" : doc.count,
            "comments" : hatebu.format(doc, {
                ignoreNoComment : true
            }),
            "url" : doc.entry_url
        } : null;
        SSS.panel.port.emit(constants.panel.seeing, hatena);

        if (typeof callback === "function"){
            callback(err, doc);
        }
    });
    topsyTwitter.getTopsyJSON(targetURL, function(err, doc){
        if (err){
            console.log("getTopsyJSON:", err);
            return;
        }
        var hasResJSON = (!err || doc != null);
        var topsyObject = hasResJSON ? {
            "insertElementSelector" : "#topsy-twitter-comment",
            "title" : "Topsy/Twitter",
            "count" : doc.response.total,
            "comments" : topsyTwitter.format(doc, {
                ignoreNoComment : true
            }),
            "url" : doc.response.topsy_trackback_url
        } : null;
        SSS.panel.port.emit(constants.panel.seeing, topsyObject);
        if (typeof callback === "function"){
            callback(err, doc);
        }
    });
}
