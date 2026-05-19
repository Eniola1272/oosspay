import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[96px] w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-[#333333] transition-colors outline-none placeholder:text-[#BBBBBB] focus-visible:border-[#C2185B] focus-visible:ring-2 focus-visible:ring-[#C2185B]/20 disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:opacity-60 aria-invalid:border-[#E74C3C] aria-invalid:ring-2 aria-invalid:ring-[#E74C3C]/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
