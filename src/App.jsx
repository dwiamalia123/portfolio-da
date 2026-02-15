import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ========= DATA ========= */

const PROFILE = {
  name: "Dwi Amalia",
  title: "Data Enthusiast",
  location: "Jakarta, Indonesia",
  email: "dwiamalia228@gmail.com",
  links: {
    linkedin: "#",
    github: "#",
  },
  // optional: taruh foto di public/profile.jpg
  photo: "/profile.jpg",
};

const TOOL_GROUPS = [
  { key: "All", label: "All" },
  { key: "Python", label: "Python" },
  { key: "SQL", label: "SQL" },
  { key: "BI", label: "BI (Power BI/Tableau)" },
];

const PROJECTS = [
  {
    id: "screen-time",
    title: "Indian Kids Screen Time Analyst",
    time: "Oct 2025 – Nov 2025",
    tools: ["Python", "Power BI", "Canva"],
    tags: ["Python", "BI"],
    problem:
      "Memahami pola screen time anak dan faktor yang berkaitan dengan durasi penggunaan.",
    approach: [
      "Data cleaning & transform (handle missing/format data).",
      "EDA untuk pola durasi, segmentasi, dan korelasi.",
      "Membangun dashboard Power BI untuk storytelling.",
    ],
    insights: [
      "Mengidentifikasi segmen dengan screen time tertinggi.",
      "Menemukan pola berdasarkan kategori/atribut pada dataset.",
      "Menyusun rekomendasi berbasis data untuk kebiasaan digital sehat.",
    ],
    deliverables: ["Power BI dashboard", "Insight summary"],
    links: { caseStudy: "#", dashboard: "#", github: "#" },
  },
  {
    id: "airline-exp",
    title: "Airline Passenger Experience Analyst",
    time: "Nov 2025 – Dec 2025",
    tools: ["Python", "Tableau", "Canva"],
    tags: ["Python", "BI"],
    problem:
      "Menemukan driver utama yang memengaruhi kepuasan penumpang maskapai.",
    approach: [
      "EDA untuk faktor kepuasan & segmentasi penumpang.",
      "Membuat visualisasi metrik penting untuk stakeholder.",
      "Membangun dashboard Tableau.",
    ],
    insights: [
      "Membedakan faktor dengan pengaruh paling besar ke rating.",
      "Mengidentifikasi area perbaikan service & experience.",
    ],
    deliverables: ["Tableau dashboard", "Insight summary"],
    links: { caseStudy: "#", dashboard: "#", github: "#" },
  },
  {
    id: "ecom-behavior",
    title: "E-Commerce Customer Purchase Behavior",
    time: "Nov 2025 – Dec 2025",
    tools: ["Python", "Power BI / Tableau", "Canva"],
    tags: ["Python", "BI"],
    problem:
      "Menganalisis perilaku pembelian customer untuk mendukung retention & satisfaction.",
    approach: [
      "Data cleaning & feature exploration.",
      "Segmentasi & analisis pola pembelian.",
      "Dashboard untuk tren dan cohort sederhana.",
    ],
    insights: [
      "Menemukan pola pembelian per segmen.",
      "Menghasilkan insight untuk strategi retention.",
    ],
    deliverables: ["BI dashboard", "Insight summary"],
    links: { caseStudy: "#", dashboard: "#", github: "#" },
  },
  {
    id: "wine-predict",
    title: "Wine Quality Prediction",
    time: "Dec 2025 – Jan 2026",
    tools: ["Python", "Streamlit", "Canva"],
    tags: ["Python"],
    problem:
      "Memprediksi kualitas wine berdasarkan fitur physicochemical dan memahami faktor yang berpengaruh.",
    approach: [
      "EDA & feature correlation.",
      "Training model & evaluasi performa.",
      "Deploy demo via Streamlit app.",
    ],
    insights: [
      "Fitur tertentu paling berpengaruh ke quality score.",
      "Model dapat dipakai sebagai baseline prediksi.",
    ],
    deliverables: ["Streamlit app", "Model evaluation"],
    links: { caseStudy: "#", dashboard: "#", github: "#" },
  },
  {
    id: "hotel-booking",
    title: "Hotel Booking Analyst",
    time: "Jan 2026",
    tools: ["Python", "Power BI / Tableau", "Canva"],
    tags: ["Python", "BI"],
    problem:
      "Menganalisis booking behavior dan cancellation drivers untuk optimasi occupancy & revenue.",
    approach: [
      "EDA: seasonality, ADR, lead time, cancellations.",
      "Segmentasi pelanggan & channel.",
      "Dashboard untuk monitoring KPI.",
    ],
    insights: [
      "Memetakan pola cancellation per segmen/channel.",
      "Mengidentifikasi periode high/low season untuk strategi harga.",
    ],
    deliverables: ["BI dashboard", "KPI monitoring"],
    links: { caseStudy: "#", dashboard: "#", github: "#" },
  },
  {
    id: "food-delivery",
    title: "Food Delivery Time Prediction",
    time: "Jan 2026",
    tools: ["Python", "Power BI", "Canva"],
    tags: ["Python", "BI"],
    problem:
      "Memprediksi delivery duration dan memahami faktor (distance, traffic, volume) untuk efisiensi logistik.",
    approach: [
      "EDA faktor-faktor yang memengaruhi durasi.",
      "Baseline model + evaluasi.",
      "Dashboard untuk memantau performa & insight.",
    ],
    insights: [
      "Faktor dominan terhadap durasi pengantaran dapat diidentifikasi.",
      "Model baseline membantu estimasi waktu pengantaran.",
    ],
    deliverables: ["Power BI dashboard", "Prediction baseline"],
    links: { caseStudy: "#", dashboard: "#", github: "#" },
  },
];

/* ========= ANIMATION PRESETS ========= */

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1 },
};

/* ========= COMPONENTS ========= */

function Badge({ children }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function PillButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm transition",
        active
          ? "bg-white text-zinc-950"
          : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, children, title }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-white/60">
                    Click outside / tekan ESC untuk tutup
                  </p>
                </div>
                <button
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
              <div className="mt-5">{children}</div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

/* ========= PAGE ========= */

export default function App() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filteredProjects = useMemo(() => {
    if (filter === "All") return PROJECTS;
    if (filter === "BI") return PROJECTS.filter((p) => p.tags.includes("BI"));
    return PROJECTS.filter((p) => p.tags.includes(filter));
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="border-b border-white/10 bg-slate-950/30 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold">{PROFILE.name}</div>
          <nav className="hidden gap-4 text-sm text-white/70 md:flex">
            <a className="hover:text-white" href="#projects">
              Projects
            </a>
            <a className="hover:text-white" href="#contact">
              Contact
            </a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14">
        {/* HERO */}
        <motion.header
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10"
        >
          <motion.p variants={fadeUp} className="text-sm text-white/70">
            {PROFILE.title} • {PROFILE.location}
          </motion.p>

          <div className="mt-4 grid items-center gap-10 md:grid-cols-2">
            <div>
              <motion.h1 variants={fadeUp} className="text-4xl font-bold tracking-tight">
                Hi, I’m {PROFILE.name}
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-3 text-white/80">
                Data analysis • dashboarding • storytelling
              </motion.p>

              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                <a
                  className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-950"
                  href={`mailto:${PROFILE.email}`}
                >
                  Email
                </a>
                <a
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm hover:bg-white/10"
                  href={PROFILE.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm hover:bg-white/10"
                  href={PROFILE.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm hover:bg-white/10"
                  href="/cv-dwi-amalia.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download CV
                </a>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="flex justify-center">
              <div className="relative">
                <img
                  src={PROFILE.photo}
                  alt={PROFILE.name}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="h-64 w-64 rounded-2xl border border-white/20 object-cover shadow-2xl"
                />
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-indigo-500/20 blur-2xl" />
              </div>
            </motion.div>
          </div>

          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        </motion.header>

        {/* PROJECTS */}
        <section id="projects" className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Projects</h2>
              <p className="mt-1 text-sm text-white/60">
                Filter per tool, klik card untuk detail case study (modal).
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {TOOL_GROUPS.map((t) => (
                <PillButton
                  key={t.key}
                  active={filter === t.key}
                  onClick={() => setFilter(t.key)}
                >
                  {t.label}
                </PillButton>
              ))}
            </div>
          </div>

          <motion.div
            className="mt-6 grid gap-5 md:grid-cols-2"
            initial={false}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p) => (
                <motion.button
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelected(p)}
                  className="text-left rounded-2xl border border-white/10 bg-white/5 p-6 hover:-translate-y-1 hover:border-white/20 hover:bg-white/7 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      <p className="mt-1 text-sm text-white/60">{p.time}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.tools.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-white/75">
                    <span className="font-semibold text-white/90">Problem:</span>{" "}
                    {p.problem}
                  </p>

                  <p className="mt-3 text-sm text-white/60">
                    Klik untuk lihat detail (Approach, Insight, Deliverables).
                  </p>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mt-14">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="mt-2 text-sm text-white/75">
              Untuk opportunity / kolaborasi: email atau link di bawah.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-950"
                href={`mailto:${PROFILE.email}`}
              >
                {PROFILE.email}
              </a>
              <a
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm hover:bg-white/10"
                href={PROFILE.links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm hover:bg-white/10"
                href={PROFILE.links.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {PROFILE.name} — React + Tailwind
        </footer>
      </div>

      {/* MODAL */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ""}
      >
        {selected ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-white/60">Time</p>
              <p className="mt-1 text-sm">{selected.time}</p>

              <p className="mt-4 text-sm text-white/60">Tools</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.tools.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>

              <p className="mt-5 text-sm text-white/60">Problem</p>
              <p className="mt-2 text-sm text-white/85">{selected.problem}</p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a className="underline underline-offset-4" href={selected.links.caseStudy} target="_blank" rel="noreferrer">
                  Case Study
                </a>
                <a className="underline underline-offset-4" href={selected.links.dashboard} target="_blank" rel="noreferrer">
                  Dashboard
                </a>
                <a className="underline underline-offset-4" href={selected.links.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Approach</p>
              <ul className="mt-2 space-y-2 text-sm text-white/80">
                {selected.approach.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>

              <p className="mt-5 text-sm font-semibold">Insights</p>
              <ul className="mt-2 space-y-2 text-sm text-white/80">
                {selected.insights.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>

              <p className="mt-5 text-sm font-semibold">Deliverables</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.deliverables.map((d) => (
                  <Badge key={d}>{d}</Badge>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
