import { ButtonHTMLAttributes } from "react";
export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`btn btn-primary ${props.className ?? ""}`} />
  );
}
