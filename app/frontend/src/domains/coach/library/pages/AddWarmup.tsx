import { useNavigate } from "react-router-dom";
import WarmupForm from "../components/WarmupForm";
import { useWarmupsActions } from "../hooks/useWarmupsActions";
import { toast } from 'react-hot-toast';
import { WarmupFormValues } from "../components/WarmupForm";

const AddWarmup = () => {
    const navigate = useNavigate();
    const { addWarmup } = useWarmupsActions();

    const handleAddWarmup = async (formData: WarmupFormValues) => {
        try {
            await addWarmup(formData);
            navigate('/coach/library/warmups'); 
        } catch (e) {
            console.error('Failed to add warmup:', e);
            toast.error("Something went wrong when trying to add the warmup.")
        }
    };

    return (
      <>
        <WarmupForm
          formTitle="Add Warmup"
          initialValues={{}}
          onSubmit={handleAddWarmup}
          isEditing={false}
        />
      </>
    )
};

export default AddWarmup;