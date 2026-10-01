import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h1 className="font-serif text-3xl">No encontramos esta página</h1>
      <p className="mt-3 text-muted">Puede que la tienda o el producto ya no esté disponible.</p>
      <Link href="/" className="mt-6 inline-block underline">
        Volver al inicio
      </Link>
    </div>
  );
}
