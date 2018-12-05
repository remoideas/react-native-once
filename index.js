/**
 * @author Luke Brandon Farrell
 * @description Once methods. Aimed to facilitate running conditional code once
 * or multiple times based on user preference and application state.
 */

import React, { Component } from "react";
import { AsyncStorage, Platform } from "react-native";
import PropTypes from "prop-types";

// Stores callbacks for the keys.
let invokes = null;
// Invoke delay
let delay = 0;

class Once extends Component {
  /**
   * Runs a function 'once' or based on value.
   *
   * @param {string} key
   * @param {func} func
   * @param {func} error
   * @param {bool} auto
   *
   * @return {Promise<void>}
   */
  static run = async (key, func, error, auto = true, callbacks, platform) => {
    // Option to only run on specific platform
    if(platform && platform !== Platform.OS) return null;

    // Setup invokes if they exist
    invokes = [];
    invokes[key] = callbacks;

    // Run function
    let onceValue = null;

    try {
      onceValue = await AsyncStorage.getItem(key);
    } catch (e) {
      if (error) error(e);
    }

    if (!onceValue || onceValue === "false") {
      func.call();

      if (auto) {
        await AsyncStorage.setItem(key, "true");
      }
    }
  };

  /**
   * Invokes functions once the key has been set as done.
   *
   * @param key
   */
  static done = (key) => {
    if(invokes !== null) {
      if(key in invokes){
        invokes[key].map((invoke) => {
          setTimeout(() => invoke.call(), delay);
        });
      }
    }
  };

  /**
   * Sets a value to be used by 'once'.
   *
   * @param {string} key
   * @param {bool} value
   * @param {func} error
   *
   * @return {Promise<void>}
   */
  static set = async (key, value, error) => {
    try {
      if (Boolean(value)) {
        await AsyncStorage.setItem(key, value ? "true" : "false");

        // Invokes functions once the key has been set.
        Once.done(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      if (error) error(e);
    }
  };

  /**
   * Gets a value from 'once'.
   *
   * @param {string} key
   * @param {func} callback
   * @param {func} error
   *
   * @return {Promise<void>}
   */
  static get = async (key, callback, error) => {
    let onceValue = null;

    try {
      onceValue = await AsyncStorage.getItem(key);

      callback(Boolean(onceValue === "true"));
    } catch (e) {
      if (error) error(e);
    }
  };

  /**
   * [ Built-in React method. ]
   *
   * Executed when the component is mounted to the screen.
   */
  componentDidMount() {
    /* Props */
    const { name, onSuccess, onError, auto, invokes: callbacks, delay: time, platform, execute } = this.props;

    // If execute is false, don't automatically run
    if(!execute) return null;

    this.invoke();
  }

  /**
   * Ref function. Used to invoke the component directly through reference.
   */
  invoke(){
    /* Props */
    const { name, onSuccess, onError, auto, invokes: callbacks, delay: time, platform } = this.props;
    console.log("INVOKE");
    // Set our custom delay for invoking
    delay = time;

    /*
     * Callbacks needs to be in array (there can be multiple). So if it is not
     * in an array then we can put it in one.
     */
    let modifiedCallbacks = [];
    if(!Array.isArray(callbacks)){
      modifiedCallbacks.push(callbacks);
    }

    Once.run(name, onSuccess, onError, auto, modifiedCallbacks, platform);
  }

  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  render() {
    return null;
  }
}

Once.defaultProps = {
  auto: true,
  delay: 0,
  execute: true,
};

Once.propTypes = {
  name: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
  auto: PropTypes.bool,
  invokes: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  delay: PropTypes.number,
  platform: PropTypes.string,
  execute: PropTypes.bool,
};

export { Once };