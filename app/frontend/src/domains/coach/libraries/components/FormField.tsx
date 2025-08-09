const FormField = ({
    label,
    id,
    required = false,
    children,
  }: {
    label: string;
    id: string;
    required?: boolean;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col px-5 pb-5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
  
export default FormField;