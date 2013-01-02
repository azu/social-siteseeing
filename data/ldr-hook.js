/**
 * Created by azu.
 * Date: 13/01/02 23:34
 * License: MIT License
 */
(function(){
    window.addEventListener("CONTENT_social_site_seeing_message", function(request){
        var res = request.data;
        if (res === "hide"){
            self.postMessage(res);
        }else{
            // PageMod -> Chrome
            self.postMessage(res);
        }
    }, false);
    // mainhook


    function evalInPage(func, args){
        var argStr = JSON.stringify(args || []);
        window.location.href = "javascript:void " + func + ".apply(null," + argStr + ")";
    }

    window.addEventListener("load", function(){
        evalInPage(function(){
            if (document.readyState === "complete"){
                hookMain();
            }else{
                window.addEventListener("load", function(){
                    hookMain();
                }, false);
            }
            function hookMain(){
                window.Keybind.add("m", function(){
                    var item = window.get_active_item(true);
                    if (item){
                        var permalink = item.link.replace(/#/, '%23');
                        pingToChrome(permalink);
                    }
                });
            }

            /*Chrome領域へ通知*/
            function pingToChrome(message){
                /* Content -> PageMod */
                var request = document.createEvent("MessageEvent");
                request.initMessageEvent("CONTENT_social_site_seeing_message", true, false,
                        message,
                        location.protocol + "//" + location.host,
                        "", window);
                document.dispatchEvent(request);
            }
        }, []);
    }, false);
})();
