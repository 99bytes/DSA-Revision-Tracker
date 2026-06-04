import { useEffect, useRef, useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useAuth } from "@clerk/react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "next-themes";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AddQuestion from "@/pages/add";
import EditQuestion from "@/pages/edit";
import LandingPage from "@/pages/landing";

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(258 90% 66%)",
    fontFamily: "'Nunito', sans-serif",
    borderRadius: "1rem",
  },
  elements: {
    badge: "text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary px-2.5 py-0.5 rounded-full border border-primary/20 shadow-sm",
    rootBox: "w-full flex justify-center no-hp-shadow",
    cardBox: "bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-3xl w-[440px] max-w-full overflow-hidden shadow-2xl shadow-black/10 dark:shadow-white/5",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-black dark:text-white font-extrabold text-2xl tracking-normal",
    headerSubtitle: "text-black/60 dark:text-white/60 text-sm font-medium",
    socialButtonsBlockButtonText: "text-black dark:text-white font-bold",
    socialButtonsBlockButton: "magical-btn bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] h-11 rounded-xl transition-colors",
    formFieldLabel: "text-black/70 dark:text-white/70 font-bold",
    formFieldInput: "bg-transparent border border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl h-11 focus:border-primary",
    formButtonPrimary: "magical-btn bg-black hover:bg-black/80 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-white dark:text-black font-bold shadow-md h-11 rounded-xl transition-colors",
    footerActionLink: "text-primary dark:text-primary font-bold hover:text-primary dark:hover:text-primary",
    footerActionText: "text-black/60 dark:text-white/60",
    dividerText: "text-black/40 dark:text-white/40 font-medium",
    dividerLine: "bg-black/10 dark:bg-white/10",
    logoBox: "mb-4",
    logoImage: "h-12 w-auto",
    formFieldRow: "gap-4",
    main: "gap-6",
    formFieldSuccessText: "text-green-500 font-medium",
    alertText: "text-black dark:text-white",
    alert: "bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl",
    otpCodeFieldInput: "bg-transparent border border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl h-12 w-12",
  },
};

function SignInPage() {
  const [, navigate] = useLocation();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/"), 200);
  };
  
  return (
    <div 
      className={`flex min-h-[100dvh] items-center justify-center bg-background/80 px-4 cursor-pointer transition-opacity duration-200 ease-in-out ${isExiting ? "opacity-0" : "opacity-100"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className={`cursor-auto transition-transform duration-200 ease-in-out ${isExiting ? "scale-95" : "scale-100"}`}>
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  const [, navigate] = useLocation();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/"), 200);
  };

  return (
    <div 
      className={`flex min-h-[100dvh] items-center justify-center bg-background/80 px-4 cursor-pointer transition-opacity duration-200 ease-in-out ${isExiting ? "opacity-0" : "opacity-100"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className={`cursor-auto transition-transform duration-200 ease-in-out ${isExiting ? "scale-95" : "scale-100"}`}>
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}
function ApiTokenInjector() {
  const { getToken } = useAuth();
  useEffect(() => {
    setAuthTokenGetter(() => getToken());
  }, [getToken]);
  return null;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in">
        <Component />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function HomeRoute() {
  return (
    <>
      <Show when="signed-in">
        <Home />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();

  const isHP = theme === "harry-potter";

  // Data URI for the golden lightning bolt logo
  const hpLogoUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%23d4af37" stroke="%23d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>';

  const dynamicAppearance = {
    ...clerkAppearance,
    options: {
      ...clerkAppearance.options,
      logoImageUrl: isHP ? hpLogoUrl : clerkAppearance.options.logoImageUrl,
    }
  };

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={dynamicAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to Beatle",
          },
        },
        signUp: {
          start: {
            title: "Start tracking",
            subtitle: "Create your DSA Revision account",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <ApiTokenInjector />
        <Switch>
          <Route path="/" component={HomeRoute} />
          <Route path="/add" component={() => <ProtectedRoute component={AddQuestion} />} />
          <Route path="/edit/:id" component={() => <ProtectedRoute component={EditQuestion} />} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="cyberpunk"
      enableSystem={true}
      storageKey="dsa-theme"
      value={{
        light: "light",
        dark: "dark",
        "github-dark": "github-dark",
        "terminal-hacker": "terminal-hacker",
        "leetcode-elite": "leetcode-elite",
        "cyberpunk": "cyberpunk",
        "harry-potter": "harry-potter"
      }}
    >
      <div className="bg-glow-orbs">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
        <div className="glow-orb glow-orb-4"></div>
      </div>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <ClerkProviderWithRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
