/**
 * @author Luke Brandon Farrell
 * @description Once methods. Aimed to facilitate running conditional code once
 * or multiple times based on user preference and application state.
 */

import React, { Component } from "react";
import { View, Platform } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from "prop-types";

class Once extends Component {
  /**
   * Sets a value to be used by 'once'.
   *
   * @param {string} key
   * @param {bool} value
   * @param {func} callback
   * @param {func} error
   *
   * @return {Promise<void>}
   */
  static set = async (key, value, callback, error) => {
    try {
      await AsyncStorage.setItem(key, value);

      if (callback) callback.call();
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

      if (callback) callback(onceValue);
    } catch (e) {
      if (error) error(e);
    }
  };

  /**
   * [ Built-in React method. ]
   *
   * Setup the component. Executes when the component is created
   *
   * @param {object} props
   *
   */
  constructor(props) {
    super(props);

    this.state = {
      render: false
    };

    this.run = this.run.bind(this);
    this.invoke = this.invoke.bind(this);
  }

  /**
   * [ Built-in React method. ]
   *
   * Executed when the component is mounted to the screen.
   */
  componentDidMount() {
    this.invoke();
  }

  /**
   * [ Built-in React method. ]
   *
   * Executed when the component is unmounted from the screen
   */
  componentWillUnmount() {
    if (this.delayTimeout) clearTimeout(this.delayTimeout);
  }

  /**
   * Runs a function 'once' or based on value.
   *
   * @param {string} key
   * @param {func} func
   * @param {func} error
   * @param {string} platform
   * @param {bool} auto
   * @param {number} delay
   * @param {number} expire
   *
   * @return {Promise<void>}
   */
  async run(key, func, error, platform, auto, delay, expire) {
    // Option to only run on specific platform
    if (platform && platform !== Platform.OS) return null;

    // Run function
    let onceValue = null;
    let expireTime = null;

    try {
      onceValue = await AsyncStorage.getItem(key);
      expireTime = await AsyncStorage.getItem(`${key}-expire`);
    } catch (e) {
      if (error) error(e);
    }

    // Has the expiry date been passed
    const isExpired = expire ? new Date().valueOf() > expireTime : false;

    if (!onceValue || isExpired) {
      // Fire callback
      func.call();
      // Set Async storage
      if (auto) {
        await AsyncStorage.setItem(key, "true");

        // If expire has been set, then set the expire key
        if (expire) {
          await AsyncStorage.setItem(`${key}-expire`, expire.toString());
        }
      }
    } else {
      // Key has already been used, render children, with optional delay
      this.delayTimeout = setTimeout(() => {
        this.setState({
          render: true
        });
      }, delay);
    }
  }

  /**
   * Ref function. Used to invoke the component directly through reference.
   */
  invoke() {
    /* Props */
    const {
      name,
      onSuccess,
      onError,
      delay,
      auto,
      platform,
      expire
    } = this.props;

    this.run(name, onSuccess, onError, platform, auto, delay, expire);
  }

  /**
   * [ Built-in React method. ]
   *
   * Allows us to render JSX to the screen
   */
  render() {
    if (this.state.render) {
      if (this.props.children) return this.props.children;
    }

    // We return empty view so we can wrap multiple react-native-once
    return <View />;
  }
}

Once.defaultProps = {
  delay: 0,
  auto: true
};

Once.propTypes = {
  children: PropTypes.any,
  name: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
  delay: PropTypes.number,
  auto: PropTypes.bool,
  platform: PropTypes.oneOf(["ios", "android"]),
  expire: PropTypes.number
};

export { Once };
