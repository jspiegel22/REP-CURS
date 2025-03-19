import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ResortsLanding from "@/pages/resorts-landing";
import ResortDetail from "@/pages/resort-detail";
import VillasLanding from "@/pages/villas-landing";
import VillaDetail from "@/pages/villa-detail";
import AdventuresLanding from "@/pages/adventures-landing";
import AdventureDetail from "@/pages/adventure-detail";
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
import NavigationBar from "./components/navigation-bar";
import { ChatButton } from "./components/chat-button";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/resorts" component={ResortsLanding} />
        <Route path="/resorts/:slug" component={ResortDetail} />
        <Route path="/villas" component={VillasLanding} />
        <Route path="/villas/:slug" component={VillaDetail} />
        <Route path="/adventures" component={AdventuresLanding} />
        <Route path="/adventures/:slug" component={AdventureDetail} />
        <Route path="/restaurants" component={RestaurantsPage} />
        <Route path="/restaurants/:id" component={RestaurantDetails} />
        <Route path="/group-trips/family" component={FamilyTripsPage} />
        <Route path="/group-trips/bachelor-bachelorette" component={BachelorBachelorettePage} />
        <Route path="/group-trips/luxury-concierge" component={LuxuryConcierge} />
        <Route path="/group-trips/influencer" component={InfluencerPage} />
        <Route path="/weddings" component={WeddingsPage} />
        <Route path="/real-estate" component={RealEstatePage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/guides" component={GuidesPage} />
        <Route component={NotFound} />
      </Switch>
      <ChatButton />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;