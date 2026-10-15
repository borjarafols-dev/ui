import * as tailwind_variants from 'tailwind-variants';
import { VariantProps } from 'tailwind-variants';

/**
 * Button styles. Framework-agnostic: use on a React Aria `Button`/`Link`, a
 * router link, or a plain `<a>`/`<button>` in an `.astro` file.
 */
declare const button: tailwind_variants.TVReturnType<{
    variant: {
        primary: "bg-button-primary text-button-primary-foreground shadow-xs hover:bg-button-primary-hover pressed:bg-button-primary-hover";
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 pressed:bg-secondary/80";
        outline: "border border-border bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground pressed:bg-accent";
        ghost: "hover:bg-accent hover:text-accent-foreground pressed:bg-accent";
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 pressed:bg-destructive/90";
        link: "text-primary underline-offset-4 hover:underline";
    };
    size: {
        sm: "h-8 gap-1.5 px-3 text-xs";
        md: "h-9 px-4 py-2";
        lg: "h-10 px-6";
    };
}, undefined, "inline-flex cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0", {
    variant: {
        primary: "bg-button-primary text-button-primary-foreground shadow-xs hover:bg-button-primary-hover pressed:bg-button-primary-hover";
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 pressed:bg-secondary/80";
        outline: "border border-border bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground pressed:bg-accent";
        ghost: "hover:bg-accent hover:text-accent-foreground pressed:bg-accent";
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 pressed:bg-destructive/90";
        link: "text-primary underline-offset-4 hover:underline";
    };
    size: {
        sm: "h-8 gap-1.5 px-3 text-xs";
        md: "h-9 px-4 py-2";
        lg: "h-10 px-6";
    };
}, undefined, tailwind_variants.TVReturnTypeLike<{
    variant: {
        primary: "bg-button-primary text-button-primary-foreground shadow-xs hover:bg-button-primary-hover pressed:bg-button-primary-hover";
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 pressed:bg-secondary/80";
        outline: "border border-border bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground pressed:bg-accent";
        ghost: "hover:bg-accent hover:text-accent-foreground pressed:bg-accent";
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 pressed:bg-destructive/90";
        link: "text-primary underline-offset-4 hover:underline";
    };
    size: {
        sm: "h-8 gap-1.5 px-3 text-xs";
        md: "h-9 px-4 py-2";
        lg: "h-10 px-6";
    };
}, undefined>>;
type ButtonVariants = VariantProps<typeof button>;

declare const badge: tailwind_variants.TVReturnType<{
    variant: {
        primary: "border-transparent bg-primary text-primary-foreground";
        secondary: "border-transparent bg-secondary text-secondary-foreground";
        outline: "border-border text-foreground";
        destructive: "border-transparent bg-destructive text-destructive-foreground";
    };
}, undefined, "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium", {
    variant: {
        primary: "border-transparent bg-primary text-primary-foreground";
        secondary: "border-transparent bg-secondary text-secondary-foreground";
        outline: "border-border text-foreground";
        destructive: "border-transparent bg-destructive text-destructive-foreground";
    };
}, undefined, tailwind_variants.TVReturnTypeLike<{
    variant: {
        primary: "border-transparent bg-primary text-primary-foreground";
        secondary: "border-transparent bg-secondary text-secondary-foreground";
        outline: "border-border text-foreground";
        destructive: "border-transparent bg-destructive text-destructive-foreground";
    };
}, undefined>>;
type BadgeVariants = VariantProps<typeof badge>;

declare const spinner: tailwind_variants.TVReturnType<{
    size: {
        sm: "size-4";
        md: "size-8";
        lg: "size-12";
    };
}, undefined, "animate-spin rounded-full border-2 border-muted border-t-primary motion-reduce:animate-[spin_1.5s_linear_infinite]", {
    size: {
        sm: "size-4";
        md: "size-8";
        lg: "size-12";
    };
}, undefined, tailwind_variants.TVReturnTypeLike<{
    size: {
        sm: "size-4";
        md: "size-8";
        lg: "size-12";
    };
}, undefined>>;
type SpinnerVariants = VariantProps<typeof spinner>;

export { badge as b, button as c, spinner as s };
export type { ButtonVariants as B, SpinnerVariants as S, BadgeVariants as a };
