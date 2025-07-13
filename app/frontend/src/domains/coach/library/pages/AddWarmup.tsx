import { useNavigate } from "react-router-dom";
import WarmupCooldownForm from "../components/WarmupCooldownForm";
import { useWarmupsActions } from "../hooks/useWarmupsActions";
import { toast } from 'react-hot-toast';
import { WarmupCooldownFormValues } from "../components/WarmupCooldownForm";

const AddWarmup = () => {
    const navigate = useNavigate();
    const { addWarmup } = useWarmupsActions();

    const handleAddWarmup = async (formData: WarmupCooldownFormValues) => {
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
        <WarmupCooldownForm
          formTitle="Add Warmup"
          formType="Warmup"
          initialValues={{}}
          onSubmit={handleAddWarmup}
          isEditing={false}
          submitLabel="Save Warmup"
        />
      </>
    )
};

export default AddWarmup;