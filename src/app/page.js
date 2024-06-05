import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto">
      <div className="flex flex-col container p-10 text-center border items-center w-96">
        <Link href="/admin" className="border w-28">Admin</Link>
        <Link href="/checklist" className="border w-28">Checklist</Link>
        <Link href="/cashiers" className="border w-28">Cajeros</Link>
      </div>
    </div>
  );
}
