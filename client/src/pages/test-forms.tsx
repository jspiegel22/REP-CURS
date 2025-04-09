import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BacheloretteForm } from "@/components/bachelorette-form";
import { VillaBookingForm } from "@/components/villa-booking-form";

export default function TestFormsPage() {
  const [bacheloretteFormOpen, setBacheloretteFormOpen] = useState(false);
  const [villaBookingFormOpen, setVillaBookingFormOpen] = useState(false);

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-[#2F4F4F] mb-12">
        Test Form Submissions
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#2F4F4F] mb-4">Bachelorette Party Planning</h2>
          <p className="text-gray-600 mb-6">
            Test the bachelorette party planning form which creates a lead and sends webhook
            data to Make.com integration.
          </p>
          <Button 
            onClick={() => setBacheloretteFormOpen(true)}
            className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
          >
            Open Bachelorette Form
          </Button>
          <BacheloretteForm 
            isOpen={bacheloretteFormOpen}
            onClose={() => setBacheloretteFormOpen(false)}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#2F4F4F] mb-4">Villa Booking Form</h2>
          <p className="text-gray-600 mb-6">
            Test the villa booking form which creates a booking record and sends webhook
            data to Make.com integration.
          </p>
          <Button 
            onClick={() => setVillaBookingFormOpen(true)}
            className="w-full bg-[#2F4F4F] hover:bg-[#1F3F3F] text-white"
          >
            Open Villa Booking Form
          </Button>
          <VillaBookingForm 
            isOpen={villaBookingFormOpen}
            onClose={() => setVillaBookingFormOpen(false)}
            villaName="Casa Cabo Luxury Villa"
            villaId="villa-101"
          />
        </div>
      </div>

      <div className="mt-12 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-[#2F4F4F] mb-4">Make.com Webhook Testing</h2>
        <p className="text-gray-600 mb-2">
          All form submissions will be sent to the Make.com webhook URL:
        </p>
        <code className="block bg-gray-800 text-white p-3 rounded mb-4 overflow-x-auto">
          {process.env.MAKE_WEBHOOK_URL || "https://hook.us1.make.com/pomqcmt82c39t3x4mxdpzl4hc4eshhn2"}
        </code>
        <p className="text-gray-600">
          Check your Make.com scenario to see if the data is being received correctly.
          Each form will send different data structures to the webhook.
        </p>
      </div>
    </div>
  );
}