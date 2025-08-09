import { useNavigate } from "react-router-dom";
import WarmupCooldownForm from "../components/WarmupCooldownForm";
import { useCooldownsActions } from "../hooks/useCooldownsActions";
import { toast } from 'react-hot-toast';
import { WarmupCooldownFormValues } from "../components/WarmupCooldownForm";

const AddCooldown = () => {
    const navigate = useNavigate();
    const { addCooldown } = useCooldownsActions();

    const handleAddCooldown = async (formData: WarmupCooldownFormValues) => {
        try {
            await addCooldown(formData);
            navigate('/coach/library/cooldowns'); 
            toast.success("Added new cooldown!")
        } catch (e) {
            console.error('Failed to add cooldown:', e);
            toast.error("Something went wrong when trying to add the cooldown.")
        }
    };

    return (
      <>
        <WarmupCooldownForm
          formTitle="Add Cooldown"
          formType="Cooldown"
          initialValues={{}}
          onSubmit={handleAddCooldown}
          isEditing={false}
          submitLabel="Save Cooldown"
        />
      </>
    )
};

export default AddCooldown;