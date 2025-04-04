import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg animate-bounce">
        <h1 className="text-6xl font-bold text-gray-900 mb-4 drop-shadow-md">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="text-blue-500 hover:text-blue-700 underline text-lg font-semibold transition duration-300 ease-in-out"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
