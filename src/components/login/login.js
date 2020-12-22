import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession, getUser } from '../Utils/Common';
import { useHistory } from 'react-router-dom';
 
function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  const [loginShow, setLoginShow] = useState('show');
  const history = useHistory();
 
  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_END + "/login", {
         username: username.value, password: password.value,
      })
      .then((response) => {
        //setLoading(false);
        //setUserSession(response.data.token, response.data.user);
        //setError("Something went wrong. Please try again later.");
        var session = response.data['ssession_number'];
        var id = response.data['user_id'];
        if(id === -6 || session === -6){
          setError('Incorrect Username or Password, Please Try Again.')
          setLoading(false);
          //console.log(session,id,username.value)
        }
        if(id>-6 && session > -6){
          setUserSession(session, id, username.value);
          setLoading(false);
          setLoginShow('no-show');
          props.changeUsername(props.par);
          checkLogin(props);

        }

      })
      function checkLogin(props){
        if(getUser()){
          //console.log(true)
          history.push('/market')
        }
      }
  }
        return (
            <div id='login-form' className="mdl-card__supporting-text color--dark-gray">
                <div className="mdl-grid" className={loginShow}>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--4-col-phone">
                        <span className="mdl-card__title-text text-color--smooth-gray">React Twitter Bullish</span>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--4-col-phone">
                        <span className="login-name text-color--white">Sign in</span>
                    </div>
                    {error && <><span style={{ color: 'red' }}>{error}</span><br /></>}
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--4-col-phone">
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label full-size">
                            <input type="text" {...username} autoComplete='new-password' className="mdl-textfield__input" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Username" />
                        </div>
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label full-size">
                            <input type="password" {...password} autoComplete='new-password' className="mdl-textfield__input" id="exampleInputPassword1" placeholder="Password"/>
                        </div>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--4-col-phone submit-cell">
                        <div className="mdl-layout-spacer"></div>
                        <button className="mdl-button mdl-js-button mdl-button--raised color--light-blue"
                        value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading}>
                            SIGN IN
                        </button>
                    </div>
                </div>
            </div>
        )
    
}
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
export default Login;