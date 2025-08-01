"use client";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    BarChart,
    Bell,
    Settings,
    Shield,
    Terminal,
    AlertTriangle
} from "lucide-react"

const sidebarItems = [
    {
        title: "Vue d'ensemble",
        href: "/dashboard",
        icon: BarChart
    },
    {
        title: "Alertes",
        href: "/alerts",
        icon: Bell
    },
    {
        title: "Tests",
        href: "/test",
        icon: Terminal
    },
    {
        title: "Règles IDS",
        href: "/rules",
        icon: Shield
    },
    {
        title: "Menaces",
        href: "/threats",
        icon: AlertTriangle
    },
    {
        title: "Configuration",
        href: "/settings",
        icon: Settings
    }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="pb-12 min-h-screen">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold">
                        IDS AI System
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
} 