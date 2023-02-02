import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CommentSection = ({ postId }) => {
  const [data, setData] = useState();
  const [comment, setComment] = useState();
  const [username, setUsername] = useState();
  const baseUrl = process.env.REACT_APP_API_URL;

  const postDataToServer = async (comment, username, postid) => {

    const baseUrl = process.env.REACT_APP_API_URL;
    let response;
    let data;
  
    try {
      const url = `${baseUrl}/posts/${postid}/comments/create`;
      response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({text: comment, post: postid, username: username}), // body data type must match "Content-Type" header
      });
      data = await response.json();    
    } catch (e) {
      alert(`Error! ${e}`);
    }
  };

  useEffect(() => {
    const getComments = async (id) => {
        try {
          const response = await fetch(`${baseUrl}/posts/${id}/comments`);
          const json = await response.json();
          setData(json);
        } catch (e) {
          console.log(`Error! ${e}`);
        }
      };
    getComments(postId);
  }, []);
  
  return (
    <Box border='2px dotted pink'>
    <Typography>Comments:</Typography>
    <Stack>
        {data && data.comments ? data.comments.map((comment) => (
                    <Box>
                  <Typography variant="body1" component="p">
                  {comment.text} ({comment.user} on {comment.date})
                </Typography>
                </Box>
                )) : <Typography>No comments yet</Typography>}  
    </Stack>

    <Box
      component="form"
      action=''
      type='submit'
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
            <TextField
          id="standard"
          label="username"
          variant="standard"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="standard-multiline-flexible"
          label="Comment"
          multiline
          maxRows={4}
          variant="standard"
          onChange={(e) => setComment(e.target.value)}
        />
<Button onClick={() => postDataToServer(comment, username, postId)}>Add comment</Button>
    </Box>

    </Box>
  );
};

export default CommentSection;