import React from 'react';
import { Utils } from '@components/common/util';
import CategoryComponent from '../component_category_span';
import Router from 'next/router';
import { VideoCard } from '../card';
import { SortElement } from '../sort_element';
import { JWPVideo } from 'src/docs/jstypes';
import { ResponsiveAd } from '@components/ads/responsive'

export class SingleVideoLowerVideoList extends React.Component {

    /**
     * @typedef {{
     *  videos: JWPVideo[]
     * }}
     */
    state = {
        videos: []
    }

    constructor(props){
        super(props);
        this.state.videos = this.props.videos;
        if(this.props.video){
            this.state.videos = this.state.videos.filter(element => {
                return (this.props.video.mediaid !== element.mediaid)
            })
        }
    }

    /**
     * @description Appends new videos loaded asynchronously (front-end side)
     * @param {JWPVideo[]} videoElements The new video elements to append
     */
    onNewVideosLoaded(videoElements){
        this.setVideos(this.state.videos.concat(videoElements));
    }

    /**
     * @description Sets new videos loaded asynchronously (front-end side)
     * @param {JWPVideo[]} videoElements The new videos elements to set
     */
    setVideos(newVideos){
        this.setState({
            videos: newVideos
        })
    }


    render() {

        //console.log({"this.state.videos": this.state.videos});
        return (
            <div className="video-block section-padding video_template_a">
                <div className="row">
                    <div className="col-md-12">
                        <div className="main-title">
                            <h6 className="text">{this.props.title || 'Featured Videos'}</h6>
                            <div className="tags">
                                {
                                    this.props.tags ? 
                                    this.props.tags.map((element, key) => (
                                        <CategoryComponent removeCategory={this.props.removeCategory} key={key} element={element} />
                                    )) : <></>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        this.state.videos.map((element, index) => {
                            if((index % 6) == 0){
                                return (
                                    <>
                                        <div className="col-sm-12 mb-3" key={`${index}-ad`}>
                                            <ResponsiveAd/>
                                        </div>
                                        <div className="col-xl-6 col-sm-6 mb-3" key={index}>
                                            <VideoCard element={element} key={index}/>
                                        </div>
                                    </>
                                );
                            }else{
                                return (
                                    <div className="col-xl-6 col-sm-6 mb-3" key={index}>
                                        <VideoCard element={element} key={index}/>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        );
    }
}