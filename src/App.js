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
import DownloadIcon from "@material-ui/icons/CloudDownload";
import CopyIcon from "@material-ui/icons/FileCopy";
import CloseIcon from "@material-ui/icons/Close";
import CloneIcon from "@material-ui/icons/CallMerge";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Highlight from "react-highlight";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Snackbar from "@material-ui/core/Snackbar";
import _ from "lodash";
import Grid from "./atoms/Grid";
import badge from "./badge_blueprint.jpg";

const styles = theme => ({
  root: {
    textAlign: "center"
  },
  wrapper: {
    width: 1100,
    height: 878,
    textAlign: "center",
    position: "relative",
    display: "inline-block",
    backgroundImage: `url("${badge}")`
  },
  drawing: {
    position: "absolute",
    width: 434,
    height: 120,
    top: 346,
    left: 377
  },
  controls: {
    position: "absolute",
    top: 630,
    left: 40,
    padding: "10px 15px"
  },
  title: {
    position: "absolute",
    top: 30,
    left: 60,
    transform: "rotate(-1.5deg)"
  },
  buttons: {},
  button: {
    margin: 5
  },
  speed: {
    margin: 5,
    width: 100
  },
  tooltipWrapper: {
    display: "inline-block"
  },
  downloadModal: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  code: {
    height: "50vh",
    overflow: "scroll"
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

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
  onion: false,
  onlyLoop: false,
  speed: 500,
  showDownloadModal: false,
  snackbarOpen: false
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
        showDownloadModal: initialState.showDownloadModal,
        snackbarOpen: initialState.snackbarOpen,
        onlyLoop: initialState.onlyLoop,
        onion: initialState.onion,
        ...JSON.parse(storedState)
      };
    }
  }

  state = initialState;

  render() {
    const { classes } = this.props;
    const {
      currentFrameIndex,
      frames,
      playing,
      speed,
      showDownloadModal,
      snackbarOpen,
      mirror,
      onion,
      onlyLoop
    } = this.state;

    localStorage.setItem(
      "state",
      JSON.stringify({ currentFrameIndex, frames, speed })
    );

    let previousFrameIndex = currentFrameIndex - 1;
    if (previousFrameIndex === -1) {
      previousFrameIndex = frames.length - 1;
    }

    const leftGrid = frames[currentFrameIndex].map(array => array.slice(0, 7));
    const previousLeftGrid = frames[previousFrameIndex].map(array =>
      array.slice(0, 7)
    );
    const rightGrid = frames[currentFrameIndex].map(array => array.slice(7));
    const previousRightGrid = frames[previousFrameIndex].map(array =>
      array.slice(7)
    );

    const leftArrowDisabled = currentFrameIndex === 0 || playing;
    const rightArrowDisabled =
      currentFrameIndex === frames.length - 1 || playing;
    const deleteDisabled = frames.length === 1;

    let arduinoCode = "";
    if (!onlyLoop) {
      arduinoCode = `#include <Fri3dMatrix.h>

Fri3dMatrix matrix = Fri3dMatrix();

void setup() {
}

void loop() {
`;
    }
    frames.forEach((frame, frameIndex) => {
      if (!onlyLoop) {
        arduinoCode += "\t";
      }
      arduinoCode += `// Frame ${frameIndex + 1}\n`;
      if (!onlyLoop) {
        arduinoCode += "\t";
      }
      arduinoCode += `matrix.clear();\n`;
      frame.forEach((line, lineIndex) => {
        line.forEach((pixel, pixelIndex) => {
          if (!onlyLoop) {
            arduinoCode += "\t";
          }
          const value = pixel === true ? 1 : 0;
          arduinoCode += `matrix.setPixel(${pixelIndex}, ${lineIndex}, ${value});\n`;
        });
      });
      if (!onlyLoop) {
        arduinoCode += "\t";
      }
      arduinoCode += `delay(${speed});\n\n`;
    });
    if (!onlyLoop) {
      arduinoCode += "}";
    }

    return (
      <React.Fragment>
        <div className={classes.root}>
          <div className={classes.wrapper}>
            <div className={classes.title}>
              <Typography variant="display4" gutterBottom>
                Fri3d Eyes
              </Typography>
            </div>
            <div>
              <svg className={classes.drawing}>
                <Grid
                  side="left"
                  setPixel={this.setPixel}
                  values={leftGrid}
                  previousValues={previousLeftGrid}
                  onion={onion}
                />
                <Grid
                  side="right"
                  setPixel={this.setPixel}
                  values={rightGrid}
                  previousValues={previousRightGrid}
                  onion={onion}
                />
              </svg>
            </div>
            <Paper className={classes.controls} elevation={1}>
              <div className={classes.currentFrame}>
                Frame {currentFrameIndex + 1}/{frames.length}
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mirror}
                      onChange={this.handleSwitchChange("mirror")}
                      value="mirror"
                      color="primary"
                    />
                  }
                  label="Spiegel modus"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={onion}
                      onChange={this.handleSwitchChange("onion")}
                      value="onion"
                      color="primary"
                    />
                  }
                  label="Uienschil modus"
                />
              </div>
              <div className={classes.buttons}>
                <Tooltip title="Vorige frame">
                  <div className={classes.tooltipWrapper}>
                    <Button
                      variant="fab"
                      aria-label="Vorige frame"
                      disabled={leftArrowDisabled}
                      onClick={this.previousFrame}
                      className={classes.button}
                    >
                      <ArrowLeftIcon />
                    </Button>
                  </div>
                </Tooltip>
                <Tooltip title="Volgende frame">
                  <div className={classes.tooltipWrapper}>
                    <Button
                      variant="fab"
                      aria-label="Volgende frame"
                      disabled={rightArrowDisabled}
                      onClick={this.nextFrame}
                      className={classes.button}
                    >
                      <ArrowRightIcon />
                    </Button>
                  </div>
                </Tooltip>
                <Tooltip title="Frame toevoegen">
                  <div className={classes.tooltipWrapper}>
                    <Button
                      variant="fab"
                      color="primary"
                      aria-label="Frame toevoegen"
                      onClick={this.addFrame}
                      className={classes.button}
                    >
                      <AddIcon />
                    </Button>
                  </div>
                </Tooltip>
                <Tooltip title="Vorige frame klonen">
                  <div className={classes.tooltipWrapper}>
                    <Button
                      variant="fab"
                      color="primary"
                      aria-label="Vorige frame klonen"
                      onClick={this.cloneFrame}
                      className={classes.button}
                    >
                      <CloneIcon />
                    </Button>
                  </div>
                </Tooltip>
                <Tooltip title="Frame verwijderen">
                  <div className={classes.tooltipWrapper}>
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
                  </div>
                </Tooltip>

                <Tooltip title="Frame leegmaken">
                  <div className={classes.tooltipWrapper}>
                    <Button
                      variant="fab"
                      aria-label="Frame leegmaken"
                      onClick={this.clearFrame}
                      className={classes.button}
                    >
                      <ClearIcon />
                    </Button>
                  </div>
                </Tooltip>
                <div>
                  {playing ? (
                    <Tooltip title="Animatie stoppen">
                      <div className={classes.tooltipWrapper}>
                        <Button
                          variant="fab"
                          aria-label="Animatie stoppen"
                          onClick={this.stop}
                          className={classes.button}
                        >
                          <StopIcon />
                        </Button>
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Animatie afspelen">
                      <div className={classes.tooltipWrapper}>
                        <Button
                          variant="fab"
                          aria-label="Animatie afspelen"
                          onClick={this.play}
                          className={classes.button}
                        >
                          <PlayIcon />
                        </Button>
                      </div>
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
                  <Tooltip title="Arduino Code downloaden">
                    <div className={classes.tooltipWrapper}>
                      <Button
                        variant="fab"
                        aria-label="Arduino Code downloaden"
                        onClick={this.showDownloadModal}
                        className={classes.button}
                      >
                        <DownloadIcon />
                      </Button>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </Paper>
          </div>
        </div>
        <Modal
          aria-labelledby="download-arduino-code-modal-title"
          aria-describedby="download-arduino-code-modal-description"
          open={showDownloadModal}
          onClose={this.closeDownloadModal}
        >
          <div className={classes.downloadModal}>
            <Typography variant="title" id="download-arduino-code-modal-title">
              Arduino code
            </Typography>
            <Typography
              variant="subheading"
              id="download-arduino-code-modal-description"
            >
              Kopieer deze code en plak ze in je Arduino project.
            </Typography>
            <CopyToClipboard
              text={arduinoCode}
              onCopy={() => this.setState({ snackbarOpen: true })}
            >
              <Button
                variant="extendedFab"
                aria-label="Code kopieren"
                className={classes.copyButton}
              >
                <CopyIcon className={classes.extendedIcon} />
                Code kopieren naar plakbord
              </Button>
            </CopyToClipboard>

            <div>
              <FormControlLabel
                control={
                  <Switch
                    checked={onlyLoop}
                    onChange={this.handleSwitchChange("onlyLoop")}
                    value="onlyLoop"
                    color="primary"
                  />
                }
                label="Alleen loop-code tonen"
              />
            </div>

            <div className={classes.code}>
              <Highlight className="c++">{arduinoCode}</Highlight>
            </div>
          </div>
        </Modal>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={this.handleSnackbarClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Code Gekopieerd!</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </React.Fragment>
    );
  }

  handleSnackbarClose = () => this.setState({ snackbarOpen: false });

  showDownloadModal = () => this.setState({ showDownloadModal: true });

  closeDownloadModal = () => this.setState({ showDownloadModal: false });

  cloneFrame = () => {
    const { frames, currentFrameIndex } = this.state;

    if (frames.length === 1) {
      return;
    }
    let previousFrameIndex = currentFrameIndex - 1;
    if (previousFrameIndex === -1) {
      previousFrameIndex = frames.length - 1;
    }
    let newFrames = _.cloneDeep(frames);
    newFrames[currentFrameIndex] = _.cloneDeep(newFrames[previousFrameIndex]);
    this.setState({
      frames: newFrames
    });
  };

  handleFieldChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  setPixel = (x, y, side) => {
    const { frames, currentFrameIndex, playing, mirror } = this.state;

    if (playing) {
      return;
    }

    let newFrames = _.cloneDeep(frames);
    if (mirror) {
      const firstX = side === "left" ? x : 7 - (x + 1);
      const secondX = 13 - firstX;
      const newValue =
        side === "left"
          ? !newFrames[currentFrameIndex][y][firstX]
          : !newFrames[currentFrameIndex][y][secondX];
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
