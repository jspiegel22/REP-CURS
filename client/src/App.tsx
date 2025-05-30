import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import Footer from "@/components/footer";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ResortsLanding from "@/pages/resorts-landing";
import ResortDetail from "@/pages/resort-detail";
import VillasLanding from "@/pages/villas-landing";
import VillaDetail from "@/pages/villa-detail";
import VillaDetailPage from "@/pages/villa/[slug]";
import VillaExamplePage from "@/pages/villa-example";
import AdventuresLanding from "@/pages/adventures-landing";
import AdventureDetail from "@/pages/adventure-detail";
import YachtAdventuresPage from "@/pages/adventures/private-yachts";
import ExpressYachtDetailPage from "@/pages/adventures/express-bay-liner-35ft";
import SilvertonYachtDetailPage from "@/pages/adventures/silverton-sport-bridge-42";
import SeaRaySundancerPage from "@/pages/adventures/sea-ray-sundancer-45";
import Sunseeker80SaviPage from "@/pages/adventures/sunseeker-80-savi";
import Azimut95Page from "@/pages/adventures/azimut-95";
import PatronFerretti88Page from "@/pages/adventures/patron-ferretti-88";
import PapillonCatamaran47Page from "@/pages/adventures/papillon-catamaran-47";
import Lagoon65Page from "@/pages/adventures/lagoon-65";
import LeopardCatamaranPage from "@/pages/adventures/leopard-catamaran";
import BlogIndex from "@/pages/blog";
import BlogDetail from "@/pages/blog/[slug]";
import RestaurantsPage from "@/pages/restaurants";
import RestaurantDetails from "@/pages/restaurants/[id]";
import PartyPage from "@/pages/party";
import WellnessPage from "@/pages/wellness";
import FamilyTripsPage from "@/pages/group-trips/family";
import BachelorBachelorettePage from "@/pages/group-trips/bachelor-bachelorette";
import CorporateEventsPage from "@/pages/group-trips/corporate";
import LuxuryConcierge from "@/pages/group-trips/luxury-concierge";
import InfluencerPage from "@/pages/group-trips/influencer";
import WeddingsPage from "@/pages/weddings";
import RealEstatePage from "@/pages/real-estate";
import PropertyManagementPage from "@/pages/property-management";
import EventsPage from "@/pages/events";
import GuidesPage from "@/pages/guides";
import WorkWithUsPage from "@/pages/work-with-us";
import ItineraryBuilderPage from "@/pages/itinerary-builder-page";
import TransportationPage from "@/pages/transportation";
import TransportationConfirmation from "@/pages/transportation/confirmation";
import CheckoutTemplate from "@/pages/checkout";
import TestFormsPage from "@/pages/test-forms";
import { ImageManagementPage } from "@/pages/image-management";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import NavigationBar from "./components/navigation-bar";
import { ChatButton } from "./components/chat-button";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import AdminDashboard from "@/pages/admin";
import AdminLoginPage from "@/pages/admin/login";
import AdminImagesPage from "@/pages/admin-images";
import PhotoSyncPage from "@/pages/photo-sync-page";
import TestNotificationPage from "@/pages/admin/test-notification";
import TestNotificationsPage from "@/pages/test-notifications";

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  console.log("ProtectedAdminRoute - User:", user, "isLoading:", isLoading);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user || user.role !== "admin") {
    console.log("Not authenticated or not admin, redirecting to login");
    // Use window.location for hard redirect instead of wouter Redirect
    window.location.href = "/admin/login";
    return null;
  }
  
  return <>{children}</>;
}

function Router() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavigationBar />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/admin/login" component={AdminLoginPage} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/blog" component={BlogIndex} />
          <Route path="/blog/:slug" component={BlogDetail} />
          <Route path="/resorts" component={ResortsLanding} />
          <Route path="/resorts/:slug" component={ResortDetail} />
          <Route path="/villas" component={VillasLanding} />
          <Route path="/villas/:slug" component={VillaDetail} />
          {/* Our new individual villa page route */}
          <Route path="/villa/:slug" component={VillaDetailPage} />
          <Route path="/villa-example" component={VillaExamplePage} />
          <Route path="/adventures" component={AdventuresLanding} />
          <Route path="/adventures/private-yachts" component={YachtAdventuresPage} />
          <Route path="/adventures/express-bay-liner-35ft" component={ExpressYachtDetailPage} />
          <Route path="/adventures/silverton-sport-bridge-42" component={SilvertonYachtDetailPage} />
          <Route path="/adventures/sea-ray-sundancer-45" component={SeaRaySundancerPage} />
          <Route path="/adventures/sunseeker-80-savi" component={Sunseeker80SaviPage} />
          <Route path="/adventures/azimut-95" component={Azimut95Page} />
          <Route path="/adventures/patron-ferretti-88" component={PatronFerretti88Page} />
          <Route path="/adventures/papillon-catamaran-47" component={PapillonCatamaran47Page} />
          <Route path="/adventures/lagoon-65" component={Lagoon65Page} />
          <Route path="/adventures/leopard-catamaran" component={LeopardCatamaranPage} />
          <Route path="/adventures/:slug" component={AdventureDetail} />
          <Route path="/restaurants" component={RestaurantsPage} />
          <Route path="/restaurants/:id" component={RestaurantDetails} />
          <Route path="/party" component={PartyPage} />
          <Route path="/wellness" component={WellnessPage} />
          <Route path="/group-trips/family" component={FamilyTripsPage} />
          <Route path="/group-trips/bachelor-bachelorette" component={BachelorBachelorettePage} />
          <Route path="/group-trips/corporate" component={CorporateEventsPage} />
          <Route path="/group-trips/luxury-concierge" component={LuxuryConcierge} />
          <Route path="/group-trips/influencer" component={InfluencerPage} />
          <Route path="/weddings" component={WeddingsPage} />
          <Route path="/real-estate" component={RealEstatePage} />
          <Route path="/property-management" component={PropertyManagementPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/guides" component={GuidesPage} />
          <Route path="/work-with-us" component={WorkWithUsPage} />
          <Route path="/itinerary-builder" component={ItineraryBuilderPage} />
          <Route path="/transportation" component={TransportationPage} />
          <Route path="/transportation/confirmation" component={TransportationConfirmation} />
          <Route path="/checkout" component={CheckoutTemplate} />
          <Route path="/test-forms" component={TestFormsPage} />
          <Route path="/admin/images">
            {() => (
              <ProtectedAdminRoute>
                <AdminImagesPage />
              </ProtectedAdminRoute>
            )}
          </Route>
          <Route path="/admin/photo-sync">
            {() => (
              <ProtectedAdminRoute>
                <PhotoSyncPage />
              </ProtectedAdminRoute>
            )}
          </Route>
          <Route path="/admin/test-notification">
            {() => (
              <ProtectedAdminRoute>
                <TestNotificationPage />
              </ProtectedAdminRoute>
            )}
          </Route>
          <Route path="/admin/email-notifications">
            {() => (
              <ProtectedAdminRoute>
                <TestNotificationsPage />
              </ProtectedAdminRoute>
            )}
          </Route>
          <Route path="/photo-sync" component={PhotoSyncPage} />
          <Route path="/image-management" component={ImageManagementPage} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
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