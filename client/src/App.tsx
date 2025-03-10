import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ResortsLanding from "@/pages/resorts-landing";
import VillasLanding from "@/pages/villas-landing";
import AdventuresLanding from "@/pages/adventures-landing";
import RestaurantsLanding from "@/pages/restaurants-landing";
import NavigationBar from "./components/navigation-bar";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/resorts" component={ResortsLanding} />
        <Route path="/villas" component={VillasLanding} />
        <Route path="/adventures" component={AdventuresLanding} />
        <Route path="/restaurants" component={RestaurantsLanding} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;