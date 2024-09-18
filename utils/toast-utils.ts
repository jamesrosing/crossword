import { toast } from "@/components/ui/use-toast"

const toastQueue: (() => void)[] = []
let isShowingToast = false

const showNextToast = () => {
  if (toastQueue.length > 0 && !isShowingToast) {
    isShowingToast = true
    const nextToast = toastQueue.shift()
    nextToast!()
  }
}

export const showToast = (title: string, description?: string, variant?: "default" | "destructive" | "success" | "warning" | "info") => {
  const toastFunction = () => {
    toast({
      title,
      description,
      variant,
      onOpenChange: (open) => {
        if (!open) {
          isShowingToast = false
          showNextToast()
        }
      },
    })
  }

  toastQueue.push(toastFunction)
  showNextToast()
}