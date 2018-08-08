import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Pixel from "./Pixel";

const styles = {
  root: {
      width: 150,
      display: "inline-grid",
      gridTemplateColumns: "auto auto auto auto auto auto auto"
  }
};

class Grid extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel />
        <Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel />
        <Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel />
        <Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel />
        <Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel />
      </div>
    );
  }
}

export default withStyles(styles)(Grid);
