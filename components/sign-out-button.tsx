"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
        </Button>
    )
}
