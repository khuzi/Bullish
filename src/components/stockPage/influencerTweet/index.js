import { Utils } from "@components/common/util";
import React from "react";
import * as moment from 'moment';
import Formatter from '@components/common/formatter'


export class InfluencerTweet extends React.Component {

    state = {
        elementID: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            elementID: parseInt(`${Math.random() * 1e5}`)
        }
    }

    /**
     * @description Sets the tweeter embed.
     * @param {number} id The ID for the twitter embed.
     */
    setTweetEmbed(tweetId) {
        /**
         * @type {import("@lib/tweetsManager").StockTweet}
         */
        let container = document.getElementById(this.props.elementID);
        if(!container){
            return;
        }

        window.twttr.widgets.createTweet(
            `${tweetId}`,
            container,
            {
                theme: 'dark',
                conversation: 'none',    // or all
                cards: 'hidden',  // or visible 
                linkColor: '#cc0000', // default is blue
                //theme        : 'light'    // or dark
            }
        ).then((data) => {
            if (!data) {
                this.setTweetEmbed(20);
            }
        }).catch((err) => {
            console.log({ err });
        });
    }

    componentDidMount() {
        Utils.WaitForCondition(() => {
            return !!window['twttr'];
        }).then(() => {
            setTimeout(() => {
                //this.setTweetEmbed(this.props.tweet.tweetId);
            }, 1000)
        })
    }

    /**
     * 
     * @param {string} gmtString The GMT date string
     */
    getDate(gmtString){
        return moment(gmtString).format("HH:mm A MMMM DD, YYYY");
    }


    render() {
        /**
         * @type {import("@lib/tweetsManager").StockTweet}
         */
        let tweet = this.props.tweet;
        //console.log({ tweet });
        //const iframe = '<iframe src="https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/463440424141459456></iframe>'; 
        //function createMarkup() {
        //    return { __html: iframe };
        //}
        /*
        const tweetStyle = {
            display: "flex",
            minWidth: "250px",
            maxWidth: "550px",
            width: "100%",
            height: "171px",
            overflow: "hidden",
            marginTop: "10px",
            marginBottom: "10px",
            transition: "background-color, box-shadow",
            transitionDuration: "0.2s",
            padding: "15px",
            backgroundColor: "#000",
            alignItems: "stretch",
            flexDirection: "column",
            cursor: "pointer",
            borderRadius: "12px",
        }

        const tweetUserInfoStyle = {
            paddingBottom: "10px",
            display: "flex",
            alignItems: "stretch",
            flexBasis: "auto",
        }

        const tweetUserImageStyle = {
            width: "49px",
            height: "49px",
            borderRadius: "50%",
            overflow: "hidden",
        }

        const tweetUserNameContainer = {
            maxWidth: "calc(100% - 84px)",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            margin: "0 5px",
        }

        const tweetUserName = { // include icon - shared style
            fontSize: "15px",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            color: "rgb(217,217,217)",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif",
            overflowWrap: "break-word",
            lineHeight: "1.3125rem",
            textOverflow: "elipsis",
        }

        const tweetUserAlias = {
            flexShrink: "1",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif",
            color: "rgb(110, 118, 125)",
            fontSize: "14px"
        }

        const tweetContent = {
            marginTop: "5px",
            fontSize: "19px",
            cursor: "text",
            color: "rgb(217,217,217)",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif",
            overflowWrap: "break-word",
            lineHeight: "1.3125rem",
            textOverflow: "elipsis",
        }

        const tweetDate = { // include info icon?
            display: "flex",
            marginTop: "5px",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif",
            fontSize: "15px",
            color: "rgb(110, 118, 125)",
        }

        const tweetInfoIcon = {
            width: "30px",
            height: "30px",
            marginRight: "-5px",
        }

        const tweetFooter = {
            display: "flex",
            marginTop: "5px",
            paddingTop: "5px",
            borderTop: "1px solid rgb(47, 51, 54)",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif",
            fontSize: "15px",
            color: "rgb(110, 118, 125)",
        }

        const tweetLikesicon = { // al footer icons
            height: "30px",
            width: "30px",
            marginLeft: "-5px",
            color: "rgb(110, 118, 125)"
        }

        const tweetCommentsText = {
            fontSize: "15px",
            marginLeft: "5px",
            color: "rgb(110, 118, 125)",
            // same font family
        }
        */

        // commentsIcon <svg viewBox="0 0 24 24" class="r-9ilb82 r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>

        // hearticon <svg viewBox="0 0 24 24" class="r-9ilb82 r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr" style=""><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg><svg viewBox="0 0 24 24" class="r-9ilb82 r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr" style=""><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>

        // info icon <svg viewBox="0 0 24 24" class="r-9ilb82 r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M12 18.042c-.553 0-1-.447-1-1v-5.5c0-.553.447-1 1-1s1 .447 1 1v5.5c0 .553-.447 1-1 1z"></path><circle cx="12" cy="8.042" r="1.25"></circle><path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></path></g></svg>

        {/* Pigeon SVG =  <svg viewBox="0 0 24 24" class="r-1fmj7o5 r-4qtqp9 r-yyyyoo r-6zzn7w r-19fsva8 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-q1j0wu"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg> */ }

        // <svg viewBox="0 0 24 24" aria-label="Verified account" class="r-1fmj7o5 r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>

        
        return (
            <>

                <blockquote className="influencer-tweet tweetStyle" data-lang="en">
                {/* <a href="https://twitter.com/jack/status/20">March 21, 2006</a>  SHOULD CONTAIN THE WHOLE BLOCK */}
                    <div className="tweet-user-info tweetUserInfoStyle">
                        <a target="_blank" href={Formatter.getTweetLink(tweet.tweetUserID, tweet.tweetId)}>
                            <i className="fab fa-twitter twitterIcon"/>
                        </a>
                    </div>
                    <div className="tweet-content tweetContent">
                        {
                            tweet.tweetContent
                        }
                    </div>
                    <div className="tweet-date tweetDate">
                        <a target="_blank" href={Formatter.getTweetLink(tweet.tweetUserID, tweet.tweetId)}>
                        {
                            this.getDate(tweet.tweetDate)
                        }
                        </a>
                    </div>
                </blockquote>
                {
                    false ? <div id={this.props.elementID} tweetid={tweet.tweetId}></div> : <></>
                }
            </>
        );
    }
}
