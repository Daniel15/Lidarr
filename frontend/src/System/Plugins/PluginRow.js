import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SpinnerButton from 'Components/Link/SpinnerButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import { kinds } from 'Helpers/Props';

class PluginRow extends Component {

  //
  // Listeners

  onInstallPluginPress = () => {
    this.props.onInstallPluginPress(this.props.githubUrl);
  }

  render() {
    const {
      name,
      owner,
      installedVersion,
      availableVersion,
      updateAvailable,
      isInstallingPlugin
    } = this.props;

    return (
      <TableRow>
        <TableRowCell>{name}</TableRowCell>
        <TableRowCell>{owner}</TableRowCell>
        <TableRowCell>{installedVersion}</TableRowCell>
        <TableRowCell>{availableVersion}</TableRowCell>
        <TableRowCell>
          {
            updateAvailable &&
              <SpinnerButton
                kind={kinds.PRIMARY}
                isSpinning={isInstallingPlugin}
                onPress={this.onInstallPluginPress}
              >
                Update
              </SpinnerButton>
          }
        </TableRowCell>
      </TableRow>
    );
  }
}

PluginRow.propTypes = {
  githubUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  installedVersion: PropTypes.string.isRequired,
  availableVersion: PropTypes.string.isRequired,
  updateAvailable: PropTypes.bool.isRequired,
  isInstallingPlugin: PropTypes.bool.isRequired,
  onInstallPluginPress: PropTypes.func.isRequired
};

export default PluginRow;
