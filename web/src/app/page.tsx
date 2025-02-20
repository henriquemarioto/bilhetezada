import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 bg-neutral-50">
      <Link href='/login' className="p-6 bg-amber-200">Login</Link>
    </div>
  );
}
