import React from 'react';
import {post} from 'axios';
import { ROUTES } from 'src/const';
import { Utils } from '@components/common/util';

export class SidebarCardsNwsLtr extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            form: {
                email: null
            },
            loading: false,
            response: {
                error: null,
                data: null
            }
        }
        this.sendEmail = this.sendEmail.bind(this);
        this.editValue = this.editValue.bind(this);
    }


    async sendEmail(){
        if(!this.state.form.email){
            return;
        }
        this.setState({ loading: true })
        try{
            let response = await Utils.signUpNewsletterEmail(this.state.form.email);
            console.log({response});
            if(!response.ok){
                if(response.reason === "existing"){
                    window.alert("This email is already registered with our newsletter!");
                }else {
                    window.alert("There was an error trying to register to our newsletter. Please try again later!");
                }
            }else{
                window.alert("You have been successfully registered for our newsletter.");
            }
        }catch(e){
            window.alert("There was an error trying to register to our newsletter. Please try again later! (2)");
        }
        this.setState({ loading: false })
    }

    editValue(key, value){
        this.setState((prevState)=>{
            prevState.form[key] = value;
            return prevState;
        });
    }

    render(){
        //
        return (
            <div className="card sidebar-card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-4">Newsletter</h5>
                    <div className="input-group">
                        <input
                            type="text"
                            value={this.state.form.email}
                            onChange={(event)=>this.editValue('email', event.target.value)}
                            placeholder="Your email address"
                            className="form-control"
                        />
                        <div className="input-group-append">
                        <button
                            disabled={this.state.loading}
                            type="button" className="btn btn-secondary" onClick={this.sendEmail}>
                                Sign up <i className="fas fa-arrow-right"></i>
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}