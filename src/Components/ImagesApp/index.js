import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import ImageAdd from './ImageAdd';
import editorStyles from './editorStyles.module.css';

/**
 * A React component for an enhanced text editor with image handling capabilities.
 * Utilizes `draft-js` for editor functionality and a custom image plugin for image insertion.
 * Enables users to add images to their text content by providing image URLs.
 * Users can fetch images associated with their account on component mount and save new image content.
 *
 * @author Cindy Ding
 * @component
 * Leverages the `draft-js-plugins-editor` for editor instantiation and a custom `ImageAdd` component for adding images.
 * Initiates a fetch operation on component mount to load image content and provides functionality to save new image content.
 * @example
 * return (
 *   <CustomImageEditor />
 * )
 */

// Initialize the image plugin for the editor.
const imagePlugin = createImagePlugin();
// Include the image plugin in the plugins array for the Draft-js Editor.
const plugins = [imagePlugin];

// Retrieve the user's email from local storage to associate images.
const userEmail = localStorage.getItem('userEmail');

const CustomImageEditor = () => {
  // State to manage the editor's current state.
  const [editorState, setEditorState] = useState(createEditorStateWithText(''));

  // Effect to fetch images for the editor on component mount.
  useEffect(() => {
    fetchImages();
  }, []);

  // Fetches images from the server and loads them into the editor.
  const fetchImages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/images?userEmail=${userEmail}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      if (data.length > 0) {
        const rawContent = data[0].body;
        if (rawContent) {
          setEditorState(EditorState.createWithContent(convertFromRaw(rawContent)));
        } else {
          setEditorState(EditorState.createEmpty());
        }
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setEditorState(EditorState.createEmpty());
    }
  };
  
  // Saves the current editor content as images to the server.
  const saveImages = async () => {
    const contentState = editorState.getCurrentContent();
    const content = convertToRaw(contentState);

    const newImage = {
      body: content,
      userEmail,
    };

    try {
      const response = await fetch(`http://localhost:3001/api/images?userEmail=${userEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newImage),
      });

      if (!response.ok) {
        throw new Error('Failed to add images');
      }

      fetchImages(); // Re-fetch images to update the editor with the latest changes.
    } catch (error) {
      console.error("Error updating images:", error);
    }
  };

  // Handler to update the editor's state based on user input.
  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  return (
    <div>
      <div className={editorStyles.editor}>
        {/* The editor itself, configured with the plugins. */}
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
        />
      </div>
      {/* ImageAdd component to add images to the editor. */}
      <ImageAdd
        editorState={editorState}
        onChange={onChange}
        modifier={imagePlugin.addImage}
      />
      {/* Button to save the current editor content. */}
      <button onClick={saveImages}>Save Image Contents</button>
    </div>
  );
};

export default CustomImageEditor;
