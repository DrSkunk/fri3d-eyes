import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
      width: 20,
      height: 8,
      marginTop:18,
      backgroundColor: "black"
  }
};

class Pixel extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes, side } = this.props;

    let rotation = {transform: "rotate(45deg)"}
    if(side === "left") {
        rotation = {transform: "rotate(-45deg)"}
    }
    return <div className={classes.root} style={rotation}> </div>;
  }
}

export default withStyles(styles)(Pixel);
