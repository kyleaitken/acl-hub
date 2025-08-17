interface LibraryTableProps {
    columns: Array<Column>;
    data: Array<any>;
    handleItemClicked: (id: number) => void;
}

interface Column {
    label: string;
    accessor: string;
    width: string;
}

const LibraryTable = ({ columns, data, handleItemClicked }: LibraryTableProps) => {
    return (
      <div className="mt-6">
        <div className="flex border rounded-t-md bg-[#eaeafe] px-2 py-3 font-semibold text-[14px] text-gray-700">
          {columns.map((col, index) => (
            <div
              key={index}
              className="px-2"
              style={{ width: col.width }}
            >
              {col.label}
            </div>
          ))}
        </div>
  
        {data.map((item) => (
          <div
            key={item.id}
            className="flex border border-t-0 text-[12px] bg-white cursor-pointer hover:bg-gray-100 px-2 py-3"
            onClick={() => handleItemClicked(item.id)}
          >
            {columns.map((col, index) => (
              <div
                key={index}
                style={{
                  width: col.width,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                }}
                className="px-2"
              >
                {item[col.accessor]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  

export default LibraryTable;
