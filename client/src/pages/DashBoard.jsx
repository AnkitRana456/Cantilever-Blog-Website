import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const { data } = await axios.get('/api/posts/me');
        setPosts(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load your posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete the post.' + (err.response?.data?.error || ''));
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-16 text-lg">Fetching your posts...</div>;
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">Your Dashboard</h1>
          <Link
            to="/create-post"
            className="mt-4 sm:mt-0 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Post
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            <p className="mb-4 text-lg">You haven't created any posts yet.</p>
            <Link to="/create-post" className="text-blue-600 font-medium hover:underline">
              Click here to create your first post.
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white shadow-sm rounded-xl p-6 transition hover:shadow-md"
              >
                <PostCard post={post} />
                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
