var data = require("self").data;
var hatebu = require("./hatebu");
var topsy = require("./topsy");
var tabs = require("tabs");
var Hotkey = require("hotkeys").Hotkey;
var fbug = require("./fbug").fbug;
var constants = require("./constants");

var socialPanel = require("panel").Panel({
    width : 600,
    height : 300,
    contentURL : data.url("view.html"),
    contentScriptFile : [data.url("handlebars-1.0.rc.1.js"), data.url("contentScript.js")],
    onHide : function(){
        socialPanel.port.emit("clear");
    }
});
socialPanel.port.on("click-link", function(url){
    tabs.open(url);
});
var socialWidget = require("widget").Widget({
    id : "social-siteseeing-button",
    label : "Social Siteseeing",
    contentURL : "http://www.mozilla.org/favicon.ico",
    panel : socialPanel,
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
        if (socialPanel.isShowing){
            socialPanel.hide();
        }else{
            socialSeeing(function(err, doc){
                var item = getItemNodeForWidget(socialWidget);
                socialPanel.show(item);
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
        socialPanel.port.emit(constants.panel.seeing, hatena);

        if (typeof callback === "function"){
            callback(err, doc);
        }
    });
    topsy.getTopsyJSON(targetURL, function(err, doc){
        if (err){
            console.log("getTopsyJSON:", err);
            return;
        }
        var hasResJSON = (!err || doc != null);
        var topsyObject = hasResJSON ? {
            "insertElementSelector" : "#topsy-comment",
            "title" : "Topsy",
            "count" : doc.response.total,
            "comments" : topsy.format(doc, {
                ignoreNoComment : true
            }),
            "url" : doc.response.topsy_trackback_url
        } : null;
        socialPanel.port.emit(constants.panel.seeing, topsyObject);
        if (typeof callback === "function"){
            callback(err, doc);
        }
    });
}
