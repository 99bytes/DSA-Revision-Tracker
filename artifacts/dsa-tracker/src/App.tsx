import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useAuth } from "@clerk/react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
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
    badge: "text-[10px] font-bold uppercase tracking-widest bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300 px-2.5 py-0.5 rounded-full border border-violet-500/20 shadow-sm",
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-3xl w-[440px] max-w-full overflow-hidden shadow-2xl shadow-black/10 dark:shadow-white/5",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-black dark:text-white font-extrabold text-2xl tracking-tight",
    headerSubtitle: "text-black/60 dark:text-white/60 text-sm",
    socialButtonsBlockButtonText: "text-black dark:text-white font-bold",
    socialButtonsBlockButton: "bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] h-11 rounded-xl transition-colors",
    formFieldLabel: "text-black/70 dark:text-white/70 font-bold",
    formFieldInput: "bg-transparent border border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl h-11 focus:border-violet-500",
    formButtonPrimary: "bg-black hover:bg-black/80 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-white dark:text-black font-bold shadow-md h-11 rounded-xl transition-colors",
    footerActionLink: "text-violet-600 dark:text-violet-400 font-bold hover:text-violet-700 dark:hover:text-violet-300",
    footerActionText: "text-black/60 dark:text-white/60",
    dividerText: "text-black/40 dark:text-white/40 font-medium",
    dividerLine: "bg-black/10 dark:bg-white/10",
    logoBox: "mb-4",
    logoImage: "h-12 w-auto filter dark:invert",
    formFieldRow: "gap-4",
    main: "gap-6",
    formFieldSuccessText: "text-green-500 font-medium",
    alertText: "text-black dark:text-white",
    alert: "bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl",
    otpCodeFieldInput: "bg-transparent border border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl h-12 w-12",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
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

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your DSA Tracker",
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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="dsa-theme">
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
