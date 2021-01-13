import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as commandNames from 'Commands/commandNames';
import { executeCommand } from 'Store/Actions/commandActions';
import { fetchInstalledPlugins } from 'Store/Actions/systemActions';
import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
import Plugins from './Plugins';

function createMapStateToProps() {
  return createSelector(
    (state) => state.system.plugins,
    createCommandExecutingSelector(commandNames.INSTALL_PLUGIN),
    (
      plugins,
      isInstallingPlugin
    ) => {
      return {
        ...plugins,
        isInstallingPlugin
      };
    }
  );
}

const mapDispatchToProps = {
  dispatchFetchInstalledPlugins: fetchInstalledPlugins,
  dispatchExecuteCommand: executeCommand
};

class PluginsConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.dispatchFetchInstalledPlugins();
  }

  //
  // Listeners

  onInstallPluginPress = (url) => {
    this.props.dispatchExecuteCommand({
      name: commandNames.INSTALL_PLUGIN,
      githubUrl: url
    });
  }

  //
  // Render

  render() {
    return (
      <Plugins
        onInstallPluginPress={this.onInstallPluginPress}
        {...this.props}
      />
    );
  }

}

PluginsConnector.propTypes = {
  dispatchFetchInstalledPlugins: PropTypes.func.isRequired,
  dispatchExecuteCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(PluginsConnector);
