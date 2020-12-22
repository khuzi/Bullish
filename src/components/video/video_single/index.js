import { Utils } from '@components/common/util';
import React from 'react';
import Head from 'next/head';
import CategoryComponent from '../component_category_span';
import { ROUTES } from 'src/const';
import Router from 'next/router';
import { ShowRecord } from 'src/docs/jstypes';
import { SeriesPartWidget } from '../show/show_series_part';

export class VideoSingle extends React.Component {
    state = {
        video: null
    }

    constructor(props){
        super(props);
        this.state.video = this.props.video;
        this.handleScrollBehavior = this.handleScrollBehavior.bind(this);
        this.isVideoOnView = this.isVideoOnView.bind(this);
    }

    componentDidMount(){
        this.setPlayerVideo(this.props.video);
        console.log("Adding scroll listener")
        document.addEventListener("scroll", this.handleScrollBehavior)
    }

    componentWillUnmount(){
        document.removeEventListener("scroll", this.handleScrollBehavior, true)
        if(this.player){
            this.player.remove();
        }
    }

    get player(){
        if(window['jwplayer']){
            return window['jwplayer']("videoPlayerContainer");
        }else{
            return null;
        }
    }

    get isOnMobile(){
        return (document.documentElement.offsetWidth <= 480);
    }

    handleScrollBehavior(){
        if(!this.isOnMobile){
            return;
        }

        let element = document.getElementById("videoPlayerContainer");
        if(!element){
            return;
        }
        if(this.isVideoOnView()){
            if(element.classList.contains("jw-flag-floating")){
                element.classList.remove("jw-flag-floating");
                $(element.querySelector(".jw-wrapper.jw-reset")).css({
                    top: 0
                })
            }
        }else{
            if(!element.classList.contains("jw-flag-floating")){
                element.classList.add("jw-flag-floating");
                $(element.querySelector(".jw-wrapper.jw-reset")).css({
                    top: document.querySelector(".navbar.navbar-expand").offsetHeight
                })
            }
        }
    }

    componentDidUpdate(){
        if(this.props.video){
            if(this.state.video && this.props.video.mediaid){
               if(this.state.video.mediaid !== this.props.video.mediaid){
                   this.setPlayerVideo(this.props.video)
               }
            }
        }
    }

    isVideoOnView() {
        let videoBlockTop = document.querySelector(".video-block.section-padding").offsetTop;
        let navbarHeight = document.querySelector(".navbar.navbar-expand").clientHeight;
        let scrolled = document.documentElement.scrollTop;
        if(scrolled > (videoBlockTop - navbarHeight)){
            return false;
        }else{
            return true;
        }
    }


    setPlayerVideo(videoItem){
        Utils.WaitForCondition(()=>{
            return !!window['jwplayer']
        })
        .then(()=>{
            this.setState({
                video: videoItem
            })
            window['jwplayer']("videoPlayerContainer").setup({
                file: Utils.getProperVideSource(videoItem.sources).file,
                sources: videoItem.sources,
                image: Utils.getProperImage(videoItem.images).src,
                //autostart: true,
                floating: !this.isOnMobile,
                mute: false
            });
            window['jwplayer']("videoPlayerContainer").on("pause", (data)=>{
                let allowed = ["interaction", "external"];

                if(allowed.indexOf(data.pauseReason) < 0){
                    setTimeout(()=>{
                        window['jwplayer']("videoPlayerContainer").play();
                    }, 50)
                }
            });
            window['jwplayer']("videoPlayerContainer").on("complete", ()=> {
                if(this.props.playlist){
                    const currentVideoIndex = this.props.playlist.findIndex(video => video.mediaid==videoItem.mediaid);
                    const nextVideo=  currentVideoIndex<0 ? this.props.playlist[0].mediaid : this.props.playlist[currentVideoIndex+1].mediaid
                    Router.push(`${ROUTES.VIDEO}/${nextVideo}`);
                }
                //console.log("complete")
                //console.log(this.props.playlist)
                //console.log(videoItem)
                //console.log(this.props.playlist.findIndex(video => video.mediaid==videoItem.mediaid))
            });
        })
        .catch(err => {
            this.setState({
                video: null
            })
            console.log({err});
        })
    }

    render() {
        /**
         * @type {ShowRecord}
         */
        let series = this.props.series;
        console.log({series});

        return (
            <div className="single-video-left">
                <div className="single-video">
                    <div id="videoPlayerContainer"></div>
                </div>
                <div className="single-video-title box mb-3">
                    <h2>{this.state.video.title}</h2>
                    <p className="mb-0"><i className="fas fa-eye"></i> 2,729,347 views</p>
                    {
                        series ? <SeriesPartWidget series={series}/> : <></>
                    }
                </div>
                <div className="single-video-author box mb-3" style={{display:'none'}}>
                    <img className="img-fluid" src="/vidoe_template/img/s4.png" alt="" />
                    <p><a href="#"><strong>Osahan Channel</strong></a>
                        <span title="" data-placement="top" data-toggle="tooltip" data-original-title="Verified"><i className="fas fa-check-circle text-success"></i></span></p>
                    <small>Published on {Utils.getSingleVideoDate(this.state.video.pubdate * 1000)}</small>
                </div>
                <div className="single-video-info-content box mb-3">
                    <h6>About :</h6>
                    <div dangerouslySetInnerHTML={{__html:Utils.toHTML(this.state.video.description)}}>
                    </div>
                    <h6>Tags :</h6>
                    <p className="tags mb-0">
                        {
                            this.state.video.tags ? this.state.video.tags.split(",").map((element, index) => (
                                <CategoryComponent key={index} element={element}/>
                            )) : <></>
                        }
                    </p>
                </div>
                <Head>
                    <script type="text/javascript" src="https://cdn.jwplayer.com/libraries/61XCMcs0.js" />
                </Head>
            </div>
        )
    }
}