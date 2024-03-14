import React, { Component } from 'react';
import styles from './styles.module.css';

/**
 * A React class component to add a video URL into a text editor.
 * This component renders a button that, when clicked, opens a popover.
 * Within this popover, users can paste a video URL. The component
 * is responsible for managing the opening and closing of this popover
 * and handling the addition of the video URL to the editor state.
 * 
 * @author Cindy Ding
 * Utilizes local component state to manage the visibility of the popover and the input URL.
 * Registers event listeners on mount/unmount for click events to handle popover closing logic.
 * @component
 * @example
 * return (
 *   <VideoAdd editorState={editorState} onChange={updateEditorState} modifier={videoPlugin.addVideo} />
 * )
 */

export default class VideoAdd extends Component {
  // Initialize state with URL empty and popover closed.
  state = {
    url: '',
    open: false,
  };

  // Add event listener for clicks to close the popover when clicking outside.
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  // Clean up event listener on component unmount.
  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  }

  // Prevents the popover from closing on inside clicks.
  onPopoverClick = () => {
    this.preventNextClose = true;
  };

  // Opens the popover only if it's currently closed.
  openPopover = () => {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true,
      });
    }
  };

  // Closes the popover if it's open and outside click is detected.
  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false,
      });
    }

    this.preventNextClose = false;
  };

  // Handles the addition of the video URL to the editor.
  addVideo = () => {
    const { editorState, onChange } = this.props;
    onChange(this.props.modifier(editorState, { src: this.state.url }));
  };

  // Updates the URL in the state as the user types in the input.
  changeUrl = (evt) => {
    this.setState({ url: evt.target.value });
  };

  render() {
    // Dynamically update class names based on the popover's state.
    const popoverClassName = this.state.open
      ? styles.addVideoPopover
      : styles.addVideoClosedPopover;
    const buttonClassName = this.state.open
      ? styles.addVideoPressedButton
      : styles.addVideoButton;

    return (
      <div className={styles.addVideo}>
        <button
          className={buttonClassName}
          onMouseUp={this.openPopover}
          type="button"
        >
          +
        </button>
        <div className={popoverClassName} onClick={this.onPopoverClick}>
          <input
            type="text"
            placeholder="Paste the video url …"
            className={styles.addVideoInput}
            onChange={this.changeUrl}
            value={this.state.url}
          />
          <button
            className={styles.addVideoConfirmButton}
            type="button"
            onClick={this.addVideo}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}
