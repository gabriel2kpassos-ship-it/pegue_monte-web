import Link from "next/link";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { INSTAGRAM_URL } from "@/config/site";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Viva Encante" className="h-11 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
            <Link className="hover:text-gray-900" href="/catalogo">Catálogo</Link>
            <Link className="hover:text-gray-900" href="/como-funciona">Como funciona</Link>
            <Link className="hover:text-gray-900" href="/galeria">Galeria</Link>
            <Link className="hover:text-gray-900" href="/contato">Contato</Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-2xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50 md:inline-flex"
            >
              Instagram
            </a>
            <Button href="/catalogo" className="hidden md:inline-flex">Ver kits</Button>
            <Button href="/catalogo" className="md:hidden px-4 py-2">Catálogo</Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
