import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { listBlogs, getBlog } from "../src/graphql/queries";
import { createBlog } from "../src/graphql/mutations";
import CreatePost from "../components/createPost";
import CreateComments from "../components/CreateComments";

const initialBlogState = { name: "", category: "" };

const Index = () => {
  const [blogState, setBlogState] = useState(initialBlogState);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
    getABlog();
  }, []);

  const setBlogInput = (key, value) => {
    setBlogState({ ...blogState, [key]: value });
  };

  const getABlog = async () => {
    try {
      const blogdata = await API.graphql(
        graphqlOperation(getBlog, {
          id: "43f3cc45-fd33-4130-a3ae-2a247a2da6db",
        })
      );
    } catch (err) {
      console.log("Error get a blog", err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const blogsData = await API.graphql(
        graphqlOperation(listBlogs, {
          filter: {
            createdAt: { between: ["2021-10-27", "2021-10-29"] },
          },
        })
      );
      const blogsd = blogsData.data.listBlogs.items;
      setBlogs(blogsd);
      console.log("filter Blogs Data", blogsData);
    } catch (err) {
      console.log(err, "error fetching blogs");
    }
  };

  const createBlogs = async () => {
    try {
      if (!blogState.name || !blogState.category) return;
      const blog = { ...blogState };
      setBlogs([...blogs, blog]);
      setBlogState(initialBlogState);
      await API.graphql(graphqlOperation(createBlog, { input: blog }));
    } catch (err) {
      console.log(err, "unable to create new blog");
    }
  };

  return (
    <div className="mt-8 mx-auto w-full max-w-md">
      <h1>Create a new Blog name and Category</h1>
      <div className="bg-white py-8 px-6 shadow rounded-lg">
        <div>
          <label
            For="blogname"
            className="block text-sm font-medium text-gray-700"
          >
            {" "}
            Blog Name
          </label>
          <input
            type="text"
            name="blogname"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
            onChange={(e) => setBlogInput("name", e.target.value)}
            value={blogState.name}
          />
        </div>
        <div>
          <label
            For="blogdesc"
            className="block text-sm font-medium text-gray-700"
          >
            {" "}
            Enter the Category
          </label>
          <input
            type="text"
            name="blogdesc"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm"
            onChange={(e) => setBlogInput("category", e.target.value)}
            value={blogState.category}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-400 m-4 p-2 rounded-lg text-white font-bold"
          onClick={createBlogs}
        >
          {" "}
          Create a Blog{" "}
        </button>
      </div>
      {blogs.map((blog, index) => (
        <div key={blog.id ? blog.id : index}>
          <p>
            {blog.name} - {blog.category}
          </p>
        </div>
      ))}
      <CreatePost />
      <CreateComments />
    </div>
  );
};

export default Index;
