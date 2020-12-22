import React from 'react';
import Head from 'next/head';

export default class AdminHeadComponent extends React.Component {

    render() {
        return (
            <>
                <Head key='main'>
                    <title>{this.props.meta.title}</title>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous" />
                    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossOrigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossOrigin="anonymous"></script>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossOrigin="anonymous"></script>

                    <script src="https://d3js.org/d3.v5.min.js"></script>
                    <script src="/range_slider/d3RangeSlider.js"></script>
                    <link href="/range_slider/d3RangeSlider.css" rel="stylesheet" />

                    <meta name="viewport" content="width=device-width, user-scalable=no" />
                </Head>
                {
                    (this.props.meta.tags).map((element, key) => {
                        return (
                            <Head key={`head-meta-${element.property}`}>
                                <meta property={element.property} key={key} content={element.content} />
                            </Head>
                        )
                    })
                }
            </>
        )
    }
}