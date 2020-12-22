import React, { Component } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"


export class ShowCarousel extends React.Component {

  render() {

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const shows=this.props.shows;

    return (
      <div style={{ display: "flex", maxWidth:"100vw", overflow:'hidden'}}>
        <div className="showCarousel">
          <Slider {...settings}>
            {shows.map((show, index) => <div key={index}>
                <div className="carouselCard">
                  <img className="wideBanner" src={show.poster_image_url} alt="" />
                <div className="description">
                  <h3>{show.name}</h3>
                  <h5>{show.description}</h5>
                </div>
              </div>
            </div>)}
          </Slider>
        </div>

      </div>
    );
  }
}