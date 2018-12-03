/**
 * @author Luke Brandon Farrell
 * @description Once methods. Aimed to make running conditional code one or
 * multiple times based on user preference easier.
 */

import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import PropTypes from "prop-types";

class Once extends Component {
  /**
   * Runs a function 'once' or based on value.
   *
   * @param func
   * @param key
   * @param error
   * @param auto
   *
   * @return {Promise<void>}
   */
  static run = async (func, key, error, auto = true) => {
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
   * @param key
   * @param value
   * @param error
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
   * @param key
   * @param callback
   * @param error
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
    const { key, onSuccess, onError, auto } = this.props;

    run(onSuccess, key, onError, auto);
  }
}

Once.defaultTypes = {
  auto: true
};

Once.propTypes = {
  key: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
  auto: PropTypes.bool
};

export { Once };
