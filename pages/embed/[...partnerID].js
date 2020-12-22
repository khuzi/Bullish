import React from 'react';
import Head from 'next/head';
import { JWPlayerManager } from 'src/lib/jwPlayerManager';
import Marked from 'marked';

export default class PlayerA extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            watchVideo: this.props.firstVideo
        }
        this.showMore = this.showMore.bind(this);
        this.initializePlayer = this.initializePlayer.bind(this);
    }

    state = {
        watchVideo: null,
        initialized: false,
        readMore: false,
        focus: false,
        focusChanged: 0
    }

    getProperImage(images) {
        let returnImage = null;
        if (window.innerWidth <= 320 && images.find(element => (element.width <= 320))) {
            returnImage = images.find(element => element.width == 320);
        } else if (window.innerWidth <= 480 && images.find(element => (element.width <= 480))) {
            returnImage = images.find(element => (element.width <= 480));
        } else if (window.innerWidth <= 640 && images.find(element => (element.width <= 640))) {
            returnImage = images.find(element => (element.width <= 640));
        } else if (window.innerWidth <= 720 && images.find(element => (element.width <= 720))) {
            returnImage = images.find(element => (element.width <= 720));
        }
        returnImage = images[images.length - 1];
        return returnImage;
    }

    getProperVideSource(videos) {
        let returnVideoSource = null;
        if (window.innerWidth <= 320 && videos.find(element => (element.width <= 320))) {
            returnVideoSource = videos.find(element => (element.width <= 320));
        } else if (window.innerWidth <= 480 && videos.find(element => (element.width <= 480))) {
            returnVideoSource = videos.find(element => (element.width <= 480));
        } else if (window.innerWidth <= 640 && videos.find(element => (element.width <= 640))) {
            returnVideoSource = videos.find(element => (element.width <= 640));
        } else if (window.innerWidth <= 720 && videos.find(element => (element.width <= 720))) {
            returnVideoSource = videos.find(element => (element.width <= 720));
        } else {
            returnVideoSource = videos[videos.length - 1];
        }
        return returnVideoSource;
    }

    showLoadingScreen(){
        window['$'](".loading-screen").removeClass("hidden");
    }

    hideLoadingScreen(){
        window['$'](".loading-screen").addClass("hidden");
    }

    setPlayerVideo(videoItem, autoStart){
        const setUp = {
            floating: true,
            autostart: autoStart || false,
            //mute: true
        };

        if(this.props.recommended){
            let playlist = this.props.recommended;
            let index = this.props.recommended.indexOf(playlist.find(playListItem => (playListItem.mediaid === videoItem.mediaid)));
            setUp.playlist = playlist;
            setUp.item = index;
        }

        if(this.props.advertising){
            setUp.advertising = this.props.advertising;
        }
        this.player.setup(setUp);

        if(this.state.initialized){
            this.showLoadingScreen();
            this.scrollTop();
        }else{
            this.setState({initialized: true})
        }
        this.setVideoDataItem(videoItem);
        setTimeout(()=>{
            this.communicateScreenResize();
        }, 600)
    }

    interactWithBrowser(){
        let click_event = new CustomEvent('click');
        document.body.dispatchEvent(click_event);
        document.body.click();
    }

    /**
     * @description Sets the item to play.
     * @param {object} videoItem The item to set as current. Used for text ton display
     */
    setVideoDataItem(videoItem){
        this.setState({
            watchVideo: videoItem,
            readMore: false
        }, ()=>{
            setTimeout(()=>{
                //this.setNeonHeight();
                this.hideLoadingScreen();
                this.communicateScreenResize();
            }, 300)
        });
    }
    
    communicateScreenResize(){
        console.log("Communicating screen resize...");
        window.parent.postMessage({
            'from': "resize",
            size: document.body.scrollHeight
        })
    }

    timeDiff(from, to = new Date().getTime()){
        return (to - from);
    }

    get player(){
        if(!window['jwplayer']){
            return null;
        }
        return window['jwplayer']("playerDiv");
    }

    goFullScreen(){
        //Test full screen
        var click_event = new CustomEvent('click');
        let btn_element = document.querySelector(".jw-icon-fullscreen");
        //return btn_element;
        $(".jw-icon-fullscreen").on("click", function(ev){
            try{
                console.log(JSON.stringify(ev));
            }catch(e){
                console.log("Error...");
            }
        });
        //this.player.setFullscreen();
        if(!this.player.getFullscreen()){
            //this.player.setFullscreen();
        }
        //btn_element.dispatchEvent(click_event);
    }

    

    initializePlayer(){
        this.setPlayerVideo(this.state.watchVideo);
        this.player.on("ready", ()=>{
            //console.debug("onReady function called. Slowing down recommended animations...");
            //this.slowDownRecommendedAnimations();
            //console.debug("Hiding loading screen...");
            this.hideLoadingScreen();
            this.handleFocus();
            this.communicateScreenResize();
        })
        /*
        this.player.on("complete", ()=>{
            console.log("Playback finished...");
        })
        */
        this.player.on("firstFrame", ()=>{
            let current = this.state.watchVideo;
            let currentPlaying = this.player.getPlaylistItem();
            //console.log({current, currentPlaying});
            if(current.mediaid !== currentPlaying.mediaid){
                //console.log("Not the same...");
                this.setVideoDataItem(currentPlaying);
            }
            this.goFullScreen();
        })
    }

    /**
     * @description Initializes the player
     */
    play(){
        //Plays the player
        this.player.play();
    }

    /**
     * @description Pauses the player
     */
    pause(){
        this.player.pause();
    }

    handleFocus(){
        //console.log("handleFocus set-up");
        window.onmessage = (e) => {
            //console.log("window.onmessage -- 0");
            if (e.data == 'focusGained') {
                if(!this.state.focus){
                    if(
                        (this.state.focusChanged && (this.timeDiff(this.state.focusChanged) > 500))
                        || !this.state.focusChanged
                    ){
                        this.setState({
                            focus: true,
                            focusChanged: new Date().getTime()
                        });
                        console.log("Focus gained. Playing video.");
                        this.play();
                    }
                }
                //console.log("Focused gained");
            }else if(e.data == 'focusLost'){
                if(this.state.focus){
                    if(
                        (this.state.focusChanged && (this.timeDiff(this.state.focusChanged) > 500))
                        || !this.state.focusChanged
                    ){
                        this.setState({
                            focus: false,
                            focusChanged: new Date().getTime()
                        });
                        console.log("Focus lost. Pausing video.");
                        this.pause();
                    }
                }
            }
        };
    }

    scrollTop(){
        $($("#ihmu").context).scrollTop(0, 0);
    }

    setNeonHeight(){
        let heightPixels = $("#ion5").height();
        $("#__next > .neon-effect").css({
            height: `${heightPixels}px`,
            position: 'absolute'
        })
    }

    componentDidMount() {
        setTimeout(() => {
            this.interactWithBrowser();
            this.initializePlayer();
        }, 1500);
        window['readMore'] = function(){
            this.setState({
                readMore: true
            }, ()=>{
                setTimeout(()=>{
                    this.communicateScreenResize();
                }, 100);
            })
        }
        window['readMore'] = window['readMore'].bind(this);
        $(document).ready(() =>  {
            setTimeout(() => {
                const vertical = window.innerWidth < 600;

                let itemsAmmount = 6;
                if (window.innerWidth < 400) {
                    itemsAmmount = 2
                } else if (window.innerWidth < 600) {
                    itemsAmmount = 3
                } else if (window.innerWidth < 1200) {
                    itemsAmmount = 4
                } else if (window.innerWidth < 1600) {
                    itemsAmmount = 5
                }
                if(!vertical){
                    $("#lightSlider").lightSlider({
                        adaptiveHeight: true,
                        loop: true,
                        item: itemsAmmount
                    });
    
                    const sliderWidth = $("#lightSlider").parent().innerWidth();
                    $("#lightSlider li > .text-container").css({
                        height: "fit-content"
                    });
    
                    const textHeight = $($("#lightSlider li > .text-container")[0]).innerHeight();
                    const itemHeight = parseInt((sliderWidth / itemsAmmount) * 0.55);
    
                    $("#lightSlider > li").css({
                        "minHeight": `${itemHeight + textHeight}px`,
                        "maxHeight": `${itemHeight + textHeight}px`,
                        position: "relative"
                    })

                    $(".recommended-logo").css({
                        "width":"20%"
                    })

                    $("#lightSlider li > div").css({
                        height: `${itemHeight}px`,
                        "margin-bottom": `${textHeight}px`
                    })
    
                    $("#lightSlider li > .text-container").css({
                        "bottom": "0px",
                        "margin-bottom": "0px",
                        "height": "fit-content"
                    });
    
                    ///*
    
                    setTimeout(() => {
                        let listItemWidth = $($("#lightSlider li")[1]).outerWidth() - 1;
                        listItemWidth = Math.floor(listItemWidth);
                        $("#lightSlider li > div").css("width", `${listItemWidth}px`);
                    }, 250)
                    //*/
                    setTimeout(this.setNeonHeight, 2000);
                }else{
                    $("#lightSlider").addClass("vertical");
                    setTimeout(()=>{
                        $("#lightSlider li .text-container").css({
                            height: `${$("#lightSlider li").height()}px`,
                            "padding-top": "5px"
                        })
                    },250)

                    let items = window['$']("#lightSlider li").length;
                    let firstHeight = $("#lightSlider > li:nth-child(1)").height();

                    this.setState({
                        itemHeight: firstHeight + 20,
                        itemsLength: items,
                        current: 1
                    });
                }
            }, 500)
        });
    }

    getHTML(element){
        if(this.state.readMore || element.length < 500){
            return Marked(element);
        }else{
            return Marked(element.substr(0, 500)+"... <span class='read-more' onClick='readMore()'>Read More</span>");
        }
    }

    selectRecommended(element){
        this.setPlayerVideo(element, true);
    }

    getVideoDisplayDuration(duration){
        let minutes = Math.floor(duration/60);
        let seconds = duration%60;
        if(minutes < 10){
            minutes = `0${minutes}`
        }
        if(seconds<10){
            seconds = `0${seconds}`
        }
        return `${minutes}:${seconds}`
    }

    showMore(){
        if(this.state.itemHeight && (this.state.current <= this.state.itemsLength)){
            this.setState({
                current: ((this.state.current + 5) > this.state.itemsLength) ? this.state.itemsLength : this.state.current + 5
            })
            setTimeout(()=>{
                this.communicateScreenResize();
            }, 300)
        }
    }

    showMoreHorizontal(){
        let element = document.querySelector(".lSAction .lSNext");
        if(element){
            element.click();
        }else{
            console.log("Didn't find click element...", element);
        }
    }

    get height(){
        return this.state.itemHeight ? (this.state.itemHeight * this.state.current) : "fit-content";
    }

    render() {
        return (
            <>
                <Head>
                    <script type="text/javascript" src={`https://cdn.jwplayer.com/libraries/${this.props.custom ? this.props.custom.custom_player_id : "vhU0NHpZ"}.js`} />
                    <link rel="stylesheet" href="/lightslider-master/dist/css/lightslider.min.css" />
                    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
                    <link rel="stylesheet" href="/styles/jwplayer/custom/player1.css" />
                    <link rel="stylesheet" href="/styles/neon.css" />
                    <script src="/lightslider-master/dist/js/lightslider.min.js"></script>
                    <style>
                    {
                        (this.props.custom && this.props.custom.css) ? this.props.custom.css : ".non-existing-class {}"
                    }
                    </style>

                </Head>
                <div className="loading-screen">
                    <h1>Loading...</h1>
                </div>
                <div className="row rounded" id="ion5">
                    <div className="cell rounded" id="ij56" style={{ minWidth: '80vw', margin:'2px' }}>
                        <div className="video-content">
                            <div className="row" id="imgge">
                                <div className="cell" id="iwpts">
                                    <div id="ijoro">
                                        <div>NEW
                                        </div>
                                    </div>
                                    <div id="in6bg">
                                        <div>RECOMMENDED VIDEO
                                        </div>
                                    </div>
                                    <div id="purpleImageContainer">
                                        <img src="/images/embed/triangle3.png"/>
                                    </div>
                                </div>
                            </div>
                            <div id="ihmu">
                                <h1>
                                    {this.state.watchVideo.title}
                                </h1>
                                <div className="neon-player" style={{
                                }}>
                                    <div className="neon" style={{ width: '100%', height: 'auto', border: '3px solid white' }}>
                                        <div id="playerDiv" />
                                    </div>
                                </div>
                            </div>
                            <div className="video-text-content">
                                <div id="iauj" dangerouslySetInnerHTML={{ __html: this.getHTML(this.state.watchVideo.description) }}>
                                </div>
                                <div id="videoAction">
                                    <a href="https://bullish.news?utm_source=player" target="_blank">
                                        <img src="/images/embed/logo_1.png"/>
                                    </a>
                                </div>
                            </div>

                        </div>
                        <div className="watch-later-container">

                            <h4 className="watch-later">Watch This Next</h4>

                            <div className="watch-later-videos">
                                <div className="watch-more span-container">
                                    <span onClick={this.showMoreHorizontal}>More</span>
                                </div>
                                <ul id="lightSlider" className="video-recommendations" style={{height: this.height}}>
                                    {
                                        ((this.props.recommended && this.props.recommended.length) ? this.props.recommended : []).map((element, index) => {
                                            return (
                                                <li style={{
                                                    //background:`url("${element.images[1].src}")`, 
                                                    //backgroundSize:'cover'
                                                }} key={`slow-playlist-item-${index}`}>
                                                    <div className="play-button" onClick={()=>this.selectRecommended(element)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="jw-svg-icon jw-svg-icon-play" viewBox="0 0 240 240" focusable="false"><path d="M62.8,199.5c-1,0.8-2.4,0.6-3.3-0.4c-0.4-0.5-0.6-1.1-0.5-1.8V42.6c-0.2-1.3,0.7-2.4,1.9-2.6c0.7-0.1,1.3,0.1,1.9,0.4l154.7,77.7c2.1,1.1,2.1,2.8,0,3.8L62.8,199.5z"></path></svg>
                                                    </div>
                                                    <div className="item-content">
                                                        <div className="content">
                                                            <img src={element.images[1].src} style={{ width: "100%", height: "100%" }} />
                                                            <span className="duration">{this.getVideoDisplayDuration(element.duration)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-container">
                                                        <div className="text-container-b">
                                                            <div className="content-title first">
                                                                <h3>{element.title}</h3>
                                                            </div>
                                                            <div className="content-title second">
                                                                <h4>{element.description}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <img src="/images/embed/logo_1.png" className="recommended-logo"/>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="read-more-button-container" onClick={this.showMore}>
                                <span className="read-more-button">View More</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export async function getServerSideProps({ params, req, query }) {

    const Marked = require("marked");
    console.log("Getting embed content...");
    let playlist, firstVideo, partnerData, playlistContext = JWPlayerManager.getEmbedContext(req, query || {});
    if (params.partnerID) {
        try {
            console.log({playlistContext});
            partnerData = await JWPlayerManager.getPartnerPlaylist(params.partnerID, playlistContext);
        } catch (e) {
            console.log("Error present: " + e);
            console.log("Getting test playlist...");
            partnerData = await JWPlayerManager.getTestPlaylist();
        }
        playlist = partnerData.playlist;
        firstVideo = {
            title: playlist[0].title,
            description: playlist[0].description,
            descriptionHTML: Marked(playlist[0].description),
            tags: playlist[0].tags,
            images: playlist[0].images,
            sources: playlist[0].sources,
            mediaid: playlist[0].mediaid
        };
    } else {
        partnerData = await JWPlayerManager.getTestPlaylist();
        playlist = partnerData.playlist;
        firstVideo = {
            title: partnerData.playlist[0].title,
            description: partnerData.playlist[0].description,
            descriptionHTML: Marked(partnerData.playlist[0].description),
            tags: partnerData.playlist[0].tags,
            images: partnerData.playlist[0].images,
            sources: partnerData.playlist[0].sources,
            mediaid: partnerData.playlist[0].mediaid
        };
    }

    return {
        props: {
            recommended: playlist,
            firstVideo,
            custom: partnerData.custom || null,
            advertising: partnerData.advertising
        }
    }
}