# react-native-once

Run code once or multiple times based on user preference. Uses `AsyncStorage` to track if code should be executed. This library is built simply to reduce the complexity introduced into components when running code conditionally based on application and user preferences. e.g.

1. App first open -> show on-boarding experience
2. Modal -> don't show again.

#### Before
```
let introValue = null;

try {
  introValue = await AsyncStorage.getItem("real-example");
} catch (error) {
  // The data does not exist.
}

if (!introValue) {
  Navigation.push("OnBoardingScreen");
  await AsyncStorage.setItem("ashleigh-clubintro", "true");
}
```
#### After
```
<Once
  name="real-example"
  onSuccess={() => Navigation.push("OnBoardingScreen")}
/>

// OR

Once.run("real-example", () => Navigation.push("OnBoardingScreen"));

```

## Install

Install via npm:
```sh
 npm install react-native-images-collage --save
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
  name="onboarding-intro"
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
Once.set("onboarding-intro", value);
```

Runs a method based on the value of the key. The forth parameter is to denote if the key should automatically be toggled (default true). e.g. onboarding-intro will be toggled to `true` if it was `false` and the success method was executed:

```
// Allows you to run code based on if the key provided is true.
// The <Once /> component uses this method under the hood.
Once.run(
  "onboarding-intro",
  () => console.log("Show on-boarding screens")),
  (e) => console.log(e)),
  false
);
```


## Props

| Prop                | Type          | Optional  | Description                                                                             |
| ------------------- | ------------- | --------- | --------------------------------------------------------------------------------------- |
| name                | string        | No        | A unique key provided to be used in Async Storage.                                      |
| onSuccess           | func          | No        | Function executed if the key does not exist or key === true.                            |
| onError             | func          | Yes       | Function executed if there was an error accessing AsyncStorage.                         |
| auto                | bool          | Yes       | Automatically toggle the key to true if the onSuccess function is executed.             |

## Authors

* [**Luke Brandon Farrell**](https://lukebrandonfarrell.com/) - *Author*

## License

This project is licensed under the MIT License