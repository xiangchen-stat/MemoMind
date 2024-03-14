import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createVideoPlugin from '@draft-js-plugins/video';
import VideoAdd from './VideoAdd';
import editorStyles from './editorStyles.module.css';

/**
 * A React component for an enhanced text editor with video handling capabilities.
 * Utilizes `draft-js` for editor functionality and a custom video plugin for video insertion.
 * Enables users to add videos to their text content by providing video URLs.
 * Users can fetch videos associated with their account on component mount and save new video content.
 * 
 * @author Cindy Ding
 * @component
 * Leverages the `draft-js-plugins-editor` for editor instantiation and a custom `VideoAdd` component for adding videos.
 * Initiates a fetch operation on component mount to load video content and provides functionality to save new video content.
 * @example
 * return (
 *   <CustomVideoEditor />
 * )
 */

// Initialize the video plugin for the editor.
const videoPlugin = createVideoPlugin();
// Include the video plugin in the plugins array for the Draft-js Editor.
const plugins = [videoPlugin];

// Retrieve the user's email from local storage to associate videos.
const userEmail = localStorage.getItem('userEmail');

const CustomVideoEditor = () => {
  // State to manage the editor's current state.
  const [editorState, setEditorState] = useState(createEditorStateWithText(''));

  // Effect to fetch videos for the editor on component mount.
  useEffect(() => {
    fetchVideos();
  }, []);

  // Fetches videos from the server and loads them into the editor.
  const fetchVideos = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/videos?userEmail=${userEmail}`);
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
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
      console.error("Error fetching videos:", error);
      setEditorState(EditorState.createEmpty());
    }
  };

  // Saves the current editor content as videos to the server.
  const saveVideos = async () => {
    const contentState = editorState.getCurrentContent();
    const content = convertToRaw(contentState);
    const newVideo = {
      body: content,
      userEmail,
    };

    try {
      const response = await fetch(`http://localhost:3001/api/videos?userEmail=${userEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVideo),
      });

      if (!response.ok) {
        throw new Error('Failed to add images');
      }

      fetchVideos(); // Re-fetch videos to update the editor with the latest changes.
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
      {/* VideoAdd component to add videos to the editor. */}
      <VideoAdd
        editorState={editorState}
        onChange={onChange}
        modifier={videoPlugin.addVideo}
      />
      {/* Button to save the current editor content as videos. */}
      <button onClick={saveVideos}>Save Video Contents</button>
    </div>
  );
};

export default CustomVideoEditor;
