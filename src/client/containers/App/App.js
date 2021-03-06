import React from 'react';
import { Toast } from 'grommet';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import ProtectedRoute from '../Auth/ProtectedRoute';
import Home from '../Home/Home';
import Room from '../Room/Room';
import Login from '../Auth/Login';
import Profile from '../Profile/Profile';
import PageSpinner from '../../components/PageSpinner';
import { initializeApp, destroyToast } from '../../redux/actions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.initializeApp();
  }

  render() {
    const { app, user, history, destroyToast } = this.props;
    if (user.authPending) {
      return <PageSpinner />;
    }
    return (
      <div>
        { app.toast &&
          <Toast
            status={app.toast.status}
            onClose={() => destroyToast()}
          >
            {app.toast.message}
          </Toast>
        }
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact render={props => <Home user={user} {...props} />} />
            <ProtectedRoute
              exact
              path="/login"
              redirectUrl="/"
              isAuthorized={!user.isAuthorized && !user.authPending}
              render={props => <Login user={user} {...props} />}
            />
            <ProtectedRoute
              exact
              path="/profile"
              redirectUrl="/login"
              isAuthorized={user.isAuthorized || user.authPending}
              render={props => <Profile user={user} {...props} />}
            />
            <Route path="/rooms/:roomId" render={props => <Room user={user} {...props} />} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </ConnectedRouter>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  app: state.app,
});

export default connect(mapStateToProps, { initializeApp, destroyToast })(App);
