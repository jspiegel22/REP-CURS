import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ResortsLanding from "@/pages/resorts-landing";
import ResortDetail from "@/pages/resort-detail";
import VillasLanding from "@/pages/villas-landing";
import VillaDetail from "@/pages/villa-detail";
import AdventuresLanding from "@/pages/adventures-landing";
import AdventureDetail from "@/pages/adventure-detail";
import BlogIndex from "@/pages/blog";
import BlogDetail from "@/pages/blog/[slug]";
import RestaurantsPage from "@/pages/restaurants";
import RestaurantDetails from "@/pages/restaurants/[id]";
import FamilyTripsPage from "@/pages/group-trips/family";
import BachelorBachelorettePage from "@/pages/group-trips/bachelor-bachelorette";
import LuxuryConcierge from "@/pages/group-trips/luxury-concierge";
import InfluencerPage from "@/pages/group-trips/influencer";
import WeddingsPage from "@/pages/weddings";
import RealEstatePage from "@/pages/real-estate";
import EventsPage from "@/pages/events";
import GuidesPage from "@/pages/guides";
import WorkWithUsPage from "@/pages/work-with-us";
import NavigationBar from "./components/navigation-bar";
import { ChatButton } from "./components/chat-button";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import AdminDashboard from "@/pages/admin";
import AdminLoginPage from "@/pages/admin/login";

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return React.createElement(
      "div", 
      { className: "flex justify-center items-center min-h-screen" },
      React.createElement("div", { 
        className: "animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" 
      })
    );
  }
  
  if (!user || user.role !== "admin") {
    return React.createElement(AdminLoginPage);
  }
  
  return React.createElement(React.Fragment, null, children);
}

function Router() {
  return React.createElement(
    "div", 
    { className: "min-h-screen bg-background flex flex-col" },
    React.createElement(NavigationBar),
    React.createElement(
      "div", 
      { className: "flex-grow" },
      React.createElement(
        Switch,
        null,
        React.createElement(Route, { path: "/", component: HomePage }),
        React.createElement(Route, { path: "/admin/login", component: AdminLoginPage }),
        React.createElement(Route, { 
          path: "/admin",
          children: () => React.createElement(
            ProtectedAdminRoute,
            null,
            React.createElement(AdminDashboard)
          )
        }),
        React.createElement(Route, { path: "/blog", component: BlogIndex }),
        React.createElement(Route, { path: "/blog/:slug", component: BlogDetail }),
        React.createElement(Route, { path: "/resorts", component: ResortsLanding }),
        React.createElement(Route, { path: "/resorts/:slug", component: ResortDetail }),
        React.createElement(Route, { path: "/villas", component: VillasLanding }),
        React.createElement(Route, { path: "/villas/:slug", component: VillaDetail }),
        React.createElement(Route, { path: "/adventures", component: AdventuresLanding }),
        React.createElement(Route, { path: "/adventures/:slug", component: AdventureDetail }),
        React.createElement(Route, { path: "/adventures/atv", component: AdventuresLanding }),
        React.createElement(Route, { path: "/adventures/private-yachts", component: AdventuresLanding }),
        React.createElement(Route, { path: "/adventures/whale-watching", component: AdventuresLanding }),
        React.createElement(Route, { path: "/restaurants", component: RestaurantsPage }),
        React.createElement(Route, { path: "/restaurants/:id", component: RestaurantDetails }),
        React.createElement(Route, { path: "/group-trips/family", component: FamilyTripsPage }),
        React.createElement(Route, { path: "/group-trips/bachelor-bachelorette", component: BachelorBachelorettePage }),
        React.createElement(Route, { path: "/group-trips/luxury-concierge", component: LuxuryConcierge }),
        React.createElement(Route, { path: "/group-trips/influencer", component: InfluencerPage }),
        React.createElement(Route, { path: "/weddings", component: WeddingsPage }),
        React.createElement(Route, { path: "/real-estate", component: RealEstatePage }),
        React.createElement(Route, { path: "/events", component: EventsPage }),
        React.createElement(Route, { path: "/guides", component: GuidesPage }),
        React.createElement(Route, { path: "/work-with-us", component: WorkWithUsPage }),
        
        // Test page for guide submission
        React.createElement(Route, { path: "/test-guide-submission", component: () => 
          React.createElement(
            Suspense, 
            { 
              fallback: React.createElement(
                "div", 
                { className: "flex justify-center items-center min-h-screen" },
                React.createElement("div", { 
                  className: "animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" 
                })
              ) 
            },
            React.createElement(React.lazy(() => import('@/pages/test-guide-submission')))
          )
        }),
        
        // Stripe checkout routes
        React.createElement(Route, { path: "/checkout/:listingId", component: () => 
          React.createElement(
            Suspense, 
            { 
              fallback: React.createElement(
                "div", 
                { className: "flex justify-center items-center min-h-screen" },
                React.createElement("div", { 
                  className: "animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" 
                })
              ) 
            },
            React.createElement(React.lazy(() => import('@/pages/checkout-page')))
          )
        }),
        React.createElement(Route, { path: "/booking-confirmation", component: () => 
          React.createElement(
            Suspense, 
            { 
              fallback: React.createElement(
                "div", 
                { className: "flex justify-center items-center min-h-screen" },
                React.createElement("div", { 
                  className: "animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" 
                })
              ) 
            },
            React.createElement(React.lazy(() => import('@/pages/booking-confirmation-page')))
          )
        }),
        
        React.createElement(Route, { component: NotFound })
      )
    ),
    React.createElement(Footer),
    React.createElement(ChatButton)
  );
}

function App() {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(
      AuthProvider,
      null,
      React.createElement(Router),
      React.createElement(Toaster)
    )
  );
}

export default App;