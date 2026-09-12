'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Reveal from '@/app/components/ui/Reveal';

// FETCH_TODO: Sustituir mock por llamada a endpoint de WP-API /events
import eventsData from '@/app/mocks/events.json';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  registerUrl: string;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);

const SCROLLBAR_COLOR = '#3a395c rgba(58,57,92,0.25)';
const BORDER = '1px solid rgba(100,80,200,0.15)';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getThisSundayOf(d: Date): Date {
  const s = new Date(d);
  s.setDate(d.getDate() - d.getDay());
  s.setHours(0, 0, 0, 0);
  return s;
}

interface WeekAgendaProps {
  weekDays: { day: number; month: number; year: number; dateKey: string }[];
  todayKey: string;
  eventsByDate: Record<string, Event[]>;
  fontSize: string;
  hourLabelW: number;
  rowH: number;
  allDayLabel: string;
}

function WeekAgenda({
  weekDays,
  todayKey,
  eventsByDate,
  fontSize,
  hourLabelW,
  rowH,
  allDayLabel,
}: WeekAgendaProps) {
  const colW = `calc((100% - ${hourLabelW}px) / 7)`;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', background: '#B9BEFA' }}>
      <div
        style={{
          display: 'flex',
          borderBottom: BORDER,
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          background: '#B9BEFA',
          zIndex: 2,
        }}
      >
        <div style={{ width: hourLabelW, flexShrink: 0 }} />
        {weekDays.map((cell, i) => {
          const isToday = cell.dateKey === todayKey;
          return (
            <div
              key={i}
              style={{
                width: colW,
                flexShrink: 0,
                textAlign: 'center',
                borderLeft: BORDER,
                padding: '2px 0',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize,
                  color: '#EF1351',
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {DAYS_OF_WEEK[i]}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  fontSize,
                  color: isToday ? '#fff' : '#3a395c',
                  fontWeight: isToday ? 700 : 500,
                  background: isToday ? '#EF1351' : 'transparent',
                  borderRadius: 3,
                  padding: '0 2px',
                  lineHeight: '1.4em',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {cell.month + 1}/{cell.day}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', borderBottom: BORDER, flexShrink: 0, minHeight: rowH }}>
        <div
          style={{
            width: hourLabelW,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{ fontSize: `calc(${fontSize} * 0.85)`, color: '#6b5b8e', whiteSpace: 'nowrap' }}
          >
            {allDayLabel}
          </span>
        </div>
        {weekDays.map((cell, i) => {
          const isToday = cell.dateKey === todayKey;
          const events = eventsByDate[cell.dateKey] ?? [];
          return (
            <div
              key={i}
              style={{
                width: colW,
                flexShrink: 0,
                borderLeft: BORDER,
                background: isToday ? 'rgba(150,130,230,0.22)' : 'transparent',
                padding: '1px 2px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {events.map((ev) => (
                <span
                  key={ev.id}
                  title={ev.title}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: '#EF1351',
                    color: '#fff',
                    fontSize,
                    padding: '1px 3px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    borderRadius: 2,
                  }}
                >
                  {ev.title}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: SCROLLBAR_COLOR }}>
        {HOURS.map((h) => (
          <div key={h} style={{ display: 'flex', borderBottom: BORDER, minHeight: rowH }}>
            <div
              style={{
                width: hourLabelW,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                paddingRight: 3,
                paddingTop: 1,
              }}
            >
              <span
                style={{
                  fontSize: `calc(${fontSize} * 0.85)`,
                  color: '#6b5b8e',
                  whiteSpace: 'nowrap',
                }}
              >
                {h <= 12 ? `${h}am` : `${h - 12}pm`}
              </span>
            </div>
            {weekDays.map((cell, i) => (
              <div
                key={i}
                style={{
                  width: colW,
                  flexShrink: 0,
                  borderLeft: BORDER,
                  background: cell.dateKey === todayKey ? 'rgba(150,130,230,0.12)' : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ref]);

  return width;
}

function useCalendarState() {
  const today = new Date();
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getThisSundayOf(today));

  const prevPeriod = () => {
    if (viewMode === 'week') {
      setCurrentWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 7);
        return d;
      });
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else setCurrentMonth((m) => m - 1);
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'week') {
      setCurrentWeekStart((prev) => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 7);
        return d;
      });
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setCurrentWeekStart(getThisSundayOf(today));
  };

  const getWeekDays = () =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      return {
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        dateKey: formatDateKey(d.getFullYear(), d.getMonth(), d.getDate()),
      };
    });

  const getToolbarTitle = () => {
    if (viewMode === 'month') return `${MONTH_NAMES[currentMonth]} ${currentYear}`;
    const days = getWeekDays();
    const first = days[0];
    const last = days[6];
    const fLabel = `${MONTH_NAMES[first.month].slice(0, 3)} ${first.day}`;
    if (first.year !== last.year)
      return `${fLabel}, ${first.year} \u2013 ${MONTH_NAMES[last.month].slice(0, 3)} ${last.day}, ${last.year}`;
    if (first.month !== last.month)
      return `${fLabel} \u2013 ${MONTH_NAMES[last.month].slice(0, 3)} ${last.day}, ${last.year}`;
    return `${fLabel} \u2013 ${last.day}, ${last.year}`;
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const numRows = Math.ceil((firstDay + daysInMonth) / 7);
  const totalCells = numRows * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNumber = i - firstDay + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return { day: null, dateKey: null };
    return { day: dayNumber, dateKey: formatDateKey(currentYear, currentMonth, dayNumber) };
  });

  return {
    today,
    viewMode,
    setViewMode,
    currentYear,
    currentMonth,
    prevPeriod,
    nextPeriod,
    goToToday,
    getWeekDays,
    getToolbarTitle,
    daysInMonth,
    firstDay,
    numRows,
    cells,
  };
}

interface CalendarGridProps {
  viewMode: 'month' | 'week';
  cells: { day: number | null; dateKey: string | null }[];
  numRows: number;
  cellSize: number;
  todayKey: string;
  eventsByDate: Record<string, Event[]>;
  weekDays: ReturnType<ReturnType<typeof useCalendarState>['getWeekDays']>;
  fontSize: string;
  weekFontSize: string;
  weekHourLabelW: number;
  weekRowH: number;
  maxRows?: number;
  allDayLabel: string;
}

function CalendarGrid({
  viewMode,
  cells,
  numRows,
  cellSize,
  todayKey,
  eventsByDate,
  weekDays,
  fontSize,
  weekFontSize,
  weekHourLabelW,
  weekRowH,
  maxRows = 5,
  allDayLabel,
}: CalendarGridProps) {
  const gridH = cellSize * maxRows;

  return (
    <div
      style={{
        height: cellSize ? `${gridH}px` : 'auto',
        overflowY: 'auto',
        flexShrink: 0,
        scrollbarWidth: 'thin',
        scrollbarColor: SCROLLBAR_COLOR,
      }}
    >
      {viewMode === 'month' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(7, ${cellSize}px)`,
            gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
          }}
        >
          {cells.map((cell, idx) => {
            const isToday = cell.dateKey === todayKey;
            const events = cell.dateKey ? (eventsByDate[cell.dateKey] ?? []) : [];
            const hasEvent = events.length > 0;
            return (
              <div
                key={idx}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderTop: BORDER,
                  borderLeft: BORDER,
                  background: isToday ? 'rgba(150,130,230,0.30)' : 'transparent',
                  overflow: 'hidden',
                }}
              >
                {cell.day !== null && (
                  <>
                    <span
                      style={{
                        display: 'block',
                        textAlign: 'right',
                        paddingRight: 4,
                        paddingTop: 2,
                        color: hasEvent ? '#EF1351' : '#6b5b8e',
                        fontWeight: isToday ? 700 : 400,
                        fontSize,
                      }}
                    >
                      {cell.day}
                    </span>
                    <div
                      style={{
                        padding: '0 2px 2px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      {events.slice(0, 1).map((ev) => (
                        <span
                          key={ev.id}
                          title={ev.title}
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            background: '#EF1351',
                            color: '#fff',
                            fontSize,
                            padding: '1px 4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            borderRadius: 3,
                          }}
                        >
                          {ev.title}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
      {viewMode === 'week' && (
        <WeekAgenda
          weekDays={weekDays}
          todayKey={todayKey}
          eventsByDate={eventsByDate}
          fontSize={weekFontSize}
          hourLabelW={weekHourLabelW}
          rowH={weekRowH}
          allDayLabel={allDayLabel}
        />
      )}
    </div>
  );
}

interface CalendarToolbarProps {
  toolbarTitle: string;
  viewMode: 'month' | 'week';
  setViewMode: (m: 'month' | 'week') => void;
  prevPeriod: () => void;
  nextPeriod: () => void;
  goToToday: () => void;
  compact?: boolean;
  todayLabel: string;
  monthLabel: string;
  weekLabel: string;
}

function CalendarToolbar({
  toolbarTitle,
  viewMode,
  setViewMode,
  prevPeriod,
  nextPeriod,
  goToToday,
  compact = false,
  todayLabel,
  monthLabel,
  weekLabel,
}: CalendarToolbarProps) {
  const btnH = compact ? 28 : 'clamp(28px,3.2vw,36px)';
  const btnW = compact ? 30 : 'clamp(30px,3.5vw,38px)';
  const titleSize = compact ? 'clamp(0.72rem, 2vw, 1rem)' : 'clamp(0.82rem,1.8vw,1.2rem)';
  const modeSize = compact ? '0.65rem' : 'clamp(0.62rem,1.2vw,0.80rem)';
  const todaySize = compact ? '0.7rem' : 'clamp(0.68rem,1.3vw,0.85rem)';
  const padding = compact ? '4px 8px 4px 8px' : 'clamp(12px,2vw,16px) clamp(12px,2vw,20px)';

  const modeLabels: Record<'month' | 'week', string> = {
    month: monthLabel,
    week: weekLabel,
  };

  return (
    <div className="flex flex-wrap items-center gap-1" style={{ padding, flexShrink: 0 }}>
      <div className="flex overflow-hidden" style={{ flexShrink: 0, borderRadius: 6 }}>
        <button
          onClick={prevPeriod}
          aria-label="Período anterior"
          className="flex items-center justify-center text-white font-bold hover:opacity-80"
          style={{ background: '#3a395c', width: btnW, height: btnH, fontSize: '1.1rem' }}
        >
          ‹
        </button>
        <button
          onClick={nextPeriod}
          aria-label="Período siguiente"
          className="flex items-center justify-center text-white font-bold hover:opacity-80"
          style={{
            background: '#3a395c',
            width: btnW,
            height: btnH,
            fontSize: '1.1rem',
            borderLeft: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          ›
        </button>
      </div>
      <button
        onClick={goToToday}
        className="px-2 font-semibold hover:opacity-90"
        style={{
          background: 'rgba(58,57,92,0.25)',
          color: '#3a395c',
          fontSize: todaySize,
          flexShrink: 0,
          height: btnH,
          borderRadius: 6,
        }}
      >
        {todayLabel}
      </button>
      <span
        className="flex-1 text-center font-bold"
        style={{
          fontFamily: 'var(--font-heading, Roboto, sans-serif)',
          fontSize: titleSize,
          color: '#1a0e3a',
          lineHeight: 1.15,
        }}
      >
        {toolbarTitle}
      </span>
      <div className="flex overflow-hidden" style={{ flexShrink: 0, borderRadius: 6 }}>
        {(['month', 'week'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className="font-semibold transition-colors"
            style={{
              background: viewMode === mode ? '#3a395c' : 'rgba(58,57,92,0.25)',
              color: viewMode === mode ? '#fff' : '#3a395c',
              padding: compact ? '4px 10px' : `6px clamp(8px,1.5vw,16px)`,
              fontSize: modeSize,
              borderLeft: mode === 'week' ? '1px solid rgba(255,255,255,0.15)' : 'none',
            }}
          >
            {modeLabels[mode]}
          </button>
        ))}
      </div>
    </div>
  );
}

interface RegisterButtonProps {
  onClick: () => void;
  compact?: boolean;
  label: string;
  subLabel: string;
}

function RegisterButton({ onClick, compact = false, label, subLabel }: RegisterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="font-extrabold uppercase text-white transition-transform hover:scale-105 active:scale-95"
      style={{
        background: '#EF1351',
        borderRadius: '4px',
        padding: compact
          ? 'clamp(10px, 1.6vw, 14px) clamp(28px, 5vw, 48px)'
          : 'clamp(10px,1.3vw,16px) clamp(18px,2.5vw,32px)',
        fontFamily: 'var(--font-heading, Roboto, sans-serif)',
        fontSize: compact ? 'clamp(0.95rem, 2.2vw, 1.1rem)' : 'clamp(0.9rem,1.55vw,1.15rem)',
        lineHeight: 1,
        letterSpacing: '0.1em',
        boxShadow: '0 4px 24px rgba(239,19,81,0.5)',
        textAlign: 'center',
      }}
    >
      {label}
      <br />
      <span
        style={{
          fontWeight: 700,
          fontSize: compact ? 'clamp(0.72rem, 1.4vw, 0.85rem)' : 'clamp(0.68rem, 1vw, 0.88rem)',
          letterSpacing: '0.02em',
          lineHeight: 1,
          display: 'block',
          textTransform: 'none',
        }}
      >
        {subLabel}
      </span>
    </button>
  );
}

export default function EventsCalendar() {
  const t = useTranslations('events');

  // FETCH_TODO: Sustituir mock por llamada a endpoint de WP-API /events
  const eventsByDate: Record<string, Event[]> = {};
  (eventsData as Event[]).forEach((event) => {
    if (!eventsByDate[event.date]) eventsByDate[event.date] = [];
    eventsByDate[event.date].push(event);
  });

  const cal = useCalendarState();
  const todayKey = formatDateKey(
    cal.today.getFullYear(),
    cal.today.getMonth(),
    cal.today.getDate()
  );
  const weekDays = cal.getWeekDays();
  const toolbarTitle = cal.getToolbarTitle();

  const mobileWrapperRef = useRef<HTMLDivElement>(null);
  const desktopCalRef = useRef<HTMLDivElement>(null);

  const mobileWidth = useContainerWidth(mobileWrapperRef);
  const desktopWidth = useContainerWidth(desktopCalRef);

  const MAX_ROWS = 5;
  const mobileCellSize = mobileWidth ? Math.floor(mobileWidth / 7) : 0;
  const desktopCellSize = desktopWidth ? Math.floor(desktopWidth / 7) : 0;

  const handleRegisterButton = () => {
    // FETCH_TODO: Sustituir mock por llamada a endpoint de WP-API /events
    // Acción: abrir modal o link externo al próximo evento
  };

  const OVERHANG = 'clamp(60px, 7.5vw, 100px)';
  const CAL_MARGIN = 'clamp(20px, 3.5vw, 44px)';

  const sharedToolbarProps = {
    toolbarTitle,
    viewMode: cal.viewMode,
    setViewMode: cal.setViewMode,
    prevPeriod: cal.prevPeriod,
    nextPeriod: cal.nextPeriod,
    goToToday: cal.goToToday,
    todayLabel: t('today'),
    monthLabel: t('month'),
    weekLabel: t('week'),
  };

  const sharedGridProps = {
    viewMode: cal.viewMode,
    cells: cal.cells,
    numRows: cal.numRows,
    todayKey,
    eventsByDate,
    weekDays,
    maxRows: MAX_ROWS,
    allDayLabel: t('allDay'),
  };

  const registerProps = {
    onClick: handleRegisterButton,
    label: t('registerBtn'),
    subLabel: t('registerBtnSub'),
  };

  return (
    <>
      <Reveal variant="slide-left" amount={0.08}>
        <section className="w-full overflow-hidden">
          <div className="flex flex-col lg:hidden">
            <div
              className="flex items-center justify-center w-full"
              style={{ background: '#7210F2', padding: 'clamp(10px,2vw,20px) 0' }}
            >
              <div className="text-center w-full px-3">
                <h2
                  className="text-white font-extrabold"
                  style={{
                    fontFamily: 'var(--font-heading, Roboto, sans-serif)',
                    fontSize: 'clamp(2rem, 9vw, 3.2rem)',
                    lineHeight: 0.82,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t('heading')}
                  <br />
                  {t('headingLine2')}
                </h2>
                <p
                  className="text-white font-extrabold"
                  style={{
                    fontFamily: 'var(--font-heading, Roboto, sans-serif)',
                    fontSize: 'clamp(1.4rem, 6.5vw, 2.2rem)',
                    marginTop: '4px',
                    lineHeight: 0.95,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t('subheading')}
                </p>
              </div>
            </div>
            <div style={{ background: '#502076', height: 'clamp(220px, 38vw, 380px)' }} />
          </div>

          <div
            className="hidden lg:flex flex-row w-full"
            style={{ minHeight: 'clamp(165px, 18.5vw, 245px)' }}
          >
            <div
              className="flex items-center justify-end flex-shrink-0"
              style={{
                background: '#7210F2',
                width: '45%',
                paddingLeft: 'clamp(6px,0.8vw,10px)',
                paddingRight: 'clamp(16px,2.5vw,32px)',
              }}
            >
              <div className="text-right">
                <h2
                  className="text-white font-extrabold"
                  style={{
                    fontFamily: 'var(--font-heading, Roboto, sans-serif)',
                    fontSize: 'clamp(1.7rem, 4vw, 3rem)',
                    lineHeight: 0.9,
                  }}
                >
                  {t('heading')}
                  <br />
                  {t('headingLine2')}
                </h2>
                <p
                  className="text-white font-extrabold"
                  style={{
                    fontFamily: 'var(--font-heading, Roboto, sans-serif)',
                    fontSize: 'clamp(1.3rem, 2.9vw, 2rem)',
                    marginTop: '2px',
                  }}
                >
                  {t('subheading')}
                </p>
              </div>
            </div>
            <div
              className="flex items-center flex-1 min-w-0"
              style={{
                background: '#502076',
                paddingTop: 'clamp(16px,2.5vw,28px)',
                paddingBottom: 'clamp(16px,2.5vw,28px)',
                paddingLeft: 'clamp(56px,8vw,108px)',
                paddingRight: 0,
                gap: 'clamp(56px,8vw,108px)',
              }}
            >
              <div
                className="flex-shrink-0"
                style={{
                  width: 'clamp(82px, 10vw, 130px)',
                  height: 'clamp(82px, 10vw, 130px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/images/events.avif"
                  alt="Concierto"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div
                className="flex-1 min-w-0"
                style={{
                  background: 'linear-gradient(90deg, #EF1351 0%, #c41040 100%)',
                  height: 'clamp(82px, 10vw, 130px)',
                }}
              />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal variant="fade-up" amount={0.05}>
        <section
          className="w-full"
          style={{ background: '#ffffff', paddingBottom: 'clamp(24px,4vw,48px)' }}
        >
          <div className="flex flex-col lg:hidden">
            <div
              style={{ height: 'clamp(16px, 2vw, 32px)', background: 'rgba(185, 190, 250, 0.45)' }}
            />

            <div
              className="relative w-full flex flex-col items-center"
              style={{
                paddingTop: 'clamp(16px, 2.5vw, 28px)',
                paddingBottom: 'clamp(24px, 3.5vw, 40px)',
              }}
            >
              <img
                src="/images/events.avif"
                alt="Fondo concierto"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(230,150,60,0.65) 0%, rgba(220,130,60,0.25) 28%, transparent 60%)',
                }}
              />

              <div
                style={{ width: '80vw', maxWidth: '440px', position: 'relative', zIndex: 10 }}
                ref={mobileWrapperRef}
              >
                <div
                  className="shadow-2xl"
                  style={{
                    width: '100%',
                    background: '#B9BEFA',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CalendarToolbar {...sharedToolbarProps} compact />
                  <div
                    style={{
                      margin: '0 10px 10px 10px',
                      background: '#B9BEFA',
                      border: BORDER,
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        height: 28,
                        background: '#B9BEFA',
                        flexShrink: 0,
                      }}
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <div
                          key={d}
                          className="text-center font-bold"
                          style={{
                            color: '#EF1351',
                            fontSize: '0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                    <CalendarGrid
                      {...sharedGridProps}
                      cellSize={mobileCellSize}
                      fontSize="0.7rem"
                      weekFontSize="0.52rem"
                      weekHourLabelW={28}
                      weekRowH={22}
                    />
                  </div>
                </div>
              </div>

              <div
                className="flex justify-center"
                style={{ marginTop: 20, position: 'relative', zIndex: 10 }}
              >
                <RegisterButton {...registerProps} compact />
              </div>
            </div>
          </div>

          <div className="relative mx-auto hidden lg:flex flex-row" style={{ maxWidth: '1140px' }}>
            <div
              style={{
                width: OVERHANG,
                flexShrink: 0,
                background: 'rgba(185, 190, 250, 0.45)',
                alignSelf: 'stretch',
              }}
            />

            <div className="relative flex-1 min-w-0">
              <img
                src="/images/events.avif"
                alt="Fondo concierto"
                style={{
                  width: '100%',
                  height: 'clamp(390px, 51vw, 590px)',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(230,150,60,0.65) 0%, rgba(220,130,60,0.25) 28%, transparent 60%)',
                }}
              />

              <div
                className="absolute"
                style={{
                  top: CAL_MARGIN,
                  bottom: CAL_MARGIN,
                  left: 'clamp(20px,3vw,40px)',
                  zIndex: 10,
                  width: 'clamp(320px, 52%, 580px)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="shadow-2xl flex flex-col flex-1" style={{ background: '#B9BEFA' }}>
                  <CalendarToolbar {...sharedToolbarProps} />
                  <div
                    ref={desktopCalRef}
                    className="mx-4 mb-4"
                    style={{
                      background: '#B9BEFA',
                      border: BORDER,
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        background: '#B9BEFA',
                        flexShrink: 0,
                      }}
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <div
                          key={d}
                          className="text-center font-bold py-2"
                          style={{ color: '#EF1351', fontSize: 'clamp(0.65rem,1.3vw,0.85rem)' }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                    <CalendarGrid
                      {...sharedGridProps}
                      cellSize={desktopCellSize}
                      fontSize="clamp(0.68rem,1.4vw,0.92rem)"
                      weekFontSize="clamp(0.52rem,1vw,0.72rem)"
                      weekHourLabelW={36}
                      weekRowH={28}
                    />
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-y-0 flex items-center justify-center"
                style={{
                  left: 'calc(clamp(320px, 52%, 580px) + clamp(20px,3vw,40px))',
                  right: 0,
                  zIndex: 10,
                }}
              >
                <RegisterButton {...registerProps} />
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
