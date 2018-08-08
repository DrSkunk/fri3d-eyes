import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "./atoms/Grid";

const styles = {
  root: {}
};

class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid />
      </div>
    );
  }
}

export default withStyles(styles)(App);
