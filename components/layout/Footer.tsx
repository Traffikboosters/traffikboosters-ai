import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#0e0e0e] border-t border-[var(--border-green)] pt-20 pb-10 px-8 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="font-display text-[28px] tracking-[0.1em] text-[var(--white)] mb-4">
              TRAFFIK<span style={{ color: "var(--green)" }}>BOOSTERS</span>
              <span style={{ color: "var(--green)", fontSize: 14 }}>.AI</span>
            </div>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-6 max-w-[260px]">
              AI-Powered Growth Infrastructure for businesses ready to scale fast.
            </p>
            <div className="flex flex-col gap-2">
              <a href="tel:9546373041" className="text-[13px] text-[var(--text-dim)] hover:text-[var(--green)] transition-colors">📞 954-637-3041</a>
              <a href="mailto:admin@traffikboosters.com" className="text-[13px] text-[var(--text-dim)] hover:text-[var(--green)] transition-colors">✉ admin@traffikboosters.com</a>
              <span className="text-[12px] text-[var(--text-muted)]">📍 899 W Cypress Creek Rd, Fort Lauderdale, FL 33309</span>
            </div>
          </div>
          {[
            { title: "Services", links: ["AI Automation","Lead Generation","SEO Engine","Paid Media","Web Design"] },
            { title: "AI Team", links: ["Steve — Sales","Zara — HR","Rico — Fulfillment","Vox — Chat","Sentinel — Security"] },
            { title: "Company", links: ["STARZ-OS Platform","Contractor Program","Case Studies","Privacy Policy","Terms of Service"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--text-muted)] mb-5">{col.title}</h4>
              <div className="flex flex-col gap-3">
                {col.links.map(l => (
                  <Link key={l} href="#" className="text-[13px] text-[var(--text-dim)] hover:text-[var(--white)] transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[var(--text-muted)]">© 2026 Traffik Boosters Corp. All Rights Reserved. · Traffikboosters.AI</p>
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <span style={{ color: "var(--green)" }}>🛡️</span> SENTINEL PROTECTED · STARZ-OS POWERED
          </span>
        </div>
      </div>
    </footer>
  )
}