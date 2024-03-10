
import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import ImageAdd from './ImageAdd';
import editorStyles from './editorStyles.module.css';

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

const userEmail = localStorage.getItem('userEmail');

const CustomImageEditor = () => {
  const [editorState, setEditorState] = useState(createEditorStateWithText(''));

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/images?userEmail=${userEmail}`);

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      if (data.length > 0) {
        const rawContent = data[0].body; // Assuming the body property contains the content
        console.log("This is rawContent", rawContent);
        if (rawContent) {
          setEditorState(EditorState.createWithContent(convertFromRaw(rawContent)));
        } else {
          setEditorState(EditorState.createEmpty());
        }
      }
      // const formattedImages = data.map(image => ({
      //   ...image
      // }));
      // if (formattedImages.length > 0) {
      //   const rawContent = formattedImages[0].body; // Assuming the body property contains the content
      //   console.log("This is rawContent", rawContent);
      //   if (rawContent) {
      //     setEditorState(EditorState.createWithContent(convertFromRaw(rawContent)));
      //   } else {
      //     setEditorState(EditorState.createEmpty());
      //   }
      // }
      console.log('Server response:', data);
    } catch (error) {
      console.error("Error fetching images:", error);
      setEditorState(EditorState.createEmpty());
    }
  };
  
  const saveImages = async () => {
    const contentState = editorState.getCurrentContent();
    console.log("User Email:", userEmail);
    console.log("Content State:", contentState);
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
      console.log('Server response:', response);
      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error('Failed to add images');
      }

      fetchImages(); // Fetch images again after adding a new image
    } catch (error) {
      console.error("Error updating images:", error);
    }
  };

  // const saveImages = async () => {
  //   const contentState = editorState.getCurrentContent();
  //   console.log("User Email:", userEmail);
  //   console.log("Content State:", contentState);
  //   const content = convertToRaw(contentState);

  //   // Check if there's existing content
  //   const hasExistingContent = contentState.getBlockMap().asMutable().some(block => block.getText().trim() !== '');

  //   try {
  //     if (hasExistingContent) {
  //       console.log('Updating existing image');
  //       // Use PUT request for update
  //       const response = await fetch(`http://localhost:3001/api/images?userEmail=${userEmail}`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ body: content }),
  //       });
  //       console.log('Server response:', response);
  //       const responseData = await response.json();
  //       console.log('Server response:', responseData);

  //       if (!response.ok) {
  //         throw new Error('Failed to update images');
  //       }
  //     } else {
  //       console.log('Creating new image');
  //       // Use POST request for new image
  //       const response = await fetch(`http://localhost:3001/api/images`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ body: content, userEmail }),
  //       });
  //       console.log('Server response:', response);
  //       const responseData = await response.json();
  //       console.log('Server response:', responseData);

  //       if (!response.ok) {
  //         throw new Error('Failed to add images');
  //       }
  //     }
  //   console.log("This has worked so far");
  //   fetchImages(); // Fetch images again after adding/updating image
  // } catch (error) {
  //     console.error("Error saving images:", error);
  //   }
  // };

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
      <ImageAdd
        editorState={editorState}
        onChange={onChange}
        modifier={imagePlugin.addImage}
      />
      <button onClick={saveImages}>Save Image</button>
    </div>
  );
};

export default CustomImageEditor;