# R-Dynamic

> A dynamic component specifically designed for React apps, supported with a couple of Vue-esque features.

[![NPM](https://img.shields.io/npm/v/r-dynamic.svg)](https://www.npmjs.com/package/r-dynamic)

## ✨ Features
- 🎉 All React components could be dynamically rendered.
  - (Class Components / Functional Components / Lazy Components / Context Components, etc.)
- ✅ Dynamical rendering is also available for plain HTML elements.
- 😎 Vue-like list rendering (v-for) is supported.
- 👌 Vue-like conditional rendering (v-if) is supported.
- 💎 Smooth development experience using Typescript (index.d.ts is provided).
- ⚡️ Tiny size (2.5KB) and high performance (written in functional component).

## Table of Contents
- [🅿️ Prerequisites](#🅿️-prerequisites)
- [⏩ Getting Started](#⏩-getting-started)
- [⛵️ Guide](#⛵️-guide)
    - [Dynamically render a React component](#dynamically-render-a-react-component)
    - [Dynamically render an HTML element](#dynamically-render-an-html-element)
    - [Dynamically render children without wrapper](#dynamically-render-children-without-wrapper)
    - [Dynamically render nothing (NO CHILDREN, NO WRAPPER)](#dynamically-render-nothing-no-children-no-wrapper)
    - [Work with async components](#work-with-async-components)
    - [Work with Context](#work-with-context)
    - [Work with other React components](#work-with-other-react-components)
    - [Conditional Rendering](#conditional-rendering)
    - [List Rendering](#list-rendering)
- [🅰️ APIs](#🅰️-apis)
- [©️ License](#©️-license)
- [🙏 Contribution](#🙏-contribution)

## 🅿️ Prerequisites
- React (^15.0.0 || ^16.0.0)
- React DOM (^15.0.0 || ^16.0.0)

## ⏩ Getting Started

```bash
npm install --save r-dynamic
```

```jsx
import * as React from 'react'
import Dynamic from 'r-dynamic'
```

## ⛵️ Guide

### Dynamically render a React component
You could render a **class component** dynamically:
```js
class Button extends React.Component {
  render() {
    return <button>{this.props.text}</button>
  }
}

<Dynamic $as={Button} text='Click Me' />
```
it would be rendered as if you use the following line:
```js
<Button text='Click Me' />
```

**Functional component** is also supported:
```js
function Button(props) {
  return <button>{props.text}</button>;
}

<Dynamic $as={Button} text='Click Me' />
```

### Dynamically render an HTML element
You could render a plain HTML element dynamically by **passing a string** to $as:
```js
<Dynamic $as='p' style='width: 350px;'>This is a paragraph.</Dynamic>
```
You will get the same result as the following:
```js
<p style='width: 350px;'>This is a paragraph.</p>
```

### Dynamically render children without wrapper
If you pass **null / undefined / ''(an empty string)** to $as, the wrapper would not be rendered while its children still get rendered:
```js
<Dynamic $as={null}> // it works like <React.Fragment> in this way.
  <p>This is a child without any wrapper.</p>
</Dynamic>
```
You will get the same result as the following:
```js
<p>This is a child without any wrapper.</p>
```

### Dynamically render nothing (NO CHILDREN, NO WRAPPER)
As mentioned above, you could pass a React class component or functional component for **$as**. Furthermore, you could even pass a **function** as long as it returns a **ReactChild or null**. In this way, you can get control of the entire component (its wrapper as well as children).

For instance, we could dynamically render nothing (LITERALLY):
```js
<h1>LOOK AT THIS!</h1>
<Dynamic $as={() => null}>
  <p>This paragraph will not be shown.</p>
</Dynamic>
```

It works just like we don't have rendered anything yet:
```js
<h1>LOOK AT THIS!</h1>
```

### Work with async components
First of all, I recommend you to use [react-loadable](https://github.com/jamiebuilds/react-loadable) in circumstances where you need async components, since it provides a sync-like development experience and works well in SSR (Server-Side Rendering) projects.

Here is an example:
```js
/** button.js */
const Button = (props) => {
  return <button>{props.text}</button>
}
export default Button
```

```js
import Loadable from 'react-loadable'

const AsyncButton = Loadable({
  loader: () => import('./button.js'),
  loading: () => <div>loading</div>,
});

export const Showcase = (props) => {
  return <Dynamic $as={AsyncButton} text='Click Me' />
}
```

Of course, you could use React.lazy instead, since it is embedded in React since v16.6. Here goes another example:
```js
/** button.js */
const Button = (props) => {
  return <button>{props.text}</button>
}
export default Button
```

```js
const AsyncButton = React.lazy(() => import('./button.js'))

export const Showcase = (props) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Dynamic $as={AsyncButton} text='Click Me' />
    </React.Suspense>
  )
}
```
This kind of practice has the following weaknesses:
- React.lazy components should be enclosed in React.Suspense, otherwise it would raise an error.
- It cannot work in SSR projects.

### Work with Context
Dynamical rendering of Context is supported:
```js
const ThemeContext = React.createContext('light');
const {Consumer, Provider} = ThemeContext

class Title extends React.Component {
  static contextType = ThemeContext;
  render() {
    return <h3>{this.context}</h3>
  }
}

export const CustomizedTitle = (props) => {
  return (
    <DynamicComponent $as={Provider} value='dark'>
      <Title />
    </DynamicComponent>
  )
}
```
CustomizedTitle will be rendered as follows:
```js
<h3>dark</h3>
```

### Work with other React components
R-Dynamic uses the definition of ExoticComponent interface as a tool to differentiate between normal React components (class components and functional components) and those special ones (they are also callable but with an additional $$typeof attribute). In this way, forwardRef, Fragment, memo and other components alike could be dynamically rendered since they all confirm to the definition. Enjoy it!

### Conditional Rendering
Similar to the v-if directive in Vue, we can use **$if** to toggle between rendering & not rendering:
```js
<Dynamic $as='div' $if={false}>
  <span>show me or not</span>
</Dynamic>
```
If you pass **false** to **$if**, R-Dynamic will render **null** so the entire component DOM tree will disappear. Otherwise, it will render as normal.


### List Rendering
#### Rendering duplicates
Similar to the v-for directive in Vue, we can use **$for** to render items for a specific number of times:
```js
<ul>
  <Dynamic $as='li' $for={5}>
    <span>this is a list item</span>
  </Dynamic>
</ul>
```
Instead of repetitive coding:
```js
<ul>
  <li>
    <span>this is a list item</span>
  </li>
  <li>
    <span>this is a list item</span>
  </li>
  <li>
    <span>this is a list item</span>
  </li>
  <li>
    <span>this is a list item</span>
  </li>
  <li>
    <span>this is a list item</span>
  </li>
</ul>
```

#### Iterative rendering
We can also use **$for** to iterate items in a data source (array / object).
```js
const arr = ['red', 'blue', 'orange', 'yellow']

<ul>
  <Dynamic
    $as='li'
    $for={arr}
    $for_render={(item, index) => <span>{index} -- This is {item}</span>}
  />
</ul>
```
It will be rendered as follows:
```js
<ul>
  <li>
    <span>0 -- this is red</span>
  </li>
  <li>
    <span>1 -- this is blue</span>
  </li>
  <li>
    <span>2 -- this is orange</span>
  </li>
  <li>
    <span>3 -- this is yellow</span>
  </li>
</ul>
```
Here we notice a special prop: **$for_render**. We don't pass children between the tags since there is no way for us to access the data source provided by **$for**. By using **$for_render**, we could receive item in the data source and render in accordance with it.

If you pass an **object** instead of array, then the first parameter of **$for_render** function will be **value**, not item; while the second parameter will be **key**, not index.

#### Conditional rendering for a specific item in iteration
We could use **$for_if** to control whether a specific item in the iteration should be rendered:
```js
const arr = ['red', 'blue', 'orange', 'yellow']

<ul>
  <Dynamic
    $as='li'
    $for={arr}
    $for_if={(item, index) => item % 2 !== 0}
    $for_render={(item, index) => <span>{index} -- This is {item}</span>}
  />
</ul>
```
We will get the following result:
```js
<ul>
  <li>
    <span>1 -- this is blue</span>
  </li>
  <li>
    <span>3 -- this is yellow</span>
  </li>
</ul>
```

## 🅰️ APIs
| *Property*     |  *Type*    | *Required*     |  *Default Value*    |  *Description*    |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| $as        | string \| FunctionComponent \| ComponentClass \| ExoticComponent \| null \| undefined       | ❌       | undefined       | The wrapper element needs to be rendered, which could be a plain HTML element, React element or just nothing (its children could be rendered alone).     |
| $if        | boolean       | ❌       | true       | To control whether the entire DOM tree of the component should be rendered or not, similar to the v-if directive in Vue.      |
| $for       | Array \| object \| number       | ❌       | N/A       | To iterate the data source and render each item respectively, similar to the v-for directive in Vue. Pass a number if you want to see the component rendered for a specific number of times. |
| $for_if    | (value?: any, key?: number \| string) => boolean   | ❌       | () => true    | To control whether a specific item in the iteration should be rendered, using with $for. If you want to batch all the items, use $if instead. |
| $for_key   | (item: any) => any      | ❌       |  *(Unique index for each item)*      | To tag each item in the iteration with a unique key. Note that if you use duplicate keys, an error would be raised.     |
| $for_render| (item?: any, index?: number \| string) => React.ReactChild       | ❌       | N/A       |  By default, the *children* prop would be rendered as the children of the component. To override it, you could use the *$for_render* prop, which give you a full access to the data source of each item, so as to render each item with its unique data.    |
| children   | ReactChild       | ❌      | N/A       | The children need to get rendered.       |

## ©️ License

MIT © [mozwell](https://github.com/mozwell)

## 🙏 Contribution
All kinds of contribution are welcomed, please submit PRs if you've got any good idea. Issues are also kindly appreciated.
