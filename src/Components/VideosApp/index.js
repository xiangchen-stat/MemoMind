import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createVideoPlugin from '@draft-js-plugins/video';
import VideoAdd from './VideoAdd';
import editorStyles from './editorStyles.module.css';

const videoPlugin = createVideoPlugin();
const plugins = [videoPlugin];

const userEmail = localStorage.getItem('userEmail');

const CustomVideoEditor = () => {
  const [editorState, setEditorState] = useState(createEditorStateWithText(''));

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/videos?userEmail=${userEmail}`);

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      if (data.length > 0) {
        const rawContent = data[0].body; // Assuming the body property contains the content
        // console.log("This is rawContent", rawContent);
        if (rawContent) {
          setEditorState(EditorState.createWithContent(convertFromRaw(rawContent)));
        } else {
          setEditorState(EditorState.createEmpty());
        }
      }
      // console.log('Server response:', data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setEditorState(EditorState.createEmpty());
    }
  };

  const saveVideos = async () => {
    const contentState = editorState.getCurrentContent();
    // console.log("User Email:", userEmail);
    // console.log("Content State:", contentState);
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
      // console.log('Server response:', response);
      // const responseData = await response.json();
      // console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error('Failed to add images');
      }

      fetchVideos(); // Fetch images again after adding a new image
    } catch (error) {
      console.error("Error updating images:", error);
    }
  };

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  return (
    <div>
      <div className={editorStyles.editor}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
        />
      </div>
      <VideoAdd
        editorState={editorState}
        onChange={onChange}
        modifier={videoPlugin.addVideo}
      />
      <button onClick={saveVideos}>Save Videos Contents</button>
    </div>
  );
};

export default CustomVideoEditor;