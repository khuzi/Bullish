import React from 'react';


//"/vidoe_template/img/channel-banner.png"
//
export class ShowImage extends React.Component {

    /**
     * @returns {{url:string, from:string, iconClass:string}[]} The data parsed from social meta.
    */
    getSocial(){
        let {social} = this.props;

        let iconClass = {
            "facebook": "fab fa-facebook-f",
            "instagram": "fab fa-instagram",
            "tiktok": "fab fa-tiktok",
            "twitter": "fab fa-twitter",
            "youtube": "fab fa-youtube"
        }

        if(!social){
            return [];
        }

        /**
         * @type {string[]} The string
         */
        let keys = Object.keys(social).map(element => element.toLowerCase());

        // Check if we have keys
        if(!Array.isArray(keys)){
            return [];
        }

        let getSocialData = [];
        keys.map((key)=>{
            if(Array.isArray(social[key])){
                social[key].forEach((element)=>{
                    getSocialData.push({
                        url: element,
                        from: key,
                        iconClass: iconClass[key]
                    });
                })
            }else{
                getSocialData.push({
                    url: social[key],
                    from: key,
                    iconClass: iconClass[key]
                });
            }
        });

        return getSocialData;
    }


    render(){
        let {social} = this.props;
        console.log({social});
        return (
            <div className="single-channel-image" style={{background:`url(${this.props.poster})`, height: '40vh',
                backgroundPosition: "center",
                backgroundSize: "cover"}}>
                <img className="img-fluid" alt="" src={this.props.poster} style={{display:'none'}} />
                <div className="channel-profile">
                    <img className="channel-profile-img" alt="" src={this.props.profile} />
                    <div className="social hidden-sm">
                        {
                            this.getSocial().map((data, index)=>(
                                <a key={index} className={`social-item ${data.from.toLowerCase()}`} target="_blank" href={data.url}>
                                    {
                                        data.iconClass ? 
                                        <i className={data.iconClass}/> : <></>
                                    } &nbsp;
                                    {data.from}
                                </a>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}