/**
 * Created by azu.
 * Date: 12/10/08 16:28
 * License: MIT License
 */
var apiEndPoint = 'http://b.hatena.ne.jp/entry/json/?url=';
var request = require("request").Request;
function getURL(url, callback){
    request({
        url : url,
        onComplete : function(response){
            var json = response.json;
            // https://twitter.com/azu_re/statuses/286509817202364416
            // はてなのバグっぽい挙動でnullを返すときもエラーではないとする
            if (json == null){
                callback(null, {
                    "count" : 0,
                    "entry_url" : "http://b.hatena.ne.jp/entry/" + url
                });
            }else{
                callback(null, json);
            }
        }
    }).get();
}
function getHatebuJSON(target, callback){
    var apiURL = apiEndPoint + encodeURIComponent(target);
    getURL(apiURL, function(err, content){
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
    if (!json || json.count === 0){
        return;
    }
    var displayOption = (typeof option === "object") ? option : {};
    var bookmarks = json.bookmarks;
    var array = [];
    for (var i = 0, len = bookmarks.length; i < len; i++){
        var bookmark = bookmarks[i];
        if (!(displayOption.ignoreNoComment && bookmark.comment.length === 0)){
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
