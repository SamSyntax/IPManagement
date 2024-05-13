const NotFoundPage = () => {
  return (
    <div className="w-[90vw] text-xl h-[100vh] flex items-center justify-center border broder-red-600 text-center gap-8">
      {/* {notFound()} */}
      <span className="text-white leading-tight text-2xl font-semibold">
        404
      </span>
      <div className="h-16 w-[1px] bg-muted"></div>
      <span className="text-white leading-tight text-sm font-light">
        This page could not be found.
      </span>
    </div>
  );
};

export default NotFoundPage;
