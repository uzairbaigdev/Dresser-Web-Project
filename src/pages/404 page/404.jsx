import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center">

        <p className="text-blue-500 text-sm font-semibold uppercase tracking-[0.3em] mb-4">
          Error 404
        </p>

        <h1 className="text-[120px] sm:text-[180px] font-black leading-none text-white">
          404
        </h1>

        <h2 className="text-2xl sm:text-4xl font-bold text-white mt-4">
          Page Not Found
        </h2>

        <p className="text-slate-400 max-w-md mx-auto mt-4 leading-7">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition duration-300"
          >
            Go Back
          </button>

        </div>

      </div>
    </div>
  );
};

export default NotFound;


