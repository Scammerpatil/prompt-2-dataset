import Link from "next/link";

const PageNotFound = () => {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        {/* Link to go back to previous page */}
        <Link href="/" className="link underline">
          Go back
        </Link>
      </div>
    </>
  );
};

export default PageNotFound;
