import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CommentSection from './CommentSection';

const data = [
{_id: 1,
text: 'tsdfadf',
title: 'asfaf'}
]

const Posts = () => {

  const [data, setData] = useState();
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getJson = async () => {
      try {
        const response = await fetch(`${baseUrl}/posts`);
        const json = await response.json();
        setData(json);
      } catch (e) {
        console.log(`Error! ${e}`);
      }
    };
    getJson();
  }, []);
  
  return (
    <Container>
      <Typography variant="h1">My favourite Blog</Typography>
      <Typography variant="body1">
Tärkeitä blogipostauksia päivänpolttavista aiheista!
      </Typography>
      <Divider />
      <Stack>
        {data && data.messages.map((post) => (
          <Box bgcolor="#cccccc" mb={2}>
              <Typography variant='h4'>{post.title}</Typography>
              <Typography variant='caption'>{post.user.username} on {post.date}</Typography>
              <Typography variant="body1" component="p">
                  {post.text}
                </Typography>
                <CommentSection postId={post._id} />       
</Box>
        ))}
        </Stack>
    </Container>
  );
};

export default Posts;