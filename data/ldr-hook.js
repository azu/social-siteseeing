/**
 * Created by azu.
 * Date: 13/01/02 23:34
 * License: MIT License
 */
(function(){
    // PageMod content
    window.addEventListener("CONTENT_social_site_seeing_message", function(request){
        var res = request.data;
        if (res === "hide"){
            self.postMessage(res);
        }else{
            // PageMod -> Chrome
            self.postMessage(res);
        }
    }, false);

    // main hook - execute in content page
    function evalInPage(func, args){
        var argStr = JSON.stringify(args || []);
        window.location.href = "javascript:void " + func + ".apply(null," + argStr + ")";
    }
    var bootstrap = function(){
        hookMain();
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
    };
    if (document.readyState === "complete"){
        evalInPage(bootstrap, []);
    }else{
        window.addEventListener("load", function(){
            evalInPage(bootstrap, []);
        }, false);
    }
})();
