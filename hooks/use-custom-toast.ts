import { useToast } from "@/components/ui/use-toast"

export function useCustomToast() {
  const { toast } = useToast()

  const showSuccessToast = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    })
  }

  const showErrorToast = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    })
  }

  const showInfoToast = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    })
  }

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
  }
}