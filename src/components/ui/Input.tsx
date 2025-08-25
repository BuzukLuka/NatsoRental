export default function Input({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="grid gap-1 text-sm">
      {label && <span className="font-medium">{label}</span>}
      <input {...rest} className={`input ${rest.className ?? ""}`} />
    </label>
  );
}
