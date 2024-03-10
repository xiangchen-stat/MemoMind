import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import ImageAdd from './ImageAdd';
import editorStyles from './editorStyles.module.css';

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

const text = '';

export default class CustomImageEditor extends Component {
    // useEffect(() => {
    //     fetchEvents();
    // }, []);
    // const fetchImages = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:3001/api/images?userEmail=${userEmail}`);

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch images');
    //         }
    //         const data = await response.json();
    //         const formattedImages = data.map(images => ({
    //             ...images,
    //             id: images._id,
    //         }));
    //         setImages(formattedImages);
    //         console.log('Server response:', data);
    //     } catch (error) {
    //         console.error("Error fetching images:", error);
    //         setImages([]);
    //     }
    // };
  state = {
    editorState: createEditorStateWithText(text),
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div>
        <div className={editorStyles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => { this.editor = element; }}
          />
        </div>
        <ImageAdd
          editorState={this.state.editorState}
          onChange={this.onChange}
          modifier={imagePlugin.addImage}
        />
      </div>
    );
  }
}