import {
  BadgeDollarSign,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  Info,
  Network,
  Sparkles,
  Star,
  TicketCheck,
  Trophy,
  Users,
  Video,
  Wrench,
} from 'lucide-react';
import type { NavigationIconName } from './navigation';

const icons = {
  about: Info,
  star: Star,
  transform: Sparkles,
  impact: BarChart3,
  team: Users,
  academy: GraduationCap,
  hub: Network,
  fellows: Trophy,
  consulting: BriefcaseBusiness,
  assessment: ClipboardCheck,
  membership: Info,
  benefits: Star,
  community: Users,
  join: HeartHandshake,
  blog: BookOpenText,
  tools: Wrench,
  webinars: Video,
  events: CalendarDays,
  summit: Sparkles,
  agenda: CalendarDays,
  speakers: Users,
  registration: TicketCheck,
  sponsors: BadgeDollarSign,
  faq: CircleHelp,
} satisfies Record<NavigationIconName, typeof Info>;

export default function NavigationIcon({ name }: { name: NavigationIconName }) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" />;
}
