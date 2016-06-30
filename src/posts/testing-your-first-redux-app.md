---
title: Testing Your First Redux App
author: luke-doyle
reviewers:
- nick-italiano
- eric-johnson
- caity-cronkhite
category: engineering
date: 2016-06-29
poster: /img/lost-wax-method-rewriting-software/poster.png
thumb: /img/lost-wax-method-rewriting-software/card.png
tags:
- Software
- Node
- React
- Redux
---

Like with all applications, testing the front-end of a web application is vital to the development process, but front-end testing can pose some unique challenges. Anyone familiar with this process can identify with:

- Difficulty testing large, deeply-nested, tightly-coupled view and event hierarchies
- Compatibility issues when running front-end code in multiple web browsers across multiple devices
- Figuring out ways to use [test doubles](https://en.wikipedia.org/wiki/Test_double) like stubs, mocks, and spies on your code

In our [last post](/engineering/life-with-react-and-redux/), we went over how to build a simple weather application. We showed how the opinionated architecture of a React app built with Redux can make writing stateless, front-end code a breeze. In this post, we show how to leverage that approach to write tests for your app and sidestep the issues listed in the above points.

The sledgehammer approach to front-end testing usually involves tools such as Selenium to script and test end-to-end workflows. This post focuses on a more lightweight way to test your code: unit and component testing.

Writing Unit Tests
-----------------------

Unit testing is the practice of testing the smallest possible units of code -- functions. We assert that, given a set of inputs, our functions return the proper values and handle problems. When tests execute, our assertions are checked and when they fail, the test fails.

We use the [mocha](https://github.com/mochajs/mocha) test framework and [expect](http://github.com/mjackson/expect) for assertions. These libraries make writing tests declarative -- you `describe` a unit of your code and `expect` `it` to do the correct thing. Here is a basic example of testing a simple function using these libraries to write a simple unit test:

```
export function add(x, y) {
  return x + y;
}
```

A possible test for the add function might test two things:

1. It adds two numbers
2. It doesn’t add three numbers

Using mocha and expect, a test might look like this:

```
import { add } from './add.js';
import expect from 'expect';

describe('add()', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toEqual(5);
  });

  it('doesn\'t add the third number', () => {
    expect(add(2, 3, 5)).toEqual(add(2, 3));
  });
});
```

The first test case for adding two numbers on line 6 simply asserts that `add(2, 3)` equals `5`. The second case on line 10 tests that `add` doesn’t add three numbers. We do this by asserting that `add(2, 3, 5)` equals `add(2, 3)`. It’s important to note that we didn’t assert that `add(2, 3, 5)` equals `5` because this doesn’t actually fit the test case. We’re concerned with the behavior of the `add` function, not that `2 + 3 = 5`.

Mocha shows this output when running the tests:

<pre>
add()
  ✓ adds two numbers
  ✓ doesn't add the third number
</pre>

Now let's assume someone breaks `add`:

```
export function add(x, y) {
  return x * y;
}
```

Now the function doesn't add the numbers anymore, it multiplies them. Thankfully, we have unit tests in place to catch this mistake. Because we run the unit tests before we deploy the application, we would see this output next time they run:

<pre>
add()
  1) adds two numbers
  ✓ doesn’t add the third number

  1) add adds two numbers:
    Error: Expected 6 to equal 5
</pre>

This alerts us that something is broken in the `add` function before any code gets deployed.

Unit Testing a Redux app
-----------------------

In a Redux app, the prime targets for unit tests are mainly our `actions` and `reducers` since they are [pure functions](https://en.wikipedia.org/wiki/Pure_function). We call them pure functions because they have no observable side effects, meaning they don’t change any state outside of the function’s scope.

Consider the following `action` and `reducer` that controls a small dropdown in our application header:

<div class="post-img">
  <img style="margin: 0 auto;" src="/img/testing-your-first-redux-app/dropdown.gif" alt="Dropdown" />
</div>

Here is the `action` and `reducer` that control this interaction:

```
// Header.constants.js

export const ACTIONS_DROPDOWN_TOGGLE = 'ACTIONS_DROPDOWN_TOGGLE';

// Header.actions.js

import { ACTIONS_DROPDOWN_TOGGLE } from './Header.constants';

export function actionsDropdownToggle() {
  return { type: ACTIONS_DROPDOWN_TOGGLE };
}

// Header.reducer.js

import { ACTIONS_DROPDOWN_TOGGLE } from './Header.constants';

const header = {
  isActionsDropdownVisible: false,
};

export default function (state = header, action) {
  switch (action.type) {
    case ACTIONS_DROPDOWN_TOGGLE:
      return Object.assign({}, state, {
        isActionsDropdownVisible: !state.isActionsDropdownVisible
      });
    default:
      return state;
  }
}
```

First, let's test the reducer. We need to test that it returns the initial state, so we write a test that calls it with a state of `undefined` as the first argument, and an empty `action` as the second argument. The reducer should return the initial state of the `Header`. Second, to test that it handles the toggle, we again call it with an empty initial state but with the toggle `action`. The reducer should return the `state` of `Header` but this time with `isActionsDropdownVisible` set to true.

The tests for this reducer look like this:

```
// Header.reducer.test.js

import expect from 'expect';
import HeaderReducer from './Header.reducer';
import { ACTIONS_DROPDOWN_TOGGLE } from './Header.constants';

describe('HeaderReducer', () => {

  it('returns the initial state', () => {
   expect(HeaderReducer(undefined, {})).toEqual({
      isActionsDropdownVisible: false
    });
  });

  it('handles the actionsDropdownToggle action', () => {
   expect(HeaderReducer(undefined, { type: ACTIONS_DROPDOWN_TOGGLE })).toEqual({
      isActionsDropdownVisible: true
    });
  });
});
```

Next we’ll test the action. Our action is extremely simple and just returns a single constant, so we simply need to assert that this is true.

```
// Header.action.test.js

import { actionsDropdownToggle } from './Header.actions';
import { ACTIONS_DROPDOWN_TOGGLE } from './Header.constants';
import expect from 'expect';

describe('Header actions', () => {
  describe('actionsDropdownToggle', () => {
    it('should return the correct constant', () => {
      expect(actionsDropdownToggle()).toEqual({
        type: ACTIONS_DROPDOWN_TOGGLE
      });
    });
  });
});
```

Fairly straightforward, right? This pattern covers the pure functional parts of the codebase.

Writing Component Tests
-----------------------

Unit testing Redux actions and reducers is nice, but you can do even more to make sure nothing breaks your application. Since `React` is stateless, let's see how easy it is to test components, something that is very difficult in other front-end frameworks.

React provides us with a nice add-on called the [Shallow Renderer](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering). This renderer will render a React component one level deep. The problem with the shallow renderer is that assertions have to be done manually, and you can’t do anything that requires the presence of the DOM. Thankfully, a wrapper around the shallow renderer and jsdom exists called [enzyme](https://github.com/airbnb/enzyme). Enzyme is a testing utility that gives us a nice assertion/traversal/manipulation API for our components.

Let’s test a hypothetical button component:

```
// Button.react.js

import CheckmarkIcon from './CheckmarkIcon.react';

function Button(props) {
  return (
    <button className="btn" onClick={props.onClick}>
      <CheckmarkIcon />
      { props.children }
    </button>
  );
}

export default Button;
```

It might be used in another component like this:

```
// SomeOtherComponent.react.js

import Button from './Button.react';

class HomePage extends React.Component {
  render() {
    return(
      <Button onClick={this.doSomething}>Click here!</Button>
    );
  }
}
```

Let’s test the Button component. We're going to test three things:

1. It renders a HTML `<button>` element
2. It renders `children` that we pass it
3. It handles clicks

Again using mocha, this is how the overall structure of test would look:

```
// Button.react.test.js

import Button from './Button.react;
import expect from 'expect';
import { shallow } from 'enzyme';

describe('<Button />', () => {
  it('renders a <button>', () => {});

  it('renders children', () => {});

  it('handles clicks', () => {});
});
```

To test that it renders a `<button>`, we do a shallow render and then expect a `<button>` to exist:

```
it('renders a <button>', () => {
  const renderedComponent = shallow(
    <Button></Button>
  );
  expect(
    renderedComponent.find("button").node
  ).toExist();
});
```

This is nice because if someone else goes in and changes the `Button` component to render an `<a>` or something, we’ll immediately know.

Next, we’ll assert that the component renders `children` by passing in some `children` and seeing if they’re contained in the rendered DOM tree:

```
it('should render its children', () => {
  const children = (<h1>Test</h1>);
  const renderedComponent = shallow(
    <Button>
      {children}
    </Button>
  );
  expect(renderedComponent.contains(children)).toEqual(true);
});
```

Finally for our last and most advanced test, we’ll check that `Button` handles clicks correctly. We'll use a `Spy` for that. A `Spy` is a function that knows if, and how often it has been called. We create the `Spy` (provided by expect), pass it as the `onClick` to our component, `simulate` a `click` on it and see that our `Spy` was called:

```
it('should handle click events', () => {
  const clickSpy = expect.createSpy();
  const renderedComponent = shallow(<Button onClick={clickSpy} />);
  renderedComponent.find('button').simulate('click');
  expect(clickSpy).toHaveBeenCalled();
});
```

And that's how you unit test your components and make sure they work correctly.

Conclusion
-----------------------

Redux’s emphasis on stateless components and pure functions make the once daunting task of front-end testing extremely straightforward. `Actions` and `reducers` are pure functions that can be unit tested, while components can be shallow rendered, tested and spied on with tools like `enzyme` and `expect`.
