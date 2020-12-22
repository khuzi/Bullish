import React from 'react';

export class VideoFooter extends React.Component {
   constructor(props){
      super(props);
   }

   render() {
      return (
         <footer className="sticky-footer">
            <section className="section-padding footer-list">
               <div className="container">
                  <div className="row">
                     <div className="col-lg-3 col-md-3">
                        <div className="footer-logo mb-4"><a className="logo" href="index.html"><img alt="" src="/BULLISH_LOGO_white.png" className="img-fluid" /></a></div>
                        <p>{this.props.data ? this.props.data.BULLISH_DATA_ADDRESS : ''}</p>
                        <p className="mb-0"><a href="#" className="text-dark"><i className="fas fa-envelope fa-fw"></i> {this.props.data ? this.props.data.BULLISH_DATA_EMAIL : ''}</a></p>
                        <p className="mb-0"><a href="#" className="text-dark"><i className="fas fa-globe fa-fw"></i> {this.props.data ? this.props.data.BULLISH_DATA_URL : ''}</a></p>
                     </div>
                     <div className="col-lg-2 col-md-2">
                        <h6 className="mb-4">Company</h6>
                        <ul>
                           <li><a target="_blank" href="https://bullish.news/work-with-us/">How To Work With Us</a></li>
                           <li><a target="_blank" href="https://bullish.news/contact-us/">Contact Us</a></li>
                           <li><a target="_blank" href="https://bullish.news/privacy-policy/">Privacy Policy</a></li>
                           <li><a target="_blank" href="https://bullish.news/disclaimer/">Investing and Legal Disclaimer</a></li>
                        </ul>
                     </div>
                     <div className="col-lg-3 col-md-3">
                        <h6 className="mb-4">NEWSLETTER</h6>
                        <div className="input-group">
                           <input type="text" className="form-control" placeholder="Email Address..." />
                           <div className="input-group-append">
                              <button className="btn btn-primary" type="button"><i className="fas fa-arrow-right"></i></button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-xs-12 powered-by-container">
                        <div className="powered-by">
                           <span>Powered by <a href="https://magyk.cloud/" target="_blank"><b>Magyk</b></a></span>
                           <img src="/images/magyk_resize.png"/>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </footer>
      )
   }
}