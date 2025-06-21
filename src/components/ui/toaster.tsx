
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white border-l-4 border-l-pastelBlue shadow-lg rounded-lg p-4 min-w-[300px] max-w-[400px]">
            <div className="flex items-start gap-3">
              <div className="flex-1 grid gap-1">
                {title && (
                  <ToastTitle className="text-choco font-fredoka font-semibold text-base">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-gray-600 text-sm leading-relaxed">
                    {description}
                  </ToastDescription>
                )}
              </div>
              {action}
              <ToastClose className="text-gray-400 hover:text-choco transition-colors" />
            </div>
          </Toast>
        )
      })}
      <ToastViewport className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-full flex-col gap-2 md:max-w-[420px]" />
    </ToastProvider>
  )
}
