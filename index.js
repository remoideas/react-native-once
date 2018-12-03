/**
 * @author Luke Brandon Farrell
 * @description Once methods. Aimed to facilitate running conditional code once
 * or multiple times based on user preference and application state.
 */

import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import PropTypes from "prop-types";

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
  static run = async (key, func, error, auto = true) => {
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
    const { name, onSuccess, onError, auto } = this.props;

    Once.run(name, onSuccess, onError, auto);
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

Once.defaultTypes = {
  auto: true
};

Once.propTypes = {
  name: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
  auto: PropTypes.bool
};

export { Once };
