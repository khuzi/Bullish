import React from 'react';
import { Utils } from '@components/common/util';
import CategoryComponent from '../component_category_span';
import Router from 'next/router';
import { VideoCard } from '../card';
import { SortElement } from '../sort_element';
import { JWPVideo } from 'src/docs/jstypes';

export class VideoListTemplateA extends React.Component {

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
        this.sort = this.sort.bind(this);
        this.state.videos = this.props.videos;
    }

    /**
     * @description Appends new videos loaded asynchronously (front-end side)
     * @param {JWPVideo[]} videoElements The new video elements to append
     */
    onNewVideosLoaded(videoElements){
        this.setState({
            videos: this.state.videos.concat(videoElements)
        })
    }

    /**
     * @description Appends videos loaded asynchronously (front-end side)
     * @param {JWPVideo[]} videoElements The new video elements to set
     */
    setVideos(videoElements){
        this.setState({
            videos: videoElements
        });
    }

    sort(ev){
        const {target} = ev;
        const {name} = target;
        const sort = Utils.getSortObject(Router);
        let newSort = `${name}:asc`;

        if(sort && sort.attribute === name){
            //Reverse sort
            let newDir = sort.dir === 'asc' ? "dsc": "asc";
            newSort = `${name}:${newDir}`;
        }
        //console.log({newSort, sort});
        const url = Utils.assembleRouterSearchURL(Router, null, null, newSort);
        Router.push(url);
    }


    render() {
        return (
            <div className="video-block section-padding video_template_a">
                <div className="row">
                    <div className="col-md-12">
                        <div className="main-title">
                            <SortElement sort={this.sort}/>
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
                        this.state.videos.map((element, index) => (
                            <div className="col-xl-3 col-sm-6 mb-3" key={index}>
                                <VideoCard element={element} key={index}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}