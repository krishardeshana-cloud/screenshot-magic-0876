import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ruko — Check before you invest" },
      { name: "description", content: "Ruko helps Indian investors spot scams, verify SEBI registration and get help fast if fraud happens." },
      { property: "og:title", content: "Ruko — Check before you invest" },
      { property: "og:description", content: "Spot investment scams, verify SEBI registration, and recover quickly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

const R = ({ children, d = 0, className = "" }: { children: ReactNode; d?: number; className?: string }) => (
  <div className={`reveal ${className}`} style={{ ["--d" as string]: `${d}ms` }}>{children}</div>
);

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" /></svg>
);

const Logo = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden><path d="M1 6V1h5M16 1h5v5M21 16v5h-5M6 21H1v-5" stroke="currentColor" strokeWidth="1.6" /><path d="M11 5l5 2v4c0 3-2.2 5-5 6-2.8-1-5-3-5-6V7l5-2z" stroke="currentColor" strokeWidth="1.4" /></svg>
);

const SecHead = ({ n, label, title, id }: { n: string; label: string; title: ReactNode; id?: string }) => (
  <R>
    <div id={id} className="flex items-center gap-3 label-mono text-muted-foreground scroll-mt-24">
      <span>[N.{n}/05]</span><span className="h-px w-8 bg-border" /><span>&gt; {label}</span><span className="h-px flex-1 bg-border" />
    </div>
    <h2 className="mt-6 text-4xl font-normal leading-[1.05] tracking-tight md:text-6xl">{title}</h2>
  </R>
);

const btnDark = "group inline-flex items-center justify-between gap-6 bg-primary px-5 py-3.5 label-mono text-primary-foreground transition-all hover:bg-accent hover:text-accent-foreground active:scale-[.98] disabled:opacity-40";
const btnLight = btnDark.replace("bg-primary", "bg-ink-foreground").replace("text-primary-foreground", "text-ink");
const btnLine = "group inline-flex items-center gap-2 border-b border-current pb-1 label-mono transition-colors hover:text-accent";

const LANGS = ["EN", "हिं", "ગુ", "मरा", "தமி"];

function Nav() {
  const [lang, setLang] = useState("EN");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [["Check", "#check"], ["Result", "#result"], ["Pause", "#pause"], ["Recovery", "#recovery"]];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-ink/90 backdrop-blur-md" : ""}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 text-ink-foreground md:px-8">
        <a href="#top" className="flex items-center gap-2.5"><Logo /><span className="text-2xl tracking-tight">Ruko</span><sup className="label-mono text-ink-muted">IN</sup></a>
        <nav className="hidden gap-1 lg:flex">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="px-3 py-1.5 label-mono text-ink-muted transition-colors hover:bg-ink-foreground hover:text-ink">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)} className="appearance-none border border-ink-border bg-transparent px-3 py-2 pr-7 label-mono text-ink-foreground outline-none focus:border-accent">
              {LANGS.map((l) => <option key={l} className="text-ink">{l}</option>)}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-ink-muted">▾</span>
          </div>
          <a href="#sebi" className="hidden bg-ink-foreground px-4 py-2 label-mono text-ink transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex">↗ Verify SEBI</a>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="border border-ink-border px-3 py-2 label-mono lg:hidden">{open ? "Close" : "Menu"}</button>
        </div>
      </div>
      <div className={`overflow-hidden bg-ink transition-[max-height] duration-500 lg:hidden ${open ? "max-h-96" : "max-h-0"}`}>
        <div className="flex flex-col gap-1 px-5 pb-5 text-ink-foreground">
          {[...links, ["Verify SEBI", "#sebi"]].map(([l, h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} className="border-b border-ink-border py-3 text-lg">{l}</a>
          ))}
          <div className="flex gap-2 pt-3">
            {LANGS.map((l) => <button key={l} onClick={() => setLang(l)} className={`border px-3 py-1.5 label-mono ${lang === l ? "bg-ink-foreground text-ink" : "border-ink-border"}`}>{l}</button>)}
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = () => ref.current && (ref.current.style.transform = `translateY(${window.scrollY * 0.18}px)`);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const cells = [12, 13, 20, 21, 22, 27, 28, 29, 30, 35, 36, 37, 44, 45, 52];
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="absolute inset-0 bg-glow" />
      <div className="absolute inset-0 grid-lines opacity-60" />
      <div ref={ref} className="pointer-events-none absolute right-0 top-24 hidden grid-cols-8 md:grid">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className={`h-12 w-12 ${cells.includes(i) ? "pixel bg-accent" : ""}`} style={{ animationDelay: `${(i % 7) * 400}ms` }} />
        ))}
      </div>
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-36 md:px-8 md:pt-44">
        <div className="grid gap-10 md:grid-cols-2">
          <R>
            <p className="max-w-md text-lg leading-snug text-ink-muted md:text-xl">
              Got a tip that sounds too good? Paste it, upload it, or record it. Ruko checks for scam patterns and SEBI registration before your money moves.
            </p>
            <a href="#check" className={`${btnLight} mt-8`}>■ Check an offer <Arrow /></a>
          </R>
          <R d={200} className="hidden md:flex md:justify-end md:pt-10">
            <p className="label-mono leading-relaxed text-ink-muted">✦ Pause.<br />&nbsp;&nbsp;&nbsp;&nbsp;Verify.<br />&nbsp;&nbsp;Then invest. +</p>
          </R>
        </div>
        <div className="mt-20 flex flex-wrap items-end gap-x-6 md:mt-28">
          <h1 className="font-pixel text-[26vw] font-bold leading-[0.78] tracking-tight md:text-[18vw] lg:text-[15rem]">RUKO<span className="blink text-accent">_</span></h1>
          <p className="pb-2 text-4xl font-light tracking-tight md:text-6xl">Stop. Check.<br />Stay safe.</p>
        </div>
      </div>
      <div className="relative overflow-hidden border-t border-ink-border py-2.5">
        <div className="marquee flex w-max gap-12 label-mono text-ink-muted">
          {Array.from({ length: 8 }).map((_, i) => <span key={i}><span className="text-accent">✦</span> Guaranteed returns are a red flag · Always verify SEBI registration · Call 1930 for cyber fraud</span>)}
        </div>
      </div>
    </section>
  );
}

type Res = { score: number; level: "High" | "Medium" | "Low" };

function Check({ onResult }: { onResult: (r: Res) => void }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const ups = [
    { k: "image", label: "Screenshot", accept: "image/*", hint: "PNG, JPG" },
    { k: "voice", label: "Voice note", accept: "audio/*", hint: "MP3, M4A, OGG" },
    { k: "video", label: "Video", accept: "video/*", hint: "MP4, MOV" },
  ];
  const has = text.trim() || Object.keys(files).length;
  const run = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const s = /guarant|double|assured|tip|crypto|whatsapp|telegram/i.test(text) || !text ? 86 : 42;
      onResult({ score: s, level: s > 70 ? "High" : s > 35 ? "Medium" : "Low" });
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
    }, 1400);
  };
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SecHead id="check" n="01" label="Investment check" title={<><span className="text-muted-foreground">/</span> Show us the offer.<br />We'll show you the risk.</>} />
      <div className="mt-14 grid border border-border md:grid-cols-12">
        <R className="border-b border-border p-6 md:col-span-7 md:border-b-0 md:border-r md:p-8">
          <label htmlFor="msg" className="label-mono text-muted-foreground">// 001 · Paste message or link</label>
          <textarea id="msg" value={text} onChange={(e) => setText(e.target.value)} rows={9}
            placeholder={'e.g. "Join our VIP Telegram group. Guaranteed 3% daily returns on F&O tips..."'}
            className="mt-4 w-full resize-none bg-transparent text-xl leading-snug outline-none placeholder:text-muted-foreground/60" />
          <div className="mt-2 h-px w-full bg-border"><div className="h-px bg-accent transition-all duration-500" style={{ width: `${Math.min(100, text.length / 2)}%` }} /></div>
        </R>
        <div className="flex flex-col md:col-span-5">
          {ups.map((u, i) => (
            <R key={u.k} d={i * 100} className="border-b border-border">
              <label className={`group flex cursor-pointer items-center justify-between gap-4 p-6 transition-colors hover:bg-secondary ${files[u.k] ? "bg-secondary" : ""}`}>
                <div>
                  <span className="label-mono text-muted-foreground">// 00{i + 2}</span>
                  <p className={`mt-1 text-lg ${files[u.k] ? "text-accent" : ""}`}>{u.label}</p>
                  <p className="truncate text-sm text-muted-foreground">{files[u.k] ?? u.hint}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-border text-lg transition-all group-hover:border-foreground group-hover:bg-primary group-hover:text-primary-foreground">{files[u.k] ? "✓" : "+"}</span>
                <input type="file" accept={u.accept} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFiles((p) => ({ ...p, [u.k]: f.name })); }} />
              </label>
            </R>
          ))}
          <div className="dot-grid flex flex-1 items-end p-6">
            <button disabled={!has || loading} onClick={run} className={`${btnDark} w-full`}>
              <span>{loading ? "■ Scanning" : "■ Check now"}{loading && <span className="blink">_</span>}</span><Arrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Result({ r }: { r: Res | null }) {
  const [speaking, setSpeaking] = useState(false);
  const res = r ?? { score: 86, level: "High" as const };
  const flags = [
    ["Guaranteed returns", "Promises fixed daily profit — no SEBI-registered adviser can do this."],
    ["Unregistered entity", "Sender name doesn't match any SEBI intermediary."],
    ["Urgency pressure", "\"Offer closes tonight\" — designed to stop you thinking."],
    ["Off-platform payment", "Asks for UPI to a personal account, not a broker."],
  ];
  const explain = `Risk level ${res.level}. This offer shows common signs of an investment scam. Do not send money. Verify the adviser on SEBI and talk to someone you trust.`;
  const read = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(explain);
    u.onend = () => setSpeaking(false);
    speechSynthesis.speak(u); setSpeaking(true);
  };
  const tone = res.level === "High" ? "bg-destructive" : res.level === "Medium" ? "bg-warning" : "bg-success";
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <R>
          <div id="result" className="flex items-center gap-3 label-mono text-ink-muted scroll-mt-24"><span>[N.02/05]</span><span className="h-px w-8 bg-ink-border" /><span>&gt; Check result {r ? "" : "· sample"}</span><span className="h-px flex-1 bg-ink-border" /></div>
        </R>
        <div key={res.score} className="mt-12 grid gap-12 md:grid-cols-12">
          <R className="md:col-span-5">
            <p className="label-mono text-ink-muted">Verdict</p>
            <p className="mt-3 font-pixel text-7xl font-bold leading-none md:text-8xl">{res.level === "High" ? "LIKELY SCAM" : res.level === "Medium" ? "CAUTION" : "LOOKS OK"}</p>
            <div className="mt-10 flex items-end justify-between border-b border-ink-border pb-3">
              <span className="label-mono text-ink-muted">Risk level</span>
              <span className="text-5xl tracking-tight">{res.score}<span className="text-xl text-ink-muted">/100</span></span>
            </div>
            <div className="mt-4 grid grid-cols-20 gap-1" style={{ gridTemplateColumns: "repeat(20,1fr)" }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={`h-6 transition-all duration-500 ${i < res.score / 5 ? tone : "bg-ink-border"}`} style={{ transitionDelay: `${i * 40}ms` }} />
              ))}
            </div>
            <p className="mt-10 text-lg leading-snug text-ink-muted">{explain}</p>
            <button onClick={read} className={`${btnLight} mt-8`}>{speaking ? "■ Stop reading" : "▷ Read aloud"} <Arrow /></button>
          </R>
          <div className="md:col-span-7">
            <p className="label-mono text-ink-muted">Detected red flags · {flags.length}</p>
            <div className="mt-4 border-t border-ink-border">
              {flags.map(([t, d], i) => (
                <R key={t} d={i * 90}>
                  <div className="group grid grid-cols-[auto_1fr] gap-5 border-b border-ink-border py-5 transition-colors hover:bg-ink-foreground/5">
                    <span className="label-mono text-accent">// 00{i + 1}</span>
                    <div><p className="text-xl">{t}</p><p className="mt-1 text-ink-muted">{d}</p></div>
                  </div>
                </R>
              ))}
            </div>
            <R d={300}>
              <p className="mt-10 label-mono text-ink-muted">Evidence</p>
              <blockquote className="mt-4 border border-ink-border p-6 font-mono text-sm leading-relaxed">
                "...join VIP group, <mark className="bg-destructive px-1 text-ink-foreground">guaranteed 3% daily</mark> profit, <mark className="bg-destructive px-1 text-ink-foreground">only 5 seats left</mark>, pay ₹25,000 to <mark className="bg-destructive px-1 text-ink-foreground">UPI rk.trader@ybl</mark>..."
              </blockquote>
            </R>
          </div>
        </div>
      </div>
    </section>
  );
}

const DB = [
  { name: "Zerodha Broking Ltd", reg: "INZ000031633", type: "Stock Broker", valid: "Perpetual", ok: true },
  { name: "HDFC Securities Ltd", reg: "INZ000186937", type: "Stock Broker", valid: "Perpetual", ok: true },
  { name: "Rakesh Trading Tips", reg: "—", type: "Not found", valid: "—", ok: false },
];

function Sebi() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const results = q ? DB.filter((d) => (d.name + d.reg).toLowerCase().includes(q.toLowerCase())) : DB;
  const list = results.length ? results : [{ name: q, reg: "—", type: "Not found", valid: "—", ok: false }];
  const cur = list[Math.min(sel, list.length - 1)]!;
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SecHead id="sebi" n="03" label="SEBI verification" title={<>Is your adviser <span className="font-mono text-accent">[registered]</span>?</>} />
      <R d={100} className="mt-12">
        <div className="flex items-center gap-3 border-b-2 border-foreground pb-3 transition-colors focus-within:border-accent">
          <span className="label-mono text-muted-foreground">&gt;</span>
          <input value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder="Name or registration no. (INZ / INA / INH)" className="w-full bg-transparent text-2xl outline-none placeholder:text-muted-foreground/60 md:text-3xl" />
        </div>
      </R>
      <div className="mt-10 grid border border-border md:grid-cols-2">
        <div className="border-b border-border md:border-b-0 md:border-r">
          <p className="border-b border-border px-6 py-3 label-mono text-muted-foreground">Search results · {list.length}</p>
          {list.map((d, i) => (
            <button key={d.name + i} onClick={() => setSel(i)} className={`flex w-full items-center justify-between gap-4 border-b border-border px-6 py-5 text-left transition-colors last:border-b-0 hover:bg-secondary ${cur === d ? "bg-secondary" : ""}`}>
              <div><p className="text-lg">{d.name}</p><p className="font-mono text-sm text-muted-foreground">{d.reg}</p></div>
              <span className={`h-2.5 w-2.5 ${d.ok ? "bg-success" : "bg-destructive"}`} />
            </button>
          ))}
        </div>
        <div key={cur.name} className="dot-grid p-6 md:p-8">
          <p className="label-mono text-muted-foreground">Registration details</p>
          <dl className="mt-6 divide-y divide-border bg-background">
            {[["Entity", cur.name], ["Reg. no.", cur.reg], ["Category", cur.type], ["Valid till", cur.valid]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3"><dt className="label-mono text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>
            ))}
          </dl>
          <div className={`mt-6 flex items-center justify-between px-5 py-4 label-mono ${cur.ok ? "bg-success" : "bg-destructive"} text-primary-foreground`}>
            <span>Status</span><span>{cur.ok ? "✓ Verified" : "✕ Not registered"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pause() {
  const [amt, setAmt] = useState(50000);
  const [checked, setChecked] = useState<number[]>([]);
  const qs = ["Would I still invest if no one was rushing me?", "Can I find this adviser on the SEBI site myself?", "Could I afford to lose all of this money?", "Have I told someone I trust about this?"];
  const share = async () => {
    const t = `I'm pausing for 24 hours before investing ₹${amt.toLocaleString("en-IN")}. Can you take a look with me? — via Ruko`;
    if (navigator.share) { try { await navigator.share({ text: t }); } catch { /* cancelled */ } }
    else window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, "_blank");
  };
  const remind = () => {
    const d = new Date(Date.now() + 864e5).toISOString().replace(/[-:]|\.\d{3}/g, "");
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${d}\nDTEND:${d}\nSUMMARY:Ruko: revisit investment decision\nEND:VEVENT\nEND:VCALENDAR`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "ruko-reminder.ics"; a.click();
  };
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SecHead id="pause" n="04" label="Safety pause" title={<>Wait <span className="font-pixel font-bold">24:00:00</span><br />before you send a rupee.</>} />
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div>
            <R><p className="max-w-md text-lg text-muted-foreground">Scammers count on speed. Real opportunities will still be there tomorrow. Answer honestly:</p></R>
            <div className="mt-8 border-t border-border">
              {qs.map((q, i) => {
                const on = checked.includes(i);
                return (
                  <R key={q} d={i * 80}>
                    <button onClick={() => setChecked((c) => (on ? c.filter((x) => x !== i) : [...c, i]))} className="flex w-full items-center gap-5 border-b border-border py-5 text-left transition-colors hover:text-accent">
                      <span className={`grid h-6 w-6 shrink-0 place-items-center border text-xs transition-all ${on ? "border-accent bg-accent text-accent-foreground" : "border-foreground"}`}>{on && "✓"}</span>
                      <span className="text-xl">{q}</span>
                    </button>
                  </R>
                );
              })}
            </div>
          </div>
          <R d={150}>
            <div className="border border-border bg-background p-6 md:p-8">
              <p className="label-mono text-muted-foreground">Potential loss</p>
              <p className="mt-4 text-6xl tracking-tight md:text-7xl">₹{amt.toLocaleString("en-IN")}</p>
              <input type="range" min={5000} max={1000000} step={5000} value={amt} onChange={(e) => setAmt(+e.target.value)} className="mt-6 w-full accent-accent" aria-label="Amount" />
              <p className="mt-4 text-muted-foreground">≈ {Math.round(amt / 25000)} months of an average Indian household's savings.</p>
              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                <button onClick={share} className={btnDark}>↗ Share with family <Arrow /></button>
                <button onClick={remind} className="group inline-flex items-center justify-between gap-4 border border-foreground px-5 py-3.5 label-mono transition-colors hover:bg-primary hover:text-primary-foreground">◷ Remind in 24h <Arrow /></button>
              </div>
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

function Recovery() {
  const items = [
    { n: "1930", t: "Cyber fraud helpline", d: "Call within the golden hour to freeze the money trail.", href: "tel:1930", cta: "Call now" },
    { n: "NCRP", t: "Cybercrime portal", d: "File a complaint on cybercrime.gov.in with screenshots and UTR.", href: "https://cybercrime.gov.in", cta: "Report" },
    { n: "SCORES", t: "SEBI complaint", d: "Report unregistered advisers and market fraud to SEBI.", href: "https://scores.sebi.gov.in", cta: "Report" },
    { n: "CMS", t: "RBI complaint", d: "Raise bank or UPI payment disputes with the RBI Ombudsman.", href: "https://cms.rbi.org.in", cta: "Report" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SecHead id="recovery" n="05" label="Emergency recovery" title={<>Already paid? <span className="text-muted-foreground">Act in the next hour.</span></>} />
      <div className="mt-14 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <R key={it.n} d={i * 100} className="border-b border-r border-border">
            <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`group flex h-full min-h-72 flex-col p-6 transition-colors ${i === 0 ? "bg-destructive text-destructive-foreground" : "hover:bg-primary hover:text-primary-foreground"}`}>
              <span className="label-mono opacity-70">// 00{i + 1}</span>
              <p className={`mt-6 font-pixel font-bold leading-none ${i === 0 ? "text-7xl" : "text-5xl"}`}>{it.n}</p>
              <p className="mt-auto pt-8 text-xl">{it.t}</p>
              <p className="mt-2 text-sm opacity-75">{it.d}</p>
              <span className="mt-6 inline-flex items-center gap-2 label-mono">{it.cta} <Arrow /></span>
            </a>
          </R>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="absolute inset-0 grid-lines opacity-40" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-5 pb-8 pt-20 md:px-8">
        <p className="font-pixel text-[28vw] font-bold leading-[0.75] md:text-[16rem]">RUKO</p>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-border pt-6 label-mono text-ink-muted">
          <span className="flex items-center gap-2"><Logo /> © 2026 Ruko · Investor protection</span>
          <a href="#" className="transition-colors hover:text-ink-foreground">Privacy policy ↗</a>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  const [res, setRes] = useState<Res | null>(null);
  useReveal();
  return (
    <main>
      <Nav />
      <Hero />
      <Check onResult={setRes} />
      <Result r={res} />
      <Sebi />
      <Pause />
      <Recovery />
      <Footer />
    </main>
  );
}
