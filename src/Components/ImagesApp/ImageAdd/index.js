import React, { Component } from 'react';
import styles from './styles.module.css';

/**
 * * A React class component to add a image URL into a text editor.
 * This component renders a button that, when clicked, opens a popover.
 * Within this popover, users can paste a image URL. The component
 * is responsible for managing the opening and closing of this popover
 * and handling the addition of the image URL to the editor state.
 *
 * @author Cindy Ding 
 * Utilizes local component state to manage the visibility of the popover and the input URL.
 * Registers event listeners on mount/unmount for click events to handle popover closing logic.
 * @component
 * @example
 * return (
 *   <ImageAdd editorState={editorState} onChange={editorStateChangeHandler} modifier={imageModifier} />
 * )
 */

export default class ImageAdd extends Component {
  state = {
    url: '', // Stores the URL input by the user
    open: false, // Controls the visibility of the popover
  };

  // Lifecycle method to add event listener after component mounts
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  // Lifecycle method to clean up event listener before component unmounts
  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  }

  // Handler to prevent popover from closing when clicked inside
  onPopoverClick = () => {
    this.preventNextClose = true;
  }

  // Function to open the popover
  openPopover = () => {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true,
      });
    }
  };

  // Function to close the popover, checks for conditions to prevent accidental closure
  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false,
      });
    }

    this.preventNextClose = false;
  };

  // Function to add the image to the editor state using the provided URL
  addImage = () => {
    const { editorState, onChange } = this.props;
    onChange(this.props.modifier(editorState, this.state.url));
  };

  // Handler for changing the URL in the component's state as the user inputs it
  changeUrl = (evt) => {
    this.setState({ url: evt.target.value });
  }

  // Render method to display the component UI
  render() {
    // Dynamically set class names based on state for styling
    const popoverClassName = this.state.open ?
      styles.addImagePopover :
      styles.addImageClosedPopover;
    const buttonClassName = this.state.open ?
      styles.addImagePressedButton :
      styles.addImageButton;

    // Component UI
    return (
      <div className={styles.addImage}>
        <button
          className={buttonClassName}
          onMouseUp={this.openPopover}
          type="button"
        >
          + // Button to trigger popover for URL input
        </button>
        <div
          className={popoverClassName}
          onClick={this.onPopoverClick}
        >
          <input
            type="text"
            placeholder="Paste the image url …"
            className={styles.addImageInput}
            onChange={this.changeUrl}
            value={this.state.url} // Input field for URL
          />
          <button
            className={styles.addImageConfirmButton}
            type="button"
            onClick={this.addImage} // Button to confirm and add image
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}
