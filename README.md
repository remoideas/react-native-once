# react-native-once

<p align="left">
  <a href="https://www.npmjs.com/package/react-native-once" rel="nofollow">
    <img src="https://img.shields.io/npm/v/react-native-once.svg?style=flat-square" alt="version" style="max-width:100%;" />
  </a>
  <a href="https://www.npmjs.com/package/react-native-once" rel="nofollow">
    <img src="http://img.shields.io/npm/l/react-native-once.svg?style=flat-square" alt="license" style="max-width:100%;" />
  </a>
</p>

Run code once or multiple times based on user preference. Uses `AsyncStorage` to track if code should be executed. This library is built simply to reduce the complexity introduced into components when running code conditionally based on application and user preferences. e.g.

1. App first open -> show on-boarding experience
2. Modal -> don't show again.

#### Before
```
let introValue = null;

try {
  introValue = await AsyncStorage.getItem("on-boarding");
} catch (error) {
  // The data does not exist.
}

if (!introValue) {
  Navigation.push("OnBoardingScreen");
  await AsyncStorage.setItem("on-boarding", "true");
}
```
#### After
```
<Once
  name="on-boarding"
  onSuccess={() => Navigation.push("OnBoardingScreen")}
/>

```

## Install

Install via npm:
```sh
 npm install react-native-once --save
```
## Usage

There is one component which allows you to use all the methods and declarative API. 
```js
 import { Once } from "react-native-once";
```

#### Component

Simply use the exported Once component with a unique key (name) and callbacks to run your code. List of props are available below.

```jsx
<Once
  name="on-boarding"
  onSuccess={() => console.log("Show on-boarding screens")}
  onError={(e) => console.log(e)}
/>
```

#### API

The API can be accessed statically through the `Once` component. It allows you to access the value stored against the key and perform actions.

Gets the value belonging to the key:
```js
Once.get("onboarding-intro", value => {
  // value -> true or false (has the on-boarding screen been shown).
  // This is useful if you needed to update UI e.g. checkbox based on this value.
});
```
Sets the value of the key:
```js
// Allows you to update the key. Value must be a boolean.
Once.set("onboarding-intro", false);
```


## Props

| Prop                | Type          | Optional  | Description                                                                             |
| ------------------- | ------------- | --------- | --------------------------------------------------------------------------------------- |
| name                | string        | No        | A unique key provided to be used in Async Storage.                                      |
| onSuccess           | func          | No        | Function executed if the key does not exist or key === true.                            |
| onError             | func          | Yes       | Function executed if there was an error accessing AsyncStorage.                         |
| delay               | number        | Yes       | Delay for rendering children, if you choose to render children in the once component.   |                                                        |
| auto                | bool          | Yes       | Automatically toggle the key to true if the onSuccess function is executed.             |
| platform            | string        | Yes       | "ios" / "android", should this only run on a specific platform?                         |
| expire              | number        | Yes       | UNIX Timestamp. Set an expiry for the key.                                                     |

## Authors

* [**Luke Brandon Farrell**](https://lukebrandonfarrell.com/) - *Author*

## License

This project is licensed under the MIT License