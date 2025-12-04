"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface TabTransitionProps {
    children: ReactNode
    className?: string
}

export function TabTransition({ children, className = "" }: TabTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.25,
                ease: "easeOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
