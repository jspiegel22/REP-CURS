import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | @cabo</title>
        <meta name="description" content="Terms of Service for @cabo - Please read these terms carefully before using our services." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="mb-4">Last Updated: May 1, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using @cabo, you agree to be bound by these Terms and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials on @cabo for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>Attempt to decompile or reverse engineer any software contained on @cabo;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p>
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by @cabo at any time.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Booking and Reservations</h2>
            <p className="mb-4">
              All bookings and reservations made through our platform are subject to the following conditions:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>All rates are subject to availability and can change without prior notice until the reservation is confirmed.</li>
              <li>A valid credit card is required to secure all bookings.</li>
              <li>Cancellation policies vary by property and service provider. Please review the specific terms prior to booking.</li>
              <li>We act as an agent for third-party service providers. All services are subject to the terms and conditions of those providers.</li>
              <li>Special requests are subject to availability and cannot be guaranteed.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
            <p className="mb-4">
              You agree to use our website for lawful purposes only and in a way that does not infringe upon the rights of others. 
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use our website in any way that breaches any applicable local, national, or international law or regulation.</li>
              <li>Transmit, or procure the sending of, any unsolicited or unauthorized advertising or promotional material.</li>
              <li>Knowingly transmit any data, send or upload any material that contains viruses, Trojan horses, worms, or any other harmful programs.</li>
              <li>Attempt to gain unauthorized access to our website, the server on which our website is stored, or any server, computer, or database connected to our website.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Disclaimer</h2>
            <p className="mb-4">
              The materials on @cabo are provided on an 'as is' basis. @cabo makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
            <p>
              Further, @cabo does not warrant or make any representations concerning the accuracy, likely results, 
              or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitations</h2>
            <p>
              In no event shall @cabo or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
              the materials on @cabo, even if @cabo or an @cabo authorized representative has been notified 
              orally or in writing of the possibility of such damage.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. External Links</h2>
            <p>
              Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with @cabo. 
              Please note that @cabo does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Modifications to Terms</h2>
            <p>
              @cabo may revise these terms of service for its website at any time without notice. 
              By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of Washington State and you 
              irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at info@atcabo.com.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}