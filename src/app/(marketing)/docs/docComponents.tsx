// Shared presentational components — no hooks, safe for server and client components

export function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 pb-14 border-b border-[#E0E0E0] last:border-0">
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-1">{title}</h2>
      {subtitle && <p className="text-[#666666] mb-6 text-sm">{subtitle}</p>}
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function SubSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 pt-4">
      <h3 className="text-lg font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#C2185B] rounded-full inline-block" />
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
      <span className="font-semibold">Note: </span>{children}
    </div>
  );
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-900">
      <span className="font-semibold">Important: </span>{children}
    </div>
  );
}

export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#27AE60]/5 border border-[#27AE60]/20 rounded-lg px-4 py-3 text-sm text-[#1a6e3a]">
      <span className="font-semibold">Tip: </span>{children}
    </div>
  );
}

export function FieldTable({ rows }: {
  rows: { label: string; type: string; required: boolean; notes?: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
      <table className="w-full text-sm">
        <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
          <tr>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Field</th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Type</th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Required</th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E0E0E0]">
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="px-4 py-2.5 font-medium text-[#1A1A2E]">{r.label}</td>
              <td className="px-4 py-2.5 text-[#666666]">{r.type}</td>
              <td className="px-4 py-2.5">
                {r.required
                  ? <span className="text-[#C2185B] font-medium">Yes</span>
                  : <span className="text-[#666666]">Optional</span>}
              </td>
              <td className="px-4 py-2.5 text-[#666666] text-xs">{r.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ToastTable({ rows }: { rows: { scenario: string; message: string; type?: string }[] }) {
  const color = (t?: string) =>
    t === "success" ? "text-[#27AE60]" : t === "error" ? "text-[#E74C3C]" : t === "warning" ? "text-amber-600" : "text-[#666666]";
  return (
    <div className="overflow-x-auto rounded-lg border border-[#E0E0E0]">
      <table className="w-full text-sm">
        <thead className="bg-[#FAFAFA] border-b border-[#E0E0E0]">
          <tr>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Scenario</th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#666666]">Toast Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E0E0E0]">
          {rows.map((r) => (
            <tr key={r.scenario}>
              <td className="px-4 py-2.5 text-[#1A1A2E]">{r.scenario}</td>
              <td className={`px-4 py-2.5 font-mono text-xs ${color(r.type)}`}>&quot;{r.message}&quot;</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ label, color }: { label: string; color: string }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>{label}</span>;
}
