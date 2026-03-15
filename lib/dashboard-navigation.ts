import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Building2, 
  UserCircle,
  ShieldCheck,
  Briefcase
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles: string[];
}

export const dashboardNav: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "departmentchef", "cellchef", "employee"],
  },
  {
    title: "Ma Structure",
    href: "/dashboard/structure",
    icon: Building2,
    roles: ["admin", "departmentchef", "cellchef"],
  },
  {
    title: "Collaborateurs",
    href: "/dashboard/employees",
    icon: Users,
    roles: ["admin", "departmentchef"],
  },
  {
    title: "Mes Congés",
    href: "/dashboard/leaves",
    icon: Briefcase,
    roles: ["admin", "departmentchef", "cellchef", "employee"],
  },
  {
    title: "Validations",
    href: "/dashboard/validations",
    icon: ShieldCheck,
    roles: ["admin", "departmentchef", "cellchef"],
  },
  {
    title: "Messagerie",
    href: "/dashboard/chat",
    icon: MessageSquare,
    roles: ["admin", "departmentchef", "cellchef", "employee"],
  },
];