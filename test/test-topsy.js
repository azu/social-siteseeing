/**
 * Created by azu.
 * Date: 12/12/31 22:45
 * License: MIT License
 */

var topsy = require("topsy-twitter");
require("console-dir");

function stubFn(){
    var fn = function(){
        fn.called = true;
    }
    fn.called = false;
    return fn;
}
function AsyncTest(name, testCase){
    var testName = name.replace(/\s/g, "_");
    exports[testName] = function(test){
        test.waitUntilDone();
        testCase(test);
    }
}
function Test(name, testCase){
    var testName = name.replace(/\s/g, "_");
    exports[testName] = function(test){
        testCase(test);
    }
}

// main test
AsyncTest("test get json", function(test){
    topsy.getTopsyJSON("http://efcl.info/", function(){
        test.pass();
        test.done();
    });
});

(function(){
    var response = {
        "request" : {
            "parameters" : {
                "url" : "http://topsy.com/"
            },
            "response_type" : "json",
            "resource" : "trackbacks",
            "url" : "http://otter.topsy.com/trackbacks.json?url=http%3A%2F%2Ftopsy.com%2F"
        },
        "response" : {
            "topsy_trackback_url" : "http://topsy.com/tb/topsy.com/",
            "page" : 1,
            "total" : "1931",
            "perpage" : 10,
            "list" : [
                {
                    "permalink_url" : "http://twitter.com/imadnaffa/status/3565855201",
                    "date" : "1251324809",
                    "content" : "TOPSY - A search engine powered by tweets: http://topsy.com (this Search Engine can be powerful for sifting through Twitter- love it)!",
                    "type" : "tweet",
                    "author" : {
                        "url" : "http://twitter.com/imadnaffa",
                        "name" : "Imad Naffa",
                        "photo_url" : "http://a3.twimg.com/profile_images/378575667/imad_blue_shirt_normal.jpg",
                        "topsy_author_url" : "http://topsy.com/twitter/imadnaffa",
                        "influence_level" : "4"
                    },
                    "date_alpha" : "6 hours ago"
                },
                // no comment
                {
                    "permalink_url" : "http://twitter.com/imadnaffa/status/3565855201",
                    "date" : "1251324809",
                    "content" : "",
                    "type" : "tweet",
                    "author" : {
                        "url" : "http://twitter.com/imadnaffa",
                        "name" : "Imad Naffa",
                        "photo_url" : "http://a3.twimg.com/profile_images/378575667/imad_blue_shirt_normal.jpg",
                        "topsy_author_url" : "http://topsy.com/twitter/imadnaffa",
                        "influence_level" : "4"
                    },
                    "date_alpha" : "6 hours ago"
                },
            ]
        }
    }

    Test("test json format", function(test){
        var results = topsy.format(response);
        test.assertArray(results);
        var expectedCount = response.response.list.length;
        test.assertStrictEqual(expectedCount, results.length);
    });

    Test("test json format - ignore option", function(test){
        var results = topsy.format(response, {
            ignoreNoComment : true
        });
        test.assertArray(results);

        // コメント無しは無視するので -1
        var expectedCount = response.response.list.length - 1;
        test.assertStrictEqual(expectedCount, results.length);
    })

})();
