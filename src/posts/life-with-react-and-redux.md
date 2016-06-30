---
title: Life With React and Redux
author: nick-italiano
reviewers:
- eric-johnson
- caity-cronkhite
category: engineering
date: 2016-05-21
poster: /img/lost-wax-method-rewriting-software/poster.png
thumb: /img/lost-wax-method-rewriting-software/card.png
tags:
- Software
- Node
- React
---

The front-end landscape has changed drastically over the last few years. Your large single page backbone app is long in the tooth, Grunt has fallen out of vogue and you’re sick of dealing with promise libraries in ES5 land. When looking at modernizing your frontend toolbox, it can
be a daunting task trying to set up these new technology stacks because you are
required to learn so many new concepts all at once.

I'm going to share with you the knowledge that I have gained by getting up to speed with these new frontend tools. Today we’ll go through a very simple weather app that I built with Redux and how these patterns can help you.

This post will assume that you have a basic understanding of [Webpack](https://webpack.github.io/), [Babel](https://babeljs.io/), [React](https://facebook.github.io/react/), and [Redux](http://redux.js.org/). If not, I would stop and take a look at their documentation and follow some of their tutorials first, then come back to this post. Also, review our [GitHub repository](https://github.com/unboundfire/example-weather-webapp) while reading this post; our code is more detailed in the repository, and I won’t explain every step in this post.

Mocks
-------------------
First, we need to decide what our simple weather app should look like. I went ahead and created some mocks for us to work with. The app is broken down into two pages: a list view and a details view.

<div class="post-img-sidebyside">
  <img class="sidebyside" src="/img/life-with-react-and-redux/weather_list_mock.png" alt="Weather List" />
  <img class="sidebyside" src="/img/life-with-react-and-redux/weather_details.png" alt="Weather Details" />
</div>

Data Model
-------------------
Now that we know what our web app will look like, we must model our data and pick a good API to work with that can fulfill these data requirements.

* Weekly weather based on location
* Detailed day weather

The [OpenWeatherMap](http://openweathermap.org/) API meets our data requirements, and it is super easy to use. The first thing we should do is create an account to get our API key. Our rough data model will look something like this:

[Code snippet: JSON Object that represent data]

Build Dependencies
-------------------
[Webpack](https://webpack.github.io/) is an awesome tool for building and shipping your code, but it can be one that is hard to wrap your head around at first. Please read our [README](https://github.com/unboundfire/example-weather-webapp/blob/master/README.md) for a more detailed description of our setup. Below is an example webpack configuration that you can use for reference:

```
const config = {
  entry: {
    app: path.join(__dirname, 'src', 'app.jsx'),
  },

  devtool: IS_DEVELOP ? 'source-map' : 'hidden-source-map',

  output: {
    filename: '[name]' + (IS_DEVELOP ? '' : '.min') + '.js',
    path: path.join(__dirname, 'build'),
    publicPath: '/static/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': IS_DEVELOP ? JSON.stringify('develop') : JSON.stringify('production'),
      },
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.less$/,
        loader: 'style?singleton!css!postcss!less',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|otf|otf2|woff|woff2?)(\?\S*)?$/,
        loader: 'url?limit=25000',
      },
    ]
  }
};
```

Building the App
-------------------

Bootstrap, Store, Reducers, Actions
---
The first thing we need to do is create a starting point for our app. In [Redux](http://redux.js.org/), you set up a Provider. Think of a Provider as a wrapper for your application. It takes two arguments: store and children. The store is where all application states are encapsulated, and in this case the only child to the Provider is the main container of your app. The Provider will set up some basic syncing with the store, so any time the store changes, it will alert the child components that have been passed into it. This helps make one-directional data flow a breeze.

The store contains a graph of nodes called reducers and any middleware we might want to support, like asynchronous actions and router middleware. When the dispatcher fires an action, the store will receive it and pass it into the graph of reducers that we have set up. Those reducers will, in turn, decide what they should do with this action.

```
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import header from '../reducers/header';
import weather from '../reducers/weather';
import details from '../reducers/details';
import settings from '../reducers/settings';

export default function (initialState) {
  const rootReducer = combineReducers({
    header: header,
    weather: weather,
    details: details,
    settings: settings,
    routing: routerReducer
  });

  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(thunk)
  ));

  return store;
}
```

Reducers are a great way to split your data into small chunks that mutate your state. They contain any business logic that your app needs and can help with UI state management. When we return state from a reducer, we never overwrite our current state; we are always making a mutation of that state and passing it along. Also, a key benefit of using reducers is that they are incredibly easy to unit test. We’ll cover testing in more detail in a follow-on blog post.

I’ve split our app into a few simple reducers below, so you can see how we have broken our data layer up into smaller chunks. These reducers hold all of our truth and only actions can interact with them. Your view layer can never directly modify any of this data; instead, the view layer requests an action to update the store based on user interaction. More on actions next.

Weather Details
---
```
const details = {
  min: '',
  max: '',
  current: '',
  hourly: []
};

export default function (state = details) {
  return state;
}
```

Weather Weekly
---
```
import { WEATHER_SUCCESS } from '../constants';

const weather = {
  city: '',
  country: '',
  weatherList: []
};

export default function (state = weather, action) {
  switch (action.type) {
    case WEATHER_SUCCESS:
      return Object.assign({}, state, {
        city: action.data.city.name,
        country: action.data.city.country,
        weatherList: action.data.list
      });
    default:
      return state;
  }
}
```

Header
---
```
import locationUtils from '../utils/locationUtils';
import { ACTIONS_DROPDOWN_TOGGLE } from '../constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import { ACTION_IDS } from '../constants';

const header = {
  title: 'Awesome Weather Weekly',
  isActionsDropdownVisible: false,
  isBack: false,
  actionOptions: [
    {
      id: ACTION_IDS.SETTINGS,
      title: 'Settings'
    }
  ]
};

export default function (state = header, action) {
  switch (action.type) {
    case LOCATION_CHANGE: {
      let title = header.title;
      let isBack = header.isBack;

      if (locationUtils.getPathname() === '/details') {
        title = 'Awesome Weather Details';
        isBack = true;
      }

      return Object.assign({}, state, {
        title: title,
        isBack: isBack
      });
    }
    case ACTIONS_DROPDOWN_TOGGLE:
      return Object.assign({}, state, {
        isActionsDropdownVisible: !state.isActionsDropdownVisible
      });
    default:
      return state;
  }
}
```

Modal
---
```
import { MODAL_TOGGLE } from '../constants';
import Settings from '../components/Settings';

const modal = {
  isHidden: true,
  modalType: '',
  components: {
    Settings: Settings
  }
};

export default function (state = modal, action) {
  switch (action.type) {
    case MODAL_TOGGLE:
      return Object.assign({}, state, {
        isHidden: !state.isHidden,
        modalType: action.modalType
      });
    default:
      return state;
  }
}
```

Settings
---
```
import { SETTINGS_UNITS, SETTINGS_LOCATION } from '../constants';

const settings = {
  units: {
    value: 'imperial',
    title: 'Units',
    options: [
      'metric',
      'imperial'
    ]
  },
  location: {
    title: 'Location',
    value: 94066
  }
};

export default function (state = settings, action) {
  switch (action.type) {
    case SETTINGS_UNITS:
      const units = Object.assign({}, state.units, { value: action.value });
      return Object.assign({}, state, { units: units });
    case SETTINGS_LOCATION:
      const loc = Object.assign({}, state.location, { value: action.value });
      return Object.assign({}, state, { location: loc });
    default:
      return state;
  }
}
```

Actions are verbs that are dispatched from your views, and will end up talking to your reducers and updating any state. All actions MUST have a type property so that our reducers understand what type of action needs to take place. For example, we have an action called getWeather, which takes in our settings, makes an AJAX request, gets our weekly weather for us, and sends it to our weather reducer. I’m highlighting this action because it’s an asynchronous action, so it looks slightly different than a synchronous action.

Asynchronous and Synchronous Actions
---
```
import apiUtils from '../utils/apiUtils';
import weatherUtils from '../utils/weatherUtils';
import * as CONSTANTS from '../constants';

export function settingsUnits(value) {
  return { type: CONSTANTS.SETTINGS_UNITS, value: value };
}

export function settingsLocation(value) {
  return { type: CONSTANTS.SETTINGS_LOCATION, value: value };
}

export function settingsChangeLocation(settings, value) {
  return function (dispatch) {
    dispatch(settingsLocation(value));

    if (weatherUtils.isValidZipCode(value)) {
      const req = Object.assign({}, settings);
      req.location.value = value;
      return settingsChange(req)(dispatch);
    }
  };
}

export function settingsChangeUnits(settings, value) {
  return function (dispatch) {
    dispatch(settingsUnits(value));
    const req = Object.assign({}, settings);
    req.units.value = value;
    return settingsChange(req)(dispatch);
  };
}

export function settingsChange(settings) {
  return function (dispatch) {
    return getWeather(settings)(dispatch);
  };
}

export function headerTitleUpdate() {
  return { type: CONSTANTS.HEADER_TITLE_UPDATE };
}

export function actionsDropdownToggle(isHidden) {
  return { type: CONSTANTS.ACTIONS_DROPDOWN_TOGGLE, hidden: isHidden };
}

export function modalToggle(modalType, isHidden) {
  return { type: CONSTANTS.MODAL_TOGGLE, modalType: modalType, hidden: isHidden };
}

export function getWeatherSuccess(data) {
  return { type: CONSTANTS.WEATHER_SUCCESS, data: data };
}

export function getWeatherFailure() {
  return { type: CONSTANTS.WEATHER_FAILURE, data: null };
}

export function getWeather(settings) {
  return function (dispatch) {
    apiUtils.getWeather(settings.location.value, settings.units.value).then(
      (data) => {
        return dispatch(getWeatherSuccess(data));
      },
      () => {
        return dispatch(getWeatherFailure());
      }
    );
  };
}
```

View Components
-------------------
Since all state is encapsulated in the store, the job of view components are rather simple. Let’s say we have a settings menu where you can change the units where the weather would appear. The user would click on the option to change the setting, our view would react to this and fire off an action describing the interaction. This would then flow into the store and be passed down to the appropriate reducer. The reducer then decides what to do with this new information and update any state, if needed. Any views rendered that depend on this state will receive the new information and react to the new props.

One of my personal favorite features of using [React](https://facebook.github.io/react/) [Redux](http://redux.js.org/) is that it supplies us with a connect function that will wrap our component and push any state changes that we might want in our view, so we don’t have to worry about passing our app state top down and keeping in sync with our store. It also removes some of the magic because you can see exactly what chunks of data each specific component needs from the store. We are going to make use of this pattern throughout our app.

Here is an example component of how connect works. When the app initially loads we plan on having our App.jsx fetch our weather data before it mounts, and depending on the route, will render the list or details component.

```
import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { connect } from 'react-redux';
import { getWeather } from '../../actions';
import Header from '../Header';
import Modal from '../Modal';
import './index.less';

export class App extends React.Component {
  static propTypes = {
    settings: PropTypes.object,
    modal: PropTypes.object
  };

  componentWillMount() {
    this.props.dispatch(getWeather(this.props.settings));
  }

  render() {
    const childProps = this.props.children.props;

    let transitionFlow = 'left';
    if (childProps.location.pathname !== '/') {
      transitionFlow = 'right';
    }

    let key = childProps.location.pathname;
    if(key[0] === '/') {
      key = key.substring(1);
    }

    return (
      <div className="app-cnt">
        <Header />

        <ReactCSSTransitionGroup transitionName="main" transitionAppear={true} transitionAppear={0} transitionEnterTimeout={200} transitionLeaveTimeout={200}>
          <main key={key} data-leave={transitionFlow} className="main">
            {this.props.children}
          </main>
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
          <Modal key={this.props.modal.isHidden} isHidden={this.props.modal.isHidden} modalType={this.props.modal.modalType} />
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const AppContainer = connect(
  (state) => ({ settings: state.settings, modal: state.modal }),
  (dispatch) => ({ dispatch: dispatch })
)(App);

export default function ({ children }) {
  return <AppContainer children={children} />;
}
```

Now that we have our data loaded into our store and since we are using the connect pattern, our components will instantly be in sync and render with the new data. You may have noticed how we barely even mention our components throughout this post because [Redux](http://redux.js.org/) really makes it that easy!

```
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import weatherUtils from '../../utils/weatherUtils';
import './index.less';

class WeatherListItem extends React.Component {
  static propTypes = {
    dt: PropTypes.number,
    name: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    icon: PropTypes.string
  };

  render() {
    let linkProps = {
      pathname: 'details',
      query: {
        dt: this.props.dt
      }
    };

    return (
      <li className="weather-list-item">
        <Link className="weather-list-item-link" to={linkProps}>
          <span className="weather-list-item-name">{this.props.name}</span>
          <span className="weather-list-item-min-max">
            <i className={`${this.props.icon} weather-icon`}></i>
            <span className="degrees">{this.props.max}</span> <span className="degrees">{this.props.min}</span>
          </span>
        </Link>
      </li>
    );
  }
}

class WeatherList extends React.Component {
  static defaultProps = {
    weatherList: []
  };

  static propTypes = {
    weatherList: PropTypes.array
  };

  get list() {
    const items = [];

    this.props.weatherList.forEach((weatherItem, key) => {
      const formattedWeather = weatherUtils.getFormattedWeather(weatherItem, key);
      items.push(
        <WeatherListItem
          key={key}
          dt={weatherItem.dt}
          name={formattedWeather.dayName}
          min={formattedWeather.minTemp}
          max={formattedWeather.maxTemp}
          icon={formattedWeather.iconClass}/>
      );
    });

    return items;
  }

  render() {
    let isHidden = this.props.weatherList.length === 0;

    return (
      <div className="weather-list-cnt" data-hidden={isHidden}>
        <ul className="weather-list">
          {this.list}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    weatherList: state.weather.weatherList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WeatherList);
```

Conclusion
-------------------
We live in a world where we can structure our JavaScript apps like never before. The introduction and opinionated nature of [React](https://facebook.github.io/react/) has lead to amazing ecosystem of frameworks (like [Redux](http://redux.js.org/)) that help you build a very resilient codebase that’s maintainable and feature-proof in many ways.

Our readers with an eye for quality will notice the lack of tests in this post. Look out for a follow on blog post that will go into detail how we test react/redux apps like the one described here!
