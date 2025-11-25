export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-black/60 mt-12">
      <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-slate-400">
        <span>© 2025 Deadhead Zero Logistics LLC</span>
        <span className="text-[10px] md:text-xs text-right whitespace-nowrap">
          Technology platform only, not a licensed freight broker or money transmitter. We never hold freight dollars.
        </span>
      </div>
    </footer>
  );
}
