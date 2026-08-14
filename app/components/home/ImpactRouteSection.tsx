import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/app/components/ui/Reveal';

export default function ImpactRouteSection() {
  return (
    <section style={{ width: '100%' }}>
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden">
        {/* 1. Franja decorativa superior */}
        <div style={{ height: '100px', background: '#e0caff' }} />

        {/* 2. Bloque título */}
        <Reveal
          variant="slide-right"
          style={{
            height: '320px',
            background: '#501f76',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            paddingRight: '24px',
          }}
        >
          <p
            style={{
              fontSize: '40px',
              color: '#ffffff',
              fontFamily: 'var(--font-roboto), Roboto, sans-serif',
              textAlign: 'end',
              height: '270px',
              width: '313px',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Descubre el camino <br />
            <strong style={{ fontWeight: 900 }}>SIGUE</strong> y elige tu track <br />
            <strong style={{ fontWeight: 900 }}>de impacto escalable</strong>
          </p>
        </Reveal>

        {/* 3. Imagen */}
        <Reveal variant="fade" style={{ width: '100%', height: '263px', position: 'relative' }}>
          <Image
            src="/images/home-impact-route.avif"
            alt="Camino SIGUE de impacto escalable"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </Reveal>

        {/* 4. Bloque texto introductorio */}
        <Reveal
          variant="slide-left"
          style={{
            minHeight: '436px',
            background: '#ef1451',
            padding: '32px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(18px, 5.9vw, 23px)',
              color: '#ffffff',
              fontFamily: 'var(--font-roboto), Roboto, sans-serif',
              margin: 0,
              textAlign: 'end',
              width: '100%',
              maxWidth: '336px',
              lineHeight: 1.35,
              fontWeight: 300,
            }}
          >
            Cada organización está en una etapa diferente de crecimiento. En{' '}
            <span style={{ fontWeight: 900 }}>SIGUE Network</span>, te ayudamos a identificar la
            mejor ruta para fortalecer y escalar tu impacto integral. A través de nuestra{' '}
            <span style={{ fontWeight: 900 }}>AUTOEVALUACIÓN-SIGUE SCALE-UP FRAMEWORK™</span>,
            podrás conocer en qué punto está tu proyecto y qué combinación de estrategias es ideal
            para ti.
          </p>
        </Reveal>

        {/* 5. Franja decorativa */}
        <div style={{ height: '70px', background: '#e0caff' }} />

        {/* 6. Franja "Sigue estos pasos" */}
        <div
          style={{
            height: '124px',
            background: '#7210f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <p
            style={{
              fontSize: '18px',
              color: '#ffffff',
              textAlign: 'end',
              fontFamily: 'var(--font-roboto), Roboto, sans-serif',
              margin: 0,
              lineHeight: 2.1,
            }}
          >
            Sigue estos pasos y <span style={{ fontWeight: 700 }}>encuentra la mejor ruta</span>{' '}
            para potenciar tu impacto:
          </p>
        </div>

        {/* 7. Franja decorativa */}
        <div style={{ height: '30px', background: '#e0caff' }} />

        {/* 8. PASO 1 */}
        <div style={{ height: '293px', background: '#ffffff', padding: '30px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '10px',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: '#7210f2',
                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                lineHeight: 1,
              }}
            >
              1.
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#7210F2',
                textAlign: 'right',
                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                lineHeight: 1,
              }}
            >
              Evalúa tu punto <br /> de partida
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              marginTop: '22px',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                color: '#501F76',
                textAlign: 'right',
                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                margin: 0,
                width: '296px',
                height: '145px',
                lineHeight: 1.85,
                fontWeight: 300,
              }}
            >
              Realiza la{' '}
              <span style={{ fontWeight: 900 }}>AUTOEVALUACIÓN-SIGUE SCALE-UP FRAMEWORK™</span> para
              identificar en qué fase se encuentra tu organización y qué recursos necesitas para
              escalar tu impacto.
            </p>
          </div>
        </div>

        {/* 9. Sección botón "COMPLETA" */}
        <div
          style={{
            height: '148px',
            background: '#e0caff',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '35px',
          }}
        >
          {/* FETCH_TODO: conectar con autoevaluación */}
          <Link
            href="#"
            style={{
              width: '270px',
              height: '60px',
              background: '#ef1451',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              padding: '20px 11px 20px 13px',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                maxWidth: '230px',
                color: '#ffffff',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                lineHeight: 1.15,
              }}
            >
              COMPLETA la autoevaluación y define tu ruta
            </span>
          </Link>
        </div>

        {/* 10. Franja "Conoce las opciones para avanzar" */}
        <div
          style={{
            height: '82px',
            background: '#7210f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            padding: '20px',
          }}
        >
          <p
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
              fontFamily: 'var(--font-roboto), Roboto, sans-serif',
              margin: 0,
            }}
          >
            Conoce las opciones para avanzar
          </p>
        </div>

        {/* 11. Franja decorativa */}
        <div style={{ height: '30px', background: '#e0caff' }} />

        {/* 12. PASO 2 */}
        <div style={{ height: '380px', background: '#ffffff', padding: '35px' }}>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#7210f2',
              fontFamily: 'var(--font-roboto), Roboto, sans-serif',
              lineHeight: 1,
            }}
          >
            2.
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'end',
              marginTop: '20px',
              padding: '10px',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                color: '#501F76',
                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                maxWidth: '297px',
                margin: 0,
                textAlign: 'end',
                lineHeight: 1.1,
              }}
            >
              {''} <span style={{ fontWeight: 900, color: '#7210f2' }}>Fase Inicial</span> →{' '}
              <span style={{ fontWeight: 900 }}>Certificación SIGUE en SIGUE ACADEMY</span>, para
              estructurar y fortalecer tu proyecto desde el inicio.
            </p>
            <p
              style={{
                fontSize: '16px',
                color: '#501F76',
                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                maxWidth: '297px',
                margin: 0,
                textAlign: 'end',
                lineHeight: 1.1,
              }}
            >
              {''} <span style={{ fontWeight: 900, color: '#7210f2' }}>Fase Intermedia</span> →{' '}
              <span style={{ fontWeight: 900 }}>SIGUE ACADEMY + SIGUE CONSULTING</span>, para
              mejorar sostenibilidad, estrategia y posicionamiento.
            </p>
            <p
              style={{
                fontSize: '16px',
                color: '#501F76',
                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                maxWidth: '297px',
                margin: 0,
                textAlign: 'end',
                lineHeight: 1.1,
              }}
            >
              {''} <span style={{ fontWeight: 900, color: '#7210f2' }}>Fase Avanzada</span> →{' '}
              <span style={{ fontWeight: 900 }}>
                SIGUE CONSULTING + módulos avanzados de SIGUE ACADEMY
              </span>
              , para escalar tu impacto.
            </p>
          </div>
        </div>

        {/* 13. Franja decorativa */}
        <div style={{ height: '45px', background: '#e0caff' }} />

        {/* 14. Franja "Avanza con la mejor combinación" */}
        <div
          style={{
            height: '124px',
            background: '#7210f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            padding: '24px',
          }}
        >
          <p
            style={{
              fontSize: '18px',
              color: '#ffffff',
              textAlign: 'end',
              fontFamily: 'var(--font-roboto), Roboto, sans-serif',
              margin: 0,
              fontWeight: 300,
              lineHeight: 2.2,
            }}
          >
            <span style={{ fontWeight: 900 }}>Avanza</span> <br />
            con la mejor combinación
          </p>
        </div>

        {/* 15. Franja decorativa */}
        <div style={{ height: '30px', background: '#e0caff' }} />

        {/* 16. PASO 3 */}
        <div style={{ height: '264px', background: '#ffffff', padding: '30px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '10px',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: '#7210f2',
                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                lineHeight: 1,
              }}
            >
              3.
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#7210F2',
                textAlign: 'right',
                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
              }}
            >
              Una vez que conoces tu punto
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              marginTop: '22px',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                color: '#501F76',
                textAlign: 'right',
                fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                margin: 0,
                maxWidth: '296px',
                fontWeight: 300,
                lineHeight: 1.75,
              }}
            >
              de partida y opciones,{' '}
              <span style={{ fontWeight: 900 }}>
                contáctanos para recibir orientación personalizada
              </span>{' '}
              y elegir la mejor estrategia según tu autoevaluación.
            </p>
          </div>
        </div>

        {/* 17. Sección botón "EMPIEZA" */}
        <div
          style={{
            height: '165px',
            background: '#e0caff',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '35px',
          }}
        >
          <Link
            href="/miembros-sigue"
            style={{
              width: '265px',
              height: '66px',
              background: '#ef1451',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#ffffff',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              EMPIEZA tu crecimiento con SIGUE
            </span>
          </Link>
        </div>

        {/* 18. Franja blanca inferior */}
        <div style={{ height: '140px', background: '#ffffff' }} />
      </div>

      {/* ===== DESKTOP LAYOUT (lg: 1024px+) ===== */}
      <div
        className="hidden lg:block"
        style={{ background: '#e0caff', width: '100% ', paddingTop: '100px' }}
      >
        {/* 2. Bloque título + imagen (dos columnas) */}
        <Reveal
          variant="fade"
          style={{
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {/* Columna izquierda */}
          <div style={{ flex: 1, flexShrink: 0 }}>
            {/* Fila 1 — recuadro decorativo */}
            <div style={{ height: '200px', background: '#7210f2', width: '100%' }} />
            {/* Fila 2 — imagen */}
            <div style={{ height: '300px', width: '100%', position: 'relative' }}>
              <Image
                src="/images/home-impact-route.avif"
                alt="Camino SIGUE de impacto escalable"
                fill
                style={{ objectFit: 'cover' }}
                sizes="339px"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div style={{ flex: 3.15, flexShrink: 0 }}>
            {/* Fila 1 — recuadro título */}
            <div
              style={{
                height: '200px',
                background: '#501f76',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                padding: '24px',
                position: 'relative',
              }}
            >
              {/* Cuadrado rojo decorativo */}
              <div
                style={{
                  position: 'absolute',
                  top: '78px',
                  right: '129px',
                  width: '100px',
                  height: '100px',
                  background: '#ef1451',
                }}
              />
              <p
                style={{
                  fontSize: '40px',
                  fontWeight: 400,
                  color: '#ffffff',
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  textAlign: 'end',
                  margin: 0,
                  lineHeight: 1.15,
                  paddingRight: '286px',
                }}
              >
                Descubre el camino <br /> <strong style={{ fontWeight: 900 }}>SIGUE</strong> y elige
                tu track <br /> <strong style={{ fontWeight: 900 }}>de impacto escalable</strong>
              </p>
            </div>
            {/* Fila 2 — recuadro texto introductorio */}
            <div
              style={{
                height: '300px',
                background: '#ef1451',
                display: 'flex',
                justifyContent: 'center',
                padding: '24px 24px 24px 127px',
                position: 'relative',
              }}
            >
              {/* Rectángulo blanco decorativo */}
              <div
                style={{
                  position: 'absolute',
                  top: '25px',
                  right: '129px',
                  width: '100px',
                  height: '253px',
                  background: '#ffffff',
                }}
              />
              <p
                style={{
                  fontSize: '26px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  margin: 0,
                  textAlign: 'end',
                  fontWeight: 300,
                  lineHeight: 1.25,
                  paddingRight: '286px',
                }}
              >
                Cada organización está en una etapa diferente de crecimiento. En{' '}
                <span style={{ fontWeight: 900 }}>SIGUE Network</span>, te ayudamos a identificar la
                mejor ruta para fortalecer y escalar tu impacto integral. A través de nuestra{' '}
                <span style={{ fontWeight: 900 }}>AUTOEVALUACIÓN-SIGUE SCALE-UP FRAMEWORK™</span>,
                podrás conocer en qué punto está tu proyecto y qué combinación de estrategias es
                ideal para ti.
              </p>
            </div>
          </div>
        </Reveal>

        {/* 3. Sección de pasos */}
        <div
          style={{
            width: 'calc(100% - 48px)',
            maxWidth: '830px',
            margin: '40px auto 0',
          }}
        >
          {/* Par 1 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '36px',
              alignItems: 'stretch',
              height: '309px',
            }}
          >
            {/* Columna izquierda */}
            <div
              style={{
                width: '280px',
                flexShrink: 0,
                background: '#7210f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
            >
              <p
                style={{
                  fontSize: '29px',
                  color: '#ffffff',
                  textAlign: 'end',
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                Sigue estos pasos y <span style={{ fontWeight: 900 }}>encuentra la mejor ruta</span>{' '}
                para potenciar tu impacto:
              </p>
            </div>
            {/* Columna derecha */}
            <div
              style={{
                width: '572px',
                flexShrink: 0,
                background: '#ffffff',
                padding: '24px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
              >
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 500,
                    color: '#7210f2',
                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                    lineHeight: 1,
                    paddingLeft: '20px',
                  }}
                >
                  1.
                </span>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#7210f2',
                    textAlign: 'right',
                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                    lineHeight: 1.1,
                    paddingRight: '20px',
                  }}
                >
                  Evalúa tu punto <br /> de partida
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  marginTop: '36px',
                  paddingRight: '10px',
                }}
              >
                <p
                  style={{
                    fontSize: '24px',
                    color: '#501F76',
                    textAlign: 'end',
                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                    margin: 0,
                    fontWeight: 300,
                    lineHeight: 1.25,
                    width: '450px',
                    height: '145px',
                  }}
                >
                  Realiza la{' '}
                  <span style={{ fontWeight: 900 }}>
                    AUTOEVALUACIÓN-SIGUE <br /> SCALE-UP FRAMEWORK™
                  </span>{' '}
                  para <br /> identificar en qué fase se encuentra tu organización y qué recursos
                  necesitas para escalar tu impacto.
                </p>
              </div>
            </div>
          </div>

          {/* Botón COMPLETA */}
          {/* FETCH_TODO: conectar con autoevaluación */}
          <Link
            href="#"
            style={{
              margin: '30px 96px 30px auto',
              display: 'flex',
              width: '270px',
              height: '62px',
              background: '#ef1451',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              textDecoration: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            COMPLETA la autoevaluación y define tu ruta
          </Link>

          {/* Par 2 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '36px',
              alignItems: 'stretch',
              height: '336px',
            }}
          >
            {/* Columna izquierda */}
            <div
              style={{
                width: '280px',
                flexShrink: 0,
                background: '#7210f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
            >
              <p
                style={{
                  fontSize: '29px',
                  fontWeight: 900,
                  color: '#ffffff',
                  textAlign: 'end',
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  margin: 0,
                }}
              >
                Conoce las opciones para avanzar
              </p>
            </div>
            {/* Columna derecha */}
            <div
              style={{
                width: '572px',
                flexShrink: 0,
                background: '#ffffff',
                padding: '30px 50px 30px 30px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  color: '#7210f2',
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  lineHeight: 1,
                }}
              >
                2.
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'start' }}>
                  <div
                    style={{
                      background: '#ef1451',
                      marginTop: '3px',
                      width: '20px',
                      height: '20px',
                      flexShrink: 0,
                      marginRight: '90px',
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: '18px',
                      color: '#501F76',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      lineHeight: 1.15,
                      textAlign: 'end',
                      fontWeight: 300,
                      marginRight: 0,
                    }}
                  >
                    <span style={{ fontWeight: 900, color: '#7210f2' }}>Fase Inicial</span> →{' '}
                    <span style={{ fontWeight: 900 }}>
                      Certificación SIGUE en
                      <br /> SIGUE ACADEMY
                    </span>
                    , para estructurar y <br /> fortalecer tu proyecto desde el inicio.
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      background: '#ef1451',
                      marginTop: '3px',
                      width: '20px',
                      height: '20px',
                      flexShrink: 0,
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: '18px',
                      color: '#501F76',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      margin: 0,
                      lineHeight: 1.15,
                      textAlign: 'end',
                      fontWeight: 300,
                    }}
                  >
                    <span style={{ fontWeight: 900, color: '#7210f2' }}>Fase Intermedia</span> →{' '}
                    <span style={{ fontWeight: 900 }}>
                      SIGUE ACADEMY +<br /> SIGUE CONSULTING
                    </span>
                    , para mejorar
                    <br /> sostenibilidad, estrategia y<br /> posicionamiento.
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      background: '#ef1451',
                      marginTop: '3px',
                      width: '20px',
                      height: '20px',
                      flexShrink: 0,
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: '18px',
                      color: '#501F76',
                      fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                      margin: 0,
                      lineHeight: 1.15,
                      textAlign: 'end',
                      fontWeight: 300,
                    }}
                  >
                    <span style={{ fontWeight: 900, color: '#7210f2' }}>Fase Avanzada</span> →{' '}
                    <span style={{ fontWeight: 900 }}>
                      SIGUE CONSULTING +<br /> módulos avanzados de SIGUE
                      <br /> ACADEMY
                    </span>
                    , para escalar tu impacto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Par 3 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '36px',
              alignItems: 'stretch',
              height: '280px',
              marginTop: '36px',
            }}
          >
            {/* Columna izquierda */}
            <div
              style={{
                width: '280px',
                flexShrink: 0,
                background: '#7210f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
            >
              <p
                style={{
                  fontSize: '29px',
                  color: '#ffffff',
                  textAlign: 'end',
                  fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                <span style={{ fontWeight: 900 }}>Avanza</span>
                <br />
                con la mejor combinación
              </p>
            </div>
            {/* Columna derecha */}
            <div
              style={{
                width: '572px',
                flexShrink: 0,
                background: '#ffffff',
                padding: '24px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
              >
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 500,
                    color: '#7210f2',
                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                    lineHeight: 1,
                    paddingLeft: '20px',
                  }}
                >
                  3.
                </span>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#7210f2',
                    textAlign: 'right',
                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                    lineHeight: 1,
                    paddingRight: '20px',
                  }}
                >
                  Una vez que
                  <br /> conoces tu punto
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  marginTop: '36px',
                  paddingRight: '10px',
                }}
              >
                <p
                  style={{
                    fontSize: '24px',
                    color: '#501F76',
                    textAlign: 'end',
                    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
                    margin: 0,
                    fontWeight: 300,
                    lineHeight: 1.25,
                  }}
                >
                  de partida y opciones,{' '}
                  <span style={{ fontWeight: 900 }}>
                    contáctanos
                    <br /> para recibir orientación
                    <br /> personalizada
                  </span>{' '}
                  y elegir la mejor
                  <br /> estrategia según tu autoevaluación.
                </p>
              </div>
            </div>
          </div>

          {/* Botón EMPIEZA */}
          <Link
            href="/miembros-sigue"
            style={{
              margin: '30px 96px 30px auto',
              display: 'flex',
              width: '265px',
              height: '66px',
              background: '#ef1451',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              textDecoration: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            EMPIEZA tu crecimiento con SIGUE
          </Link>
        </div>

        {/* 4. Franja blanca inferior */}
        <div style={{ height: '140px', background: '#ffffff' }} />
      </div>
    </section>
  );
}
