import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 p-6 text-sm md:grid-cols-4">
        <div>
          <div className="font-bold">Services</div>
          <ul className="mt-2 space-y-1 text-black/70">
            <li>Mid‑term rentals</li>
            <li>Long‑term rentals</li>
            <li>Property management</li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Info</div>
          <ul className="mt-2 space-y-1 text-black/70">
            <li>
              <Link href="/info/policies">Policies</Link>
            </li>
            <li>
              <Link href="/info/house-rules">House rules</Link>
            </li>
            <li>
              <Link href="/info/wifi">Wi‑Fi</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Company</div>
          <ul className="mt-2 space-y-1 text-black/70">
            <li>About</li>
            <li>Careers</li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Calgary Only</div>
          <p className="mt-2 text-black/70">
            Focused on neighborhoods like Beltline, Kensington, Inglewood,
            Brentwood, and more.
          </p>
        </div>
      </div>
      <div className="border-t border-black/10 p-4 text-center text-xs text-black/60">
        © {new Date().getFullYear()} Natso Rental
      </div>
    </footer>
  );
}
