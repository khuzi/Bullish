window.addEventListener("load", function(){
    var iframeContainerId = "${__CONTAINER__}";
    var testing = parseInt("${__TESTING__}");
    var fitContent = parseInt("${__FIT_CONTENT__}");

    var iframeContainerAddress = Number.isInteger(testing) && testing ? "/embed/testPartner" : "${__URL__}";


    var iframeContainer = document.getElementById(iframeContainerId);
    if(!iframeContainer){
        throw new Error(`Specified container #${iframeContainerId} doesn't exist.`);
    }
    let iframe = document.createElement("iframe");
    let context = window.location.href;
    iframeContainerAddress+=`?context=${context}&use_context=1`;
    iframe.src = iframeContainerAddress;
    iframe.id = "bullishIframe"
    iframeContainer.appendChild(iframe);

    function checkVisible(elm) {
        var rect = elm.getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }
    if(fitContent){
        iframe.width = "100%"
    }

    function resizeIFrameToFitContent( iFrame ) {
        //width = iFrame.contentWindow.document.body.scrollWidth;
        //iFrame.width  = iFrame.contentWindow.document.body.scrollWidth;
        if(fitContent){
            console.log("Resizing screen...");
            var height = iFrame.contentWindow.document.body.scrollHeight;
            console.log({height});
            iFrame.style.height = `${height}px`;
        }else{
            console.log("Fit content not specified...");
        }
        //console.log({height});
    }

    //We make sure to interact with the browser
    iframe.onload= function(){
        let click_event = new CustomEvent('click');
        iframe.dispatchEvent(click_event);
        iframe.click();
        document.body.click();
        console.log("Loaded...");

        setTimeout(()=>{
            resizeIFrameToFitContent(iframe);
            handleVisibilityCheck(iframe);
        }, 500);
    };

    window.addEventListener("message", function(child_message){
        var iframe = document.querySelector("#bullishIframe");
        if(!iframe){
            return;
        }
        let from = child_message.data.from;
        if(from === "resize"){
            resizeIFrameToFitContent(iframe);
        }
    })

    function handleVisibilityCheck(){
        //console.log("Testing 1");
        if(checkVisible(iframe)){
            //console.log("Testing 2");
            iframe.contentWindow.postMessage("focusGained", {data:""})
        }else{
            //console.log("Testing 3");
            iframe.contentWindow.postMessage("focusLost", {data:""})
        }
    }


    //We make sure to interact with the browser
    iframe.onload=function(){
        let click_event = new CustomEvent('click');
        iframe.dispatchEvent(click_event);
        iframe.click();
    };

    //console.log({iframe, "iframe.contentWindow": iframe.contentWindow, testing, context});
    window.addEventListener("scroll", function(){
        //console.log("Scrolled");
        if(iframe && iframe.contentWindow){
            handleVisibilityCheck(iframe);
        }
    })
})