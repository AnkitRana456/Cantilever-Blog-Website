import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load the post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600 animate-pulse">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{post.title}</h1>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        {post.author?.username && (
          <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
            👤 {post.author.username}
          </span>
        )}
        <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
          📅 {format(new Date(post.createdAt), 'MMMM d, yyyy')}
        </span>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-gray-800 whitespace-pre-line leading-relaxed">
        {post.content}
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          ← Back to Posts
        </Link>
      </div>
    </div>
  );
};

export default Post;
