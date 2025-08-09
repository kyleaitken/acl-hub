const ProgramSkeleton = () => {
  return (
    <div className="p-5 bg-gray-100 h-screen overflow-y-auto">
      <div className="animate-pulse flex flex-col w-full bg-white mt-10 py-10 px-8 rounded-md">
        <div className="flex justify-between mb-6">
          <div className="flex flex-col flex-grow">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-5 bg-gray-300 rounded w-2/3"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="h-[500px] bg-gray-200 rounded mt-5"></div>
      </div>
    </div>
  );
};

export default ProgramSkeleton;