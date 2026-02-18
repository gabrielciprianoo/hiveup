export default function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-sm text-red-500 mt-1.5 font-medium">
      {children}
    </p>
  );
}
