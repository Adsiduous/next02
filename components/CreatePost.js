import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { listBlogs, listPosts } from "../src/graphql/queries";
import { createPost } from "../src/graphql/mutations";

const initialPostState = { title: "", blogID: "" };

function CreatePost() {
  const [postState, setPostState] = useState(initialPostState);
  const [blogs, setBlogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState("");

  useEffect(() => {
    fetchBlogs();
    fetchPosts();
  }, []);

  const setPostInput = (key, value) => {
    setPostState({ ...postState, [key]: value });
  };

  const fetchBlogs = async () => {
    try {
      const blogsData = await API.graphql(graphqlOperation(listBlogs));
      const blogsd = blogsData.data.listBlogs.items;
      setBlogs(blogsd);
    } catch (err) {
      console.log(err, "error fetching blogs");
    }
  };
  const blogList = blogs.map((blog, index) => {
    return (
      <option key={index} value={blog.id}>
        {blog.name}
      </option>
    );
  });

  const fetchPosts = async () => {
    try {
      const postsData = await API.graphql(graphqlOperation(listPosts));
      const postsd = postsData.data.listPosts.items;
      setPosts(postsd);
    } catch (err) {
      console.log(err, "error fetching Posts");
    }
  };

  const createPosts = async () => {
    try {
      if (!postState.title || !postState.blogID) return;
      const post = { ...postState };
      setPosts([...posts, post]);
      setPostState(initialPostState);
      await API.graphql(graphqlOperation(createPost, { input: post }));
    } catch (err) {
      console.log(err, "unable to create new post");
    }
  };
  return (
    <div>
      <div className="mt-8 mx-auto w-full max-w-md">
        <h1>Create a Post title to selected Blog</h1>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div>
            <select
              onChange={(e) => setPostInput("blogID", e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
            >
              {blogList}
            </select>
            
          </div>

          <div>
            <label
              For="postTitle"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Enter Post Title
            </label>
            <input
              type="text"
              name="postTitle"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
              onChange={(e) => setPostInput("title", e.target.value)}
              value={postState.title}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-400 m-4 p-2 rounded-lg text-white font-bold"
            onClick={createPosts}
          >
            {" "}
            Create a Post{" "}
          </button>
        </div>
      </div>

      {posts.map((post, index) => (
        <div key={post.id ? post.id : index}>
          <p>
            {post.blogID} - {post.title}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CreatePost;
