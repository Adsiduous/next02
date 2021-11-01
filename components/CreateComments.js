import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { listPosts, listComments } from "../src/graphql/queries";
import { createComment } from "../src/graphql/mutations";

const initialcommentState = { content: "", postID: "" };

function CreateComments() {
  const [commentState, setcommentState] = useState(initialcommentState);
  const [posts, setposts] = useState([]);
  const [comments, setcomments] = useState([]);

  useEffect(() => {
    fetchposts();
    fetchcomments();
  }, []);

  const setcommentInput = (key, value) => {
    setcommentState({ ...commentState, [key]: value });
  };

  const fetchposts = async () => {
    try {
      const postsData = await API.graphql(graphqlOperation(listPosts));
      const postsd = postsData.data.listPosts.items;
      setposts(postsd);
    } catch (err) {
      console.log(err, "error fetching posts");
    }
  };
  const postList = posts.map((post, index) => {
    return (
      <option key={index} value={post.id}>
        {post.title}
      </option>
    );
  });

  const fetchcomments = async () => {
    try {
      const commentsData = await API.graphql(graphqlOperation(listComments));
      const commentsd = commentsData.data.listComments.items;
      setcomments(commentsd);
    } catch (err) {
      console.log(err, "error fetching comments");
    }
  };

  const createcomments = async () => {
    try {
      if (!commentState.content || !commentState.postID) return;
      const comment = { ...commentState };
      setcomments([...comments, comment]);
      setcommentState(initialcommentState);
      await API.graphql(graphqlOperation(createComment, { input: comment }));
    } catch (err) {
      console.log(err, "unable to create new comment");
    }
  };
  return (
    <div>
      <div className="mt-8 mx-auto w-full max-w-md">
        <h1>Create a comment title to selected post</h1>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div>
            <select
              onChange={(e) => setcommentInput("postID", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
            >
              {postList}
            </select>
          </div>

          <div>
            <label
              For="commentTitle"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Enter comment Title
            </label>
            <input
              type="text"
              name="commentTitle"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
              onChange={(e) => setcommentInput("content", e.target.value)}
              value={commentState.content}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-400 m-4 p-2 rounded-lg text-white font-bold"
            onClick={createcomments}
          >
            {" "}
            Create a comment{" "}
          </button>
        </div>
      </div>

      {comments.map((comment, index) => (
        <div key={comment.id ? comment.id : index}>
          <p>
            {comment.postID} - {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CreateComments;
