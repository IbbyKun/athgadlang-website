import {
  Building2,
  Clapperboard,
  Factory,
  Fuel,
  HeartHandshake,
  Landmark,
  MonitorCog,
  Plane,
  RadioTower,
  Store,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { industryImages } from "@/lib/images";

export type Industry = {
  slug: keyof typeof industryImages;
  name: string;
  icon: LucideIcon;
  image: { src: string; alt: string };
};

export const industries: Industry[] = [
  {
    slug: "financial-services",
    name: "Financial Services",
    icon: Landmark,
    image: industryImages["financial-services"],
  },
  {
    slug: "technology",
    name: "Technology",
    icon: MonitorCog,
    image: industryImages.technology,
  },
  {
    slug: "aviation",
    name: "Aviation",
    icon: Plane,
    image: industryImages.aviation,
  },
  {
    slug: "food-and-beverages",
    name: "Food & Beverages",
    icon: UtensilsCrossed,
    image: industryImages["food-and-beverages"],
  },
  {
    slug: "logistics",
    name: "Logistics",
    icon: Truck,
    image: industryImages.logistics,
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    icon: Factory,
    image: industryImages.manufacturing,
  },
  {
    slug: "non-profit",
    name: "Non-Profit Org",
    icon: HeartHandshake,
    image: industryImages["non-profit"],
  },
  {
    slug: "retail",
    name: "Retail / E-Tail",
    icon: Store,
    image: industryImages.retail,
  },
  {
    slug: "oil-and-gas",
    name: "Oil and Gas",
    icon: Fuel,
    image: industryImages["oil-and-gas"],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    icon: Building2,
    image: industryImages["real-estate"],
  },
  {
    slug: "media",
    name: "Media",
    icon: Clapperboard,
    image: industryImages.media,
  },
  {
    slug: "telecommunication",
    name: "Telecommunication",
    icon: RadioTower,
    image: industryImages.telecommunication,
  },
];

export function industryHref(industry: Industry) {
  return `/industries/${industry.slug}`;
}
