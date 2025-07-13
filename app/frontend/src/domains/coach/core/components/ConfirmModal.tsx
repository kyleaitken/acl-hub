import { useEffect } from "react";

interface ConfirmModalProps {
    confirmHandler: () => void,
    cancelHandler: () => void,
    title: string;
    confirmButtonText?: string;
    cancelButtonText?: string
    isDanger?: boolean;
}

const ConfirmModal = ({confirmHandler, cancelHandler, title, confirmButtonText, cancelButtonText, isDanger}: ConfirmModalProps) => {

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
          if (e.key === 'Escape') cancelHandler();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
            <div className="flex flex-col bg-white p-6 rounded-md shadow-lg min-w-[400px] min-h-[150px]">
                <p className="text-md font-semibold mb-4">
                    {title}
                </p>
                <div className="flex justify-start space-x-4 mt-auto">
                    <button
                        onClick={cancelHandler}
                        className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer"
                    >
                        {cancelButtonText ?? "Cancel"}
                    </button>
                    <button
                        onClick={confirmHandler}
                        className={`px-4 py-2 text-sm rounded-md cursor-pointer ${
                            isDanger ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        {confirmButtonText ?? "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal;