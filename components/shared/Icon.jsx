import {
  Map,
  ShieldCheck,
  LifeBuoy,
  Flame,
  Users,
  Ticket,
  Sparkles,
  Calendar,
  PartyPopper,
  Mic2,
  Wrench,
  Trophy,
  Tent,
  Frame,
  UtensilsCrossed,
  Laugh,
  Briefcase,
  Star,
  HandHeart,
  HelpCircle,
} from 'lucide-react';

const MAP = {
  Map,
  ShieldCheck,
  LifeBuoy,
  Flame,
  Users,
  Ticket,
  Sparkles,
  Calendar,
  PartyPopper,
  Mic2,
  Wrench,
  Trophy,
  Tent,
  Frame,
  UtensilsCrossed,
  Laugh,
  Briefcase,
  Star,
  HandHeart,
  HelpCircle,
};

/**
 * Resolves a string icon name (used in JSON-like config objects)
 * to a Lucide React component. Falls back to Sparkles.
 */
export default function Icon({ name, className = 'h-5 w-5', ...rest }) {
  const Comp = MAP[name] || Sparkles;
  return <Comp className={className} {...rest} />;
}
