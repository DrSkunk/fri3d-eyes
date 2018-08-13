import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    width: 20,
    height: 8,
    marginTop: 18,
    backgroundColor: "black",
    "&:hover": {
      fill: "gray"
    }
  },
  pixel: {
    fill: "white",
    stroke: "black",
    "&:hover": {
      fill: "gray"
    }
  },
  activePixel: {
    extend: "pixel",
    fill: "blue",
    stroke: "black",
    "&:hover": {
      fill: "darkBlue"
    }
  },
  ghostPixel: {
    extend: "activePixel",
    fill: "#9696ff",
    stroke: "black",
    "&:hover": {
      fill: "darkBlue"
    }
  }
};

class Pixel extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  render() {
    const {
      classes,
      side,
      active,
      previousActive,
      x,
      y,
      setPixel
    } = this.props;

    let rotation = 45;

    const xPos = x * 20;
    let yPos = y * 20;
    if (side === "left") {
      rotation = -45;
    } else {
      yPos += 15;
    }
    let className = classes.pixel;
    if (active) {
      className = classes.activePixel;
    } else if (previousActive) {
      className = classes.ghostPixel;
    }

    return (
      <g
        transform={`translate(${xPos}, ${yPos}) rotate(${rotation} 20 10)`}
        onClick={() => setPixel(x, y, side)}
      >
        <rect x={0} y={0} width={20} height={10} className={className} />
      </g>
    );
  }
}

export default withStyles(styles)(Pixel);
