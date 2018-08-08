import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import PlayIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import Tooltip from "@material-ui/core/Tooltip";
import SaveIcon from "@material-ui/icons/Save";
import LoadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import _ from "lodash";
import Grid from "./atoms/Grid";

const styles = {
  root: {
    width: 600,
    textAlign: "center"
  },
  drawing: {
    width: 360,
    height: 120
  },
  buttons: {},
  button: {
    margin: 5
  },
  speed: {
    margin: 5
  }
};

const emptyFrame = [
  new Array(14).fill(false),
  new Array(14).fill(false),
  new Array(14).fill(false),
  new Array(14).fill(false),
  new Array(14).fill(false)
];

const initialState = {
  frames: [emptyFrame],
  currentFrameIndex: 0,
  playing: false,
  mirror: false,
  speed: 500
};

class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const storedState = localStorage.getItem("state");
    if (storedState) {
      this.state = {
        playing: initialState.playing,
        mirror: initialState.mirror,
        ...JSON.parse(storedState)
      };
    }
  }

  state = initialState;

  render() {
    const { classes } = this.props;
    const { currentFrameIndex, frames, playing, speed } = this.state;

    localStorage.setItem(
      "state",
      JSON.stringify({ currentFrameIndex, frames, speed })
    );

    const leftGrid = frames[currentFrameIndex].map(array => array.slice(0, 7));
    const rightGrid = frames[currentFrameIndex].map(array => array.slice(7));

    const leftArrowDisabled = currentFrameIndex === 0 || playing;
    const rightArrowDisabled =
      currentFrameIndex === frames.length - 1 || playing;
    const deleteDisabled = frames.length === 1;

    return (
      <div className={classes.root}>
        <div>
          <svg className={classes.drawing}>
            <Grid side="left" setPixel={this.setPixel} values={leftGrid} />
            <Grid side="right" setPixel={this.setPixel} values={rightGrid} />
          </svg>
        </div>
        <div className={classes.currentFrame}>
          Frame {currentFrameIndex + 1}/{frames.length}
        </div>
        <div className={classes.buttons}>
          <Tooltip title="Vorige frame">
            <span>
              <Button
                variant="fab"
                aria-label="Vorige frame"
                disabled={leftArrowDisabled}
                onClick={this.previousFrame}
                className={classes.button}
              >
                <ArrowLeftIcon />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Volgende frame">
            <span>
              <Button
                variant="fab"
                aria-label="Volgende frame"
                disabled={rightArrowDisabled}
                onClick={this.nextFrame}
                className={classes.button}
              >
                <ArrowRightIcon />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Frame toevoegen">
            <Button
              variant="fab"
              color="primary"
              aria-label="Frame toevoegen"
              onClick={this.addFrame}
              className={classes.button}
            >
              <AddIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Frame verwijderen">
            <span>
              <Button
                variant="fab"
                color="secondary"
                aria-label="Frame verwijderen"
                disabled={deleteDisabled}
                onClick={this.removeFrame}
                className={classes.button}
              >
                <DeleteIcon />
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Frame leegmaken">
            <span>
              <Button
                variant="fab"
                aria-label="Frame leegmaken"
                onClick={this.clearFrame}
                className={classes.button}
              >
                <ClearIcon />
              </Button>
            </span>
          </Tooltip>

          {playing ? (
            <Tooltip title="Animatie stoppen">
              <Button
                variant="fab"
                aria-label="Animatie stoppen"
                onClick={this.stop}
                className={classes.button}
              >
                <StopIcon />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Animatie afspelen">
              <Button
                variant="fab"
                aria-label="Animatie afspelen"
                onClick={this.play}
                className={classes.button}
              >
                <PlayIcon />
              </Button>
            </Tooltip>
          )}
          <TextField
            id="speed"
            label="Snelheid"
            value={speed}
            onChange={this.handleFieldChange("speed")}
            type="number"
            className={classes.speed}
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.mirror}
                onChange={this.handleMirrorChange("mirror")}
                value="mirror"
              />
            }
            label="Spiegel modus"
          />
        </div>
      </div>
    );
  }

  handleFieldChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleMirrorChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  setPixel = (x, y, side) => {
    console.log("set pixel", x, y, side);
    console.log("currentFrameIndex", this.state.currentFrameIndex);

    const { frames, currentFrameIndex, playing, mirror } = this.state;

    if (playing) {
      return;
    }

    let newFrames = _.cloneDeep(frames);
    if (mirror) {
      const firstX = side === "left" ? x : 7 - x;
      const secondX = 13 - firstX;
      const newValue = !newFrames[currentFrameIndex][y][firstX];
      newFrames[currentFrameIndex][y][firstX] = newValue;
      newFrames[currentFrameIndex][y][secondX] = newValue;
    } else {
      const newX = side === "left" ? x : x + 7;
      newFrames[currentFrameIndex][y][newX] = !newFrames[currentFrameIndex][y][
        newX
      ];
    }

    this.setState({
      frames: newFrames
    });
  };

  previousFrame = () => {
    this.setState({
      currentFrameIndex: this.state.currentFrameIndex - 1
    });
  };

  nextFrame = () => {
    this.setState({
      currentFrameIndex: this.state.currentFrameIndex + 1
    });
  };

  addFrame = () => {
    const { frames, currentFrameIndex } = this.state;

    this.setState({
      currentFrameIndex: currentFrameIndex + 1,
      frames: [
        ...frames.slice(0, currentFrameIndex + 1),
        _.cloneDeep(emptyFrame),
        ...frames.slice(currentFrameIndex + 1, frames.length)
      ]
    });
  };

  removeFrame = () => {
    const { frames, currentFrameIndex } = this.state;
    const newFrameIndex = currentFrameIndex === 0 ? 0 : currentFrameIndex - 1;
    this.setState({
      currentFrameIndex: newFrameIndex,
      frames: [
        ...frames.slice(0, currentFrameIndex),
        ...frames.slice(currentFrameIndex + 1, frames.length)
      ]
    });
  };

  clearFrame = () => {
    const { frames, currentFrameIndex } = this.state;
    this.setState({
      frames: [
        ...frames.slice(0, currentFrameIndex),
        _.cloneDeep(emptyFrame),
        ...frames.slice(currentFrameIndex + 1, frames.length)
      ]
    });
  };

  play = () => {
    const { frames, currentFrameIndex, speed } = this.state;
    this.setState({
      playing: true
    });

    let previousFrameIndex = currentFrameIndex;
    this.animationInterval = setInterval(() => {
      const newFrameIndex =
        previousFrameIndex === frames.length - 1 ? 0 : previousFrameIndex + 1;
      previousFrameIndex = newFrameIndex;
      this.setState({
        currentFrameIndex: newFrameIndex
      });
    }, speed);
  };

  stop = () => {
    this.setState({
      playing: false
    });
    clearInterval(this.animationInterval);
  };
}

export default withStyles(styles)(App);
