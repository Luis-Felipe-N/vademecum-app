import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="flex gap-2">
      <span
        className="block w-3 h-8 rounded-3xl bg-cyan-600"
        style={{ transform: "rotate(-30deg)" }}
      ></span>
      <span className="block w-3 h-8 rounded-3xl bg-emerald-600"></span>
    </div>
  );
}
