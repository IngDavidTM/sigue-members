"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function PowerIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E11D60"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}

function CheckIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="#E11D60">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L8.5 12.086l6.793-6.793a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconBox({ w = 52 }: { w?: number }) {
  return (
    <div
      style={{
        background: "#6A0DAD",
        width: w,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}
    >
      <PowerIcon />
    </div>
  );
}

function CheckBox({ size = 30 }: { size?: number }) {
  return (
    <div
      style={{
        background: "#fff",
        width: size + 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}
    >
      <CheckIcon size={size} />
    </div>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 80 52" width="76" height="52" fill="none">
      <path d="M4 26 H56" stroke="#E11D60" strokeWidth="10" strokeLinecap="round" />
      <path
        d="M44 8 L72 26 L44 44"
        stroke="#E11D60"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDownShort() {
  return (
    <svg viewBox="0 0 32 36" width="26" height="36" fill="none">
      <path d="M16 3 V22" stroke="#E11D60" strokeWidth="7" strokeLinecap="round" />
      <path
        d="M4 16 L16 32 L28 16"
        stroke="#E11D60"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown({ size = "md" }: { size?: "sm" | "md" }) {
  if (size === "sm") {
    return (
      <svg viewBox="0 0 26 38" width="20" height="38" fill="none">
        <path d="M13 3 V26" stroke="#E11D60" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M4 18 L13 34 L22 18"
          stroke="#E11D60"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 56" width="26" height="56" fill="none">
      <path d="M16 3 V38" stroke="#E11D60" strokeWidth="7" strokeLinecap="round" />
      <path
        d="M4 28 L16 50 L28 28"
        stroke="#E11D60"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function ConoceTeoriaDelCambioSection() {
  const t = useTranslations("conoceSiguePage.teoriaDelCambio");
  const { ref, inView } = useInView();

  const animClass = () =>
    `transition-all duration-700 ease-out ${
      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  const delay = (ms: number): React.CSSProperties => ({
    transitionDelay: inView ? `${ms}ms` : "0ms",
  });

  const desafioBg     = "#C4A0F0";
  const solucionBg    = "#9C6FD6";
  const impactoBg     = "#6A0DAD";
  const titleBoxBg    = "#3B0764";
  const cardDescBg    = "#8B5CF6";
  const cardDescColor = "#DDD6FE";

  const ICON_BOX_W  = 52;
  const CHECK_BOX_W = 58;

  const impactItems = [
    { title: t("impacto.item1Title"), desc: t("impacto.item1Desc") },
    { title: t("impacto.item2Title"), desc: t("impacto.item2Desc") },
    { title: t("impacto.item3Title"), desc: t("impacto.item3Desc") },
  ];

  const desafioItems = [
    { light: t("desafio.item1Light"), bold: t("desafio.item1Bold") },
    { light: t("desafio.item2Light"), bold: t("desafio.item2Bold") },
    { light: t("desafio.item3Light"), bold: t("desafio.item3Bold") },
  ];

  return (
    <section className="w-full font-sans">

      <div className="relative w-full overflow-hidden">

        {/* MOBILE */}
        <div
          className="flex lg:hidden items-center justify-start min-h-[160px] px-8"
          style={{ background: "linear-gradient(90deg, #5D17EB 0%, #7B2FF7 100%)" }}
        >
          <div>
            <p
              className="text-white font-bold tracking-wide"
              style={{ fontSize: "clamp(16px, 4vw, 22px)" }}
            >
              {t("banner.nuestra")}
            </p>
            <p
              className="text-white font-bold tracking-tight leading-tight"
              style={{ fontSize: "clamp(24px, 6vw, 34px)" }}
            >
              {t("banner.title")}
            </p>
          </div>
        </div>

        {/* DESKTOP */}
        <div
          className="hidden lg:flex items-stretch min-h-[260px]"
          style={{ background: "linear-gradient(135deg, #3a1060 0%, #502076 50%, #5D17EB 100%)" }}
        >
          <div className="self-center flex-shrink-0" style={{ width: "30%", margin: "2rem 0" }}>
            <div className="h-44 w-full" style={{ background: "#EF1351" }} />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white shadow-xl" style={{ width: 160, height: 160 }} />
          </div>
          <div
            className="flex flex-col justify-center items-start pl-6 pr-10 flex-shrink-0"
            style={{
              width: "42%",
              background: "linear-gradient(90deg, #5D17EB 0%, #7B2FF7 100%)",
            }}
          >
            <p className="text-white text-3xl font-bold tracking-wide">
              {t("banner.nuestra")}
            </p>
            <p className="text-white text-4xl font-bold tracking-tight leading-tight">
              {t("banner.title")}
            </p>
          </div>
        </div>
      </div>

      <div ref={ref} className="w-full bg-white py-10 px-1 lg:px-2">
        <div className="w-full overflow-hidden" style={{ borderRadius: 6 }}>

          {/* ════════════════════ DESKTOP ════════════════════ */}
          <div className="hidden lg:block">

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>

              {/* Desafío header */}
              <div
                className={animClass()}
                style={{
                  background: desafioBg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: "18px 16px 20px 16px",
                  minHeight: 180,
                  ...delay(0),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 110, height: 110, background: "#E11D60", flexShrink: 0 }} />
                  <div>
                    <h2
                      className="font-black"
                      style={{ fontSize: 42, color: "#3B0764", lineHeight: 1 }}
                    >
                      {t("desafio.title")}
                    </h2>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#4C1D95", lineHeight: 1.2, marginTop: 4 }}>
                      {t("desafio.subtitle")}{" "}
                      <span style={{ color: "#E11D60", fontWeight: 900 }}>+</span>
                      <br />
                      {t("desafio.subtitleEnd")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Solución header */}
              <div
                className={animClass()}
                style={{
                  background: solucionBg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  padding: "0 0 20px 0",
                  minHeight: 180,
                  position: "relative",
                  overflow: "visible",
                  ...delay(160),
                }}
              >
                <div
                  className={animClass()}
                  style={{
                    position: "absolute",
                    left: -76,
                    top: 0,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                    zIndex: 5,
                    ...delay(80),
                  }}
                >
                  <ArrowRight />
                </div>
                <div style={{
                  background: titleBoxBg,
                  padding: "8px 22px 8px 16px",
                  width: "70%",
                  marginBottom: 8,
                  textAlign: "right",
                }}>
                  <h2 className="font-black" style={{ fontSize: 42, lineHeight: 1, color: "#fff" }}>
                    {t("solucion.title")}
                  </h2>
                </div>
                <p style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: titleBoxBg,
                  margin: 0,
                  width: "100%",
                  textAlign: "center",
                }}>
                  {t("solucion.subtitle")}{" "}
                  <span style={{ color: "#E11D60", fontWeight: 900 }}>+</span>{" "}
                  {t("solucion.subtitleEnd")}
                </p>
              </div>

              {/* Impacto header */}
              <div
                className={animClass()}
                style={{
                  background: impactoBg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  padding: "0 0 10px 0",
                  minHeight: 180,
                  position: "relative",
                  overflow: "visible",
                  ...delay(320),
                }}
              >

                <div
                  className={animClass()}
                  style={{
                    position: "absolute",
                    left: -76,
                    top: 0,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                    zIndex: 5,
                    ...delay(240),
                  }}
                >
                  <ArrowRight />
                </div>
                <div style={{
                  background: titleBoxBg,
                  padding: "8px 22px 8px 16px",
                  width: "70%",
                  textAlign: "right",
                }}>
                  <h2 className="font-black" style={{ fontSize: 42, lineHeight: 1, color: "#fff" }}>
                    {t("impacto.title")}
                  </h2>
                </div>
              </div>

            </div>

            {/* ── BODY ROW ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>

              {/* Desafío body */}
              <div
                className={animClass()}
                style={{
                  background: desafioBg,
                  padding: "10px 16px 28px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  ...delay(100),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ background: "#fff", width: 80, height: 460, flexShrink: 0 }} />
                  <div
                    style={{
                      background: "#8B5CF6",
                      width: 220,
                      height: 400,
                      padding: "20px 20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 18,
                      flexShrink: 0,
                    }}
                  >
                    {desafioItems.map(({ light, bold }) => (
                      <p key={bold} style={{ fontSize: 22, lineHeight: 1.3, margin: 0 }}>
                        <span style={{ color: "#DDD6FE", fontWeight: 700 }}>{light}</span>
                        <strong style={{ fontWeight: 900, color: "#fff" }}>{bold}</strong>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Solución body */}
              <div
                className={animClass()}
                style={{
                  background: solucionBg,
                  padding: "8px 18px 20px 18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  ...delay(260),
                }}
              >

                <div style={{ width: "100%", maxWidth: 340, display: "flex" }}>
                  <div style={{ width: ICON_BOX_W, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowDownShort />
                  </div>
                  <div style={{ flex: 1 }} />
                </div>

                {/* Card: conectar */}
                <div style={{ background: titleBoxBg, borderRadius: 4, overflow: "hidden", width: "100%", maxWidth: 340 }}>
                  <div style={{ display: "flex", alignItems: "stretch", minHeight: 60 }}>
                    <IconBox w={ICON_BOX_W} />
                    <div style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 14px",
                    }}>
                      <span style={{ color: "#fff", fontSize: 30, fontWeight: 900 }}>
                        {t("solucion.conectarTitle")}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    background: cardDescBg,
                    padding: "12px 18px",
                    fontSize: 18,
                    color: cardDescColor,
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}>
                    {t("solucion.conectarDesc")}
                  </div>
                </div>

                <p style={{
                  textAlign: "center",
                  color: "#E11D60",
                  fontSize: 32,
                  fontWeight: 900,
                  lineHeight: 1,
                  margin: 0,
                  width: "100%",
                  maxWidth: 340,
                }}>
                  +
                </p>

                <div style={{ width: "100%", maxWidth: 340, display: "flex" }}>
                  <div style={{ width: ICON_BOX_W, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowDownShort />
                  </div>
                  <div style={{ flex: 1 }} />
                </div>

                {/* Card: potenciar */}
                <div style={{ background: titleBoxBg, borderRadius: 4, overflow: "hidden", width: "100%", maxWidth: 340 }}>
                  <div style={{ display: "flex", alignItems: "stretch", minHeight: 60 }}>
                    <IconBox w={ICON_BOX_W} />
                    <div style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 14px",
                    }}>
                      <span style={{ color: "#fff", fontSize: 30, fontWeight: 900 }}>
                        {t("solucion.potenciarTitle")}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    background: cardDescBg,
                    padding: "12px 18px",
                    fontSize: 18,
                    color: cardDescColor,
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}>
                    {t("solucion.potenciarDesc")}
                  </div>
                </div>
              </div>

              {/* Impacto body */}
              <div
                className={animClass()}
                style={{
                  background: impactoBg,
                  padding: "8px 18px 20px 18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 8,
                  ...delay(420),
                }}
              >
                <div style={{ width: "100%", maxWidth: 340, display: "flex" }}>
                  <div style={{ flex: 1 }} />
                  <div style={{ width: CHECK_BOX_W, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowDownShort />
                  </div>
                </div>

                {impactItems.map(({ title, desc }, i) => (
                  <div key={title} style={{ width: "100%", maxWidth: 340 }}>
                    <div style={{ background: titleBoxBg, borderRadius: 4, overflow: "hidden", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "stretch", minHeight: 60 }}>
                        <div style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px 14px",
                        }}>
                          <span style={{ color: "#fff", fontSize: 26, fontWeight: 900, textAlign: "center" }}>
                            {title}
                          </span>
                        </div>
                        <CheckBox size={30} />
                      </div>
                      <div style={{
                        background: cardDescBg,
                        padding: "12px 18px",
                        fontSize: 18,
                        color: cardDescColor,
                        lineHeight: 1.5,
                        textAlign: "center",
                      }}>
                        {desc}
                      </div>
                    </div>

                    {i < 2 && (
                      <div style={{ display: "flex", margin: "4px 0" }}>
                        <div style={{ flex: 1 }} />
                        <div style={{ width: CHECK_BOX_W, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                          <ArrowDownShort />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ════════════════════ MOBILE ════════════════════ */}
          <div className="flex flex-col lg:hidden">

            {/* ── Desafío ── */}
            <div
              className={`transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={delay(0)}
            >
              <div style={{
                background: desafioBg,
                padding: "16px 14px 12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                minHeight: 90,
              }}>
                <div style={{ width: 56, height: 56, background: "#E11D60", borderRadius: 4, flexShrink: 0 }} />
                <div>
                  <h2 style={{ fontSize: "clamp(24px, 7vw, 32px)", fontWeight: 900, color: "#3B0764", lineHeight: 1 }}>
                    {t("desafio.title")}
                  </h2>
                  <p style={{ fontSize: "clamp(13px, 3.5vw, 16px)", fontWeight: 700, color: "#4C1D95", lineHeight: 1.2, marginTop: 3 }}>
                    {t("desafio.subtitle")}{" "}
                    <span style={{ color: "#E11D60" }}>+</span>
                    <br />
                    {t("desafio.subtitleEnd")}
                  </p>
                </div>
                <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                  <ArrowDown size="sm" />
                </div>
              </div>

              <div style={{
                background: desafioBg,
                padding: "8px 14px 22px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}>
                <div style={{ display: "flex", alignItems: "stretch", justifyContent: "flex-end", width: "100%" }}>
                  <div style={{ background: "#fff", width: 44, flexShrink: 0 }} />
                  <div style={{
                    background: "#8B5CF6",
                    flex: 1,
                    padding: "14px 14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 12,
                    minHeight: 120,
                  }}>
                    {desafioItems.map(({ light, bold }) => (
                      <p key={bold} style={{ fontSize: "clamp(16px, 4.5vw, 20px)", margin: 0 }}>
                        <span style={{ color: "#DDD6FE", fontWeight: 700 }}>{light}</span>
                        <strong style={{ color: "#fff", fontWeight: 900 }}>{bold}</strong>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", padding: "6px 0", background: desafioBg }}>
              <ArrowDown />
            </div>

            {/* ── Solución ── */}
            <div
              className={`transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={delay(150)}
            >
              <div style={{ background: solucionBg, paddingBottom: 10, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ background: titleBoxBg, padding: "10px 22px 10px 14px", width: "70%", marginBottom: 4, textAlign: "right" }}>
                  <h2 style={{ fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 900, color: "#fff", lineHeight: 1, margin: 0 }}>
                    {t("solucion.title")}
                  </h2>
                </div>
                <p style={{ fontSize: "clamp(13px, 3.5vw, 15px)", fontWeight: 700, color: titleBoxBg, margin: 0, width: "100%", textAlign: "center", paddingBottom: 4 }}>
                  {t("solucion.subtitle")}{" "}
                  <span style={{ color: "#E11D60", fontWeight: 900 }}>+</span>{" "}
                  {t("solucion.subtitleEnd")}
                </p>
              </div>

              <div style={{ background: solucionBg, padding: "6px 14px 14px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>

                <div style={{ width: "100%", display: "flex" }}>
                  <div style={{ width: 44, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowDown size="sm" />
                  </div>
                  <div style={{ flex: 1 }} />
                </div>

                {/* Card conectar */}
                <div style={{ background: titleBoxBg, borderRadius: 4, overflow: "hidden", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "stretch", minHeight: 50 }}>
                    <div style={{ background: impactoBg, width: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PowerIcon />
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 12px" }}>
                      <span style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(20px, 5.5vw, 26px)" }}>
                        {t("solucion.conectarTitle")}
                      </span>
                    </div>
                  </div>
                  <div style={{ background: cardDescBg, padding: "10px 14px", fontSize: "clamp(15px, 4vw, 18px)", color: cardDescColor, lineHeight: 1.5, textAlign: "center" }}>
                    {t("solucion.conectarDesc")}
                  </div>
                </div>

                <p style={{ textAlign: "center", color: "#E11D60", fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 900, lineHeight: 1, margin: 0, width: "100%" }}>
                  +
                </p>

                <div style={{ width: "100%", display: "flex" }}>
                  <div style={{ width: 44, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowDown size="sm" />
                  </div>
                  <div style={{ flex: 1 }} />
                </div>

                {/* Card potenciar */}
                <div style={{ background: titleBoxBg, borderRadius: 4, overflow: "hidden", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "stretch", minHeight: 50 }}>
                    <div style={{ background: impactoBg, width: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <PowerIcon />
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 12px" }}>
                      <span style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(20px, 5.5vw, 26px)" }}>
                        {t("solucion.potenciarTitle")}
                      </span>
                    </div>
                  </div>
                  <div style={{ background: cardDescBg, padding: "10px 14px", fontSize: "clamp(15px, 4vw, 18px)", color: cardDescColor, lineHeight: 1.5, textAlign: "center" }}>
                    {t("solucion.potenciarDesc")}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", padding: "6px 0", background: solucionBg }}>
              <ArrowDown />
            </div>

            {/* ── Impacto ── */}
            <div
              className={`transition-all duration-700 ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={delay(300)}
            >
              <div style={{ background: impactoBg, paddingTop: 8, paddingBottom: 8, display: "flex", alignItems: "flex-start" }}>
                <div style={{ display: "inline-block", background: titleBoxBg, padding: "10px 22px 10px 14px", width: "70%", textAlign: "right" }}>
                  <h2 style={{ fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 900, color: "#fff", lineHeight: 1, margin: 0 }}>
                    {t("impacto.title")}
                  </h2>
                </div>
              </div>

              <div style={{
                background: impactoBg,
                padding: "6px 14px 14px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}>

                <div style={{ width: "100%", display: "flex" }}>
                  <div style={{ flex: 1 }} />
                  <div style={{ width: 52, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowDown size="sm" />
                  </div>
                </div>

                {impactItems.map(({ title, desc }, i) => (
                  <div key={title} style={{ width: "100%" }}>
                    <div style={{ background: titleBoxBg, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "stretch", minHeight: 50 }}>
                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 12px" }}>
                          <span style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(18px, 5vw, 22px)", textAlign: "center" }}>
                            {title}
                          </span>
                        </div>
                        <div style={{ background: "#fff", width: 52, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <CheckIcon size={28} />
                        </div>
                      </div>
                      <div style={{ background: cardDescBg, padding: "10px 14px", fontSize: "clamp(15px, 4vw, 18px)", color: cardDescColor, lineHeight: 1.5, textAlign: "center" }}>
                        {desc}
                      </div>
                    </div>
                    {i < 2 && (
                      <div style={{ display: "flex", margin: "4px 0" }}>
                        <div style={{ flex: 1 }} />
                        <div style={{ width: 52, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                          <ArrowDown size="sm" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            TODO: cuando exista la página /sigue-tracks, envolver
            este botón en un <Link href="/sigue-tracks"> de
            next/link para que el CTA navegue a esa página.
        ══════════════════════════════════════════════════════ */}
        <div className="flex justify-center pt-8 pb-2">
          <button
            className="text-center px-5 py-3 font-bold"
            style={{ background: "#501F76", maxWidth: 300, borderRadius: 4 }}
          >
            <span
              className="text-white font-black uppercase tracking-widest block leading-tight"
              style={{ fontSize: "clamp(16px, 4vw, 20px)" }}
            >
              {t("cta.label")}
            </span>
            <span
              className="text-white font-bold normal-case tracking-normal block leading-tight"
              style={{ fontSize: "clamp(11px, 2.8vw, 14px)" }}
            >
              {t("cta.sub")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
