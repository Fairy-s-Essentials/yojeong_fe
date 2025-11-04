import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

// Context for AlertDialog state management
interface AlertDialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialog components must be used within AlertDialog");
  }
  return context;
}

interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function AlertDialog({ 
  open: controlledOpen, 
  defaultOpen = false, 
  onOpenChange, 
  children 
}: AlertDialogProps) {
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
    <AlertDialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

interface AlertDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function AlertDialogTrigger({ onClick, ...props }: AlertDialogTriggerProps) {
  const { onOpenChange } = useAlertDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onOpenChange(true);
  };

  return <button data-slot="alert-dialog-trigger" onClick={handleClick} {...props} />;
}

interface AlertDialogPortalProps {
  children: React.ReactNode;
}

function AlertDialogPortal({ children }: AlertDialogPortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-slot="alert-dialog-portal">{children}</div>,
    document.body
  );
}

interface AlertDialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDialogOverlay = React.forwardRef<HTMLDivElement, AlertDialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { open } = useAlertDialogContext();

    if (!open) return null;

    return (
      <div
        ref={ref}
        data-slot="alert-dialog-overlay"
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
AlertDialogOverlay.displayName = "AlertDialogOverlay";

interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useAlertDialogContext();

    // Close on Escape key (AlertDialog는 보통 Escape로 닫기를 허용)
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener("keydown", handleKeyDown);
        // Prevent body scroll when alert dialog is open
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <div
          ref={ref}
          role="alertdialog"
          aria-modal="true"
          data-slot="alert-dialog-content"
          data-state={open ? "open" : "closed"}
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AlertDialogPortal>
    );
  }
);
AlertDialogContent.displayName = "AlertDialogContent";

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

interface AlertDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <h2
      data-slot="alert-dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

interface AlertDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function AlertDialogDescription({ className, ...props }: AlertDialogDescriptionProps) {
  return (
    <p
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function AlertDialogAction({ onClick, ...props }: AlertDialogActionProps) {
  const { onOpenChange } = useAlertDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onOpenChange(false);
  };

  return (
    <button 
      data-slot="alert-dialog-action" 
      onClick={handleClick} 
      {...props} 
    />
  );
}

interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function AlertDialogCancel({ onClick, ...props }: AlertDialogCancelProps) {
  const { onOpenChange } = useAlertDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onOpenChange(false);
  };

  return (
    <button 
      data-slot="alert-dialog-cancel" 
      onClick={handleClick} 
      {...props} 
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};