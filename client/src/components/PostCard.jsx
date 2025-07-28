import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const PostCard = ({ post }) => {
  const { _id, title, content, tags = [], author, createdAt } = post;

  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 mb-6 transition hover:shadow-lg">
      <header className="mb-4">
        <Link to={`/posts/${_id}`}>
          <h2 className="text-2xl font-semibold text-indigo-700 hover:text-indigo-900 transition">
            {title}
          </h2>
        </Link>
      </header>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {content.length > 150 ? `${content.slice(0, 150)}...` : content}
      </p>

      <footer className="flex flex-wrap items-center justify-between text-sm text-gray-500">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-2 sm:mt-0">
          {author?.username && (
            <span className="mr-1 text-gray-600">By <strong>{author.username}</strong></span>
          )}
          <span className="text-gray-400">• {format(new Date(createdAt), 'MMM d, yyyy')}</span>
        </div>
      </footer>
    </article>
  );
};

export default PostCard;
