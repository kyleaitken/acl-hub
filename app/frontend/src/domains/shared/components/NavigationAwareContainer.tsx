const NavigationAwareContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-[#f3f4f6] pl-[240px] sm:pl-[220px]">
      {children}
    </div>
  );
};

export default NavigationAwareContainer;
