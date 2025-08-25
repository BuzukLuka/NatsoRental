export default function Select({
  label,
  options = [],
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: { label: string; value: string }[];
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label && <span className="font-medium">{label}</span>}
      <select {...rest} className={`select ${rest.className ?? ""}`}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
