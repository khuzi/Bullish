import { Utils } from '@components/common/util';
import React from 'react';
import Link from 'next/link';
import { ResponsiveAd } from '@components/ads/responsive';
import { SidebarCardsNwsLtr } from '@components/newsletter/sidebarCard';

import { ROUTES } from 'src/const';

/**
 * @description This video template is originally used on single-video pages.
 */
export class VideoListTemplateB extends React.Component {
    state = {
        client: false
    }

    componentDidMount(){
        this.setState({
            client: true
        })
    }

    /**
     * 
     * @param {{
            "src": string,
            "width": number,
            "type": string
        }[]} images 
     */
    getProperImageSrc(images){
        if(!this.state.client){
            return images[0].src;
        }else{
            return Utils.getProperImage(images).src;
        }
    }

    render() {
        return (
            <div className="single-video-right">
                <div className="row">
                    <div className="col-md-12">
                        <div className="adblock">
                            <div className="img" />
                                <ResponsiveAd/>
                            </div>
                        <div className="main-title" style={{display:'none'}}>
                            <div className="btn-group float-right right-action">
                                <a href="#" className="right-action-link text-gray" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Sort by <i className="fa fa-caret-down" aria-hidden="true"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="#"><i className="fas fa-fw fa-star"></i> &nbsp; Top Rated</a>
                                    <a className="dropdown-item" href="#"><i className="fas fa-fw fa-signal"></i> &nbsp; Viewed</a>
                                    <a className="dropdown-item" href="#"><i className="fas fa-fw fa-times-circle"></i> &nbsp; Close</a>
                                </div>
                            </div>
                            <h6>Up Next</h6>
                        </div>
                        <SidebarCardsNwsLtr/>

                    </div>
                    {
                        this.props.videos.map((element, index)=>(
                            <div className="col-md-12" key={index}>
                                <div className="video-card video-card-list">
                                    <div className="video-card-image">
                                        <Link href={`${ROUTES.VIDEO}/${element.mediaid}`}>
                                            <a className="play-icon"><i className="fas fa-play-circle"></i></a>
                                        </Link>
                                        <Link href={`${ROUTES.VIDEO}/${element.mediaid}`}>
                                            <a><img className="img-fluid" src={this.getProperImageSrc(element.images)} alt="" /></a>
                                        </Link>
                                        <div className="time">{Utils.getDuration(element.duration)}</div>
                                    </div>
                                    <div className="video-card-body">
                                        <div className="btn-group float-right right-action">
                                            <Link href={`${ROUTES.VIDEO}/${element.mediaid}`}>
                                                <a className="right-action-link text-gray" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                </a>
                                            </Link>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a className="dropdown-item" href="#"><i className="fas fa-fw fa-star"></i> &nbsp; Top Rated</a>
                                                <a className="dropdown-item" href="#"><i className="fas fa-fw fa-signal"></i> &nbsp; Viewed</a>
                                                <a className="dropdown-item" href="#"><i className="fas fa-fw fa-times-circle"></i> &nbsp; Close</a>
                                            </div>
                                        </div>
                                        <div className="video-title">
                                            <Link href={`${ROUTES.VIDEO}/${element.mediaid}`}>
                                                <a>{element.title}</a>
                                            </Link>
                                        </div>
                                        <div className="video-page text-success">
                                            {element.tags ? element.tags.split(",")[0] : ''}  <a title="" data-placement="top" data-toggle="tooltip" href="#" data-original-title="Verified"><i className="fas fa-check-circle text-success"></i></a>
                                        </div>
                                        <div className="video-view">
                                            {element.views} &nbsp;<i className="fas fa-calendar-alt"></i> {Utils.getTimeSince(element.pubdate*1000)}
                                            </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}