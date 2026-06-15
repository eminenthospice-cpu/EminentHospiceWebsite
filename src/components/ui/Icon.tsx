import type { SVGProps, ComponentType } from 'react';
import {
  Home,
  Heart,
  Hospital,
  Calendar,
  Users,
  Phone,
  Globe,
  ShieldCheck,
  MapPin,
  Languages,
  Briefcase,
  Sparkles,
  Sun,
  HandHeart,
  MessageCircle,
  ArrowRight,
  Scale,
  FileText,
  Info,
  Check,
  Target,
  Flag,
  BookOpen,
  Mail,
  Printer,
  type LucideProps,
} from 'lucide-react';

/**
 * Compatibility shim: keeps the original `<Icon name="..." />` API while
 * routing rendering through `lucide-react` for consistent stroke weight,
 * tree-shaken bundle, and uniform metaphor language.
 *
 * Existing call sites do not need to change. New code may import lucide
 * icons directly when it wants a name not in the registry below.
 */
export type IconName =
  | 'home'
  | 'heart'
  | 'hospital'
  | 'calendar'
  | 'users'
  | 'phone'
  | 'globe'
  | 'shield'
  | 'mapPin'
  | 'language'
  | 'briefcase'
  | 'sparkles'
  | 'sun'
  | 'handHeart'
  | 'chat'
  | 'arrowRight'
  | 'scale'
  | 'document'
  | 'info'
  | 'check'
  | 'target'
  | 'flag'
  | 'book'
  | 'mail'
  | 'printer';

const REGISTRY: Record<IconName, ComponentType<LucideProps>> = {
  home: Home,
  heart: Heart,
  hospital: Hospital,
  calendar: Calendar,
  users: Users,
  phone: Phone,
  globe: Globe,
  shield: ShieldCheck,
  mapPin: MapPin,
  language: Languages,
  briefcase: Briefcase,
  sparkles: Sparkles,
  sun: Sun,
  handHeart: HandHeart,
  chat: MessageCircle,
  arrowRight: ArrowRight,
  scale: Scale,
  document: FileText,
  info: Info,
  check: Check,
  target: Target,
  flag: Flag,
  book: BookOpen,
  mail: Mail,
  printer: Printer,
};

type IconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  name: IconName;
  title?: string;
};

export function Icon({ name, title, className, ...rest }: IconProps) {
  const LucideIcon = REGISTRY[name];
  const isDecorative = !title;
  return (
    <LucideIcon
      className={className}
      strokeWidth={1.75}
      aria-hidden={isDecorative || undefined}
      role={isDecorative ? undefined : 'img'}
      focusable="false"
      {...(title ? { 'aria-label': title } : {})}
      {...(rest as LucideProps)}
    />
  );
}
