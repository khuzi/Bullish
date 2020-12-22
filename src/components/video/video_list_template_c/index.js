import { Utils } from '@components/common/util';
import React from 'react';
import { JWPVideo } from 'src/docs/jstypes';
import { VideoCard } from '../card';
import { SortElement } from '../sort_element';

export class ShowVideoList extends React.Component {

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
    }

    sort(ev){
        ev.preventDefault();
        const {target} = ev;
        const {name} = target;
        const sort = Utils.getSortObject(Router);
        let newSort = `${name}:asc`;

        if(sort && sort.attribute === name){
            //Reverse sort
            let newDir = sort.dir === 'asc' ? "dsc": "asc";
            newSort = `${name}:${newDir}`;
        }
        console.log({newSort, sort});
        const newURL = Utils.asembleRelativeSearchURL(Router, null, null, newSort);
        console.log({newURL});
        Router.push(newURL);
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

    render(){
        let description = this.props.showData.description;

        return (
            <div className="container-fluid">
                <div className="video-block section-padding">
                    <div className="row">
                        <div className="col-sm-12 description_text" dangerouslySetInnerHTML={{__html: Utils.toHTML(description)}}/>
                        <div className="col-md-12">
                            <div className="main-title">
                                <SortElement sort={this.sort}/>
                                <h6>Videos</h6>
                            </div>
                        </div>
                        {
                            this.state.videos.map((element, index) => (
                                <div key={index} className="col-xl-3 col-sm-6 mb-3" key={index}>
                                    <VideoCard element={element} key={index}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}