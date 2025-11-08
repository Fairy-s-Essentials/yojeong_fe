import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog");
  }
  return context;
}

interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function DialogTrigger({ onClick, ...props }: DialogTriggerProps) {
  const { onOpenChange } = useDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onOpenChange(true);
  };

  return <button data-slot="dialog-trigger" onClick={handleClick} {...props} />;
}

interface DialogPortalProps {
  children: React.ReactNode;
}

function DialogPortal({ children }: DialogPortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-slot="dialog-portal">{children}</div>,
    document.body
  );
}

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function DialogClose({ onClick, ...props }: DialogCloseProps) {
  const { onOpenChange } = useDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onOpenChange(false);
  };

  return <button data-slot="dialog-close" onClick={handleClick} {...props} />;
}

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { open } = useDialogContext();

    if (!open) return null;

    return (
      <div
        ref={ref}
        data-slot="dialog-overlay"
        data-state={open ? "open" : "closed"}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
          className
        )}
        {...props}
      />
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useDialogContext();

    // Close on Escape key
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener("keydown", handleKeyDown);
        // Prevent body scroll when dialog is open
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }, [open, onOpenChange]);

    if (!open) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false);
      }
    };

    return (
      <DialogPortal>
        <DialogOverlay onClick={handleOverlayClick} />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          data-slot="dialog-content"
          data-state={open ? "open" : "closed"}
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            className
          )}
          {...props}
        >
          {children}
          <button
            onClick={() => onOpenChange(false)}
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = "DialogContent";

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};