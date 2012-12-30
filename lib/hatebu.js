/**
 * Created by azu.
 * Date: 12/10/08 16:28
 * License: MIT License
 */
var apiEndPoint = 'http://b.hatena.ne.jp/entry/json/?url=';
var request = require("request").Request;
var fbug = require("./fbug").fbug;
function getURL(url, callback){
    request({
        url : url,
        onComplete : function(response){
            callback(null, response.json);
        }
    }).get();
}
function getHatebuJSON(target, callback){
    var url = apiEndPoint + encodeURIComponent(target);
    getURL(url, function(err, content){
        if (err){
            return callback(err);
        }
        return callback(null, content);
    });
}

function parseDate(date){
    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
}
function format(json, option){
    var displayOption = (typeof option === "object") ? option : {};
    var bookmarks = json.bookmarks;
    var array = [];
    for (var i = 0, len = bookmarks.length; i < len; i++){
        var bookmark = bookmarks[i];
        if (displayOption.ignoreNoComment && bookmark.comment.length === 0){
            // fbug(bookmark);
        }else{
            array.push({
                "user" : bookmark.user,
                "user_image" : "http://cdn1.www.st-hatena.com/users/Ch/" + bookmark.user + "/profile.gif",
                "date" : parseDate(new Date(bookmark.timestamp)),
                "comment" : bookmark.comment
            });
        }
    }
    return array;
}


exports.getHatebuJSON = getHatebuJSON;
exports.format = format;
