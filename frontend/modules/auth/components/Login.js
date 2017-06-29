import React from 'react'
import {
    injectIntl,
    IntlProvider,
    defineMessages,
    formatMessage
} from 'react-intl';
import { browserHistory } from 'react-router'
import AuthActions from '../actions/AuthActions';
import AuthStore from '../stores/AuthStore';

// Load in the base CSS
require("./../css/login.scss");

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data || []
    };

    this.getAuthErrors = this.getAuthErrors.bind(this);
    this._onChange = this._onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getInitialState() {
    return this.getAuthErrors();
  }

  getAuthErrors() {
    return {
      authenticated: AuthStore.isAuthenticated(),
      errors: AuthStore.getErrors()
    };
  }

  componentDidMount() {
    if (AuthStore.isAuthenticated()) {
      browserHistory.push('/');
    }
    AuthStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(this.getAuthErrors());
  }

  handleSubmit(e) {
    e.preventDefault();
    let username = this.refs.username.value;
    let pass = this.refs.pass.value;
    AuthActions.getToken(username, pass);
  }

  render() {
    let IntlAlert = injectIntl(Alert);
    const {formatMessage} = this.props.intl;
    const messages = defineMessages({
      please_sign_in: {
        id: 'login.please_sign_in',
        description: 'Please sign in header',
        defaultMessage: 'Please sign in',
      },
      username: {
        id: 'login.username',
        description: 'Username placeholder',
        defaultMessage: 'Username',
      },
      password: {
        id: 'login.password',
        description: 'Password placeholder',
        defaultMessage: 'Password',
      },
      sign_in: {
        id: 'login.sign_in',
        description: 'Sign in button',
        defaultMessage: 'Sign in',
      }
    });

    return (
      <form className="form-signin" onSubmit={this.handleSubmit}>
        { this.state.errors ? ( <IntlAlert/> ) : ''}
        <h2 className="form-signin-heading">
          { formatMessage(messages.please_sign_in) }
        </h2>
        <input
          type="text"
          id="username"
          className="form-control"
          placeholder={ formatMessage(messages.username) }
          ref="username"
          autoFocus="true"/>
        <input
          type="password"
          id="password"
          className="form-control"
          placeholder={ formatMessage(messages.password) }
          ref="pass"/>
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          { formatMessage(messages.sign_in) }
        </button>
      </form>
    )
  }
}

class Alert extends React.Component {
  render() {
    const {formatMessage} = this.props.intl;
    const messages = defineMessages({
      title: {
        id: 'login.alert.unable_to_login',
        description: 'Fail to login header',
        defaultMessage: 'Unable to login!',
      },
      message: {
        id: 'login.alert.confirm',
        description: 'Fail to login message',
        defaultMessage: 'Please confirm that the username and password are correct.',
      }
    });

    return (
      <div className="alert alert-danger">
        <strong>{ formatMessage(messages.title) }</strong>
        { formatMessage(messages.message) }
      </div>
    )
  }
}

module.exports = injectIntl(Login);
