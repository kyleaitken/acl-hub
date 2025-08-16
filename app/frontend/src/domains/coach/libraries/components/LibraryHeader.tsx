import AddIcon from '@mui/icons-material/Add';

interface LibraryHeaderProps {
    title: string;
    subtitle: string;
    buttonText: string;
    addHandler: () => void;
}

const LibraryHeader = ({title, subtitle, buttonText, addHandler}: LibraryHeaderProps) => {
    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <p className="font-semibold text-xl">{title}</p>
                <button               
                    className="h-[40px] min-w-[170px] text-sm rounded-md bg-[var(--blue-button)] px-3 py-2 text-white cursor-pointer flex items-center justify-center"
                    onClick={addHandler}
                >
                    <AddIcon sx={{mr: 1, fontSize: 20}}/>
                    {buttonText}
                </button>
            </div>
            <p className='text-sm'>{subtitle}</p>
        </div>
    )
};

export default LibraryHeader;