import { Utils } from '@components/common/util';
import Link from 'next/link';
import React from 'react';
import { JWPVideo } from 'src/docs/jstypes';

const MENU_ACTION_ITEMS = {
    MAIN_ITEM: {
        href: "https://askbootstrap.com/preview/vidoe-v2-3/index.html"
    },
    ACTIONS:[{
        href: "https://askbootstrap.com/preview/vidoe-v2-3/index.html#",
        icon_class: "fas fa-fw fa-star",
        title: "Top Rated"
    },{
        href: "https://askbootstrap.com/preview/vidoe-v2-3/index.html#",
        icon_class: "fas fa-fw fa-signal",
        title: "Viewed"
    }]
}

const STOCKS = [
    {
        title: "TSLA",
        img_src: "/vidoe_template/img/s1.png",
        subtitle: "74,853 views",
        href: "#"
    },
    {
        title: "SOME",
        img_src: "/vidoe_template/img/s2.png",
        subtitle: "74,853 views",
        href: "#"
    },
    {
        title: "THING",
        img_src: "/vidoe_template/img/s3.png",
        subtitle: "74,853 views",
        href: "#"
    },
    {
        title: "ELSE",
        img_src: "/vidoe_template/img/s4.png",
        subtitle: "74,853 views",
        href: "#"
    },
    {
        title: "CHEV",
        img_src: "/vidoe_template/img/s5.png",
        subtitle: "74,853 views",
        href: "#"
    },
    {
        title: "OPER",
        img_src: "/vidoe_template/img/s6.png",
        subtitle: "74,853 views",
        href: "#"
    },
    {
        title: "CHRO",
        img_src: "/vidoe_template/img/s7.png",
        subtitle: "74,853 views",
        href: "#"
    },
    {
        title: "FIRE",
        img_src: "/vidoe_template/img/s8.png",
        subtitle: "74,853 views",
        href: "#"
    },
    {
        title: "MOZI",
        img_src: "/vidoe_template/img/s1.png",
        subtitle: "74,853 views",
        href: "#"
    },
]


export class TopCategorySection extends React.Component {

    componentDidMount(){
        Utils.WaitForCondition(()=>{
            return $(".owl-carousel-category") && (typeof $(".owl-carousel-category").owlCarousel === "function");
        })
        .then(element => {
            var objowlcarousel = $(".owl-carousel-category");
            if (objowlcarousel.length > 0) {
                objowlcarousel.owlCarousel({
                    items: 8,
                    lazyLoad: true,
                    pagination: false,
                    loop: true,
                    autoPlay: 2000,
                    navigation: true,
                    stopOnHover: true,
                    navigationText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"]
                });
            }
        })
        .catch(error => {
            console.log({error});
        })
    }

    render() {
        return (
            <div className="top-category section-padding mb-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="main-title">
                            <h6>{this.props.section_title || 'Most Popular Stocks'}</h6>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="owl-carousel owl-carousel-category">
                            {
                                (this.props.items || STOCKS).map((element, index) => (
                                    <div className="item" key={index}>
                                        <div className="category-item">
                                            <Link href={element.href}>
                                                <a>
                                                    <img className="img-fluid" src={element.img_src || "/images/stock_icon.png"} alt=""/>
                                                    <h6>{element.title}</h6>
                                                    <p>{element.subtitle}</p>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>  
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}