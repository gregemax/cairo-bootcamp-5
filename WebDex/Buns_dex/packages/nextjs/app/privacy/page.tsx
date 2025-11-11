
import React from "react";
import Link from "next/link";

const PrivacyPolicyPage = () => {
  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 py-16 px-4 lg:px-8">
      <div className="grid gap-4 w-full max-w-7xl mx-auto">
        <h1 className="text-3xl lg:text-4xl text-center font-bold text-white">
          Privacy Policy
        </h1>

        <p className="text-gray-300">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 leading-relaxed text-gray-300">
          <p>
            Welcome to <strong>BlockheaderWeb3</strong>. Your privacy is important to us. 
            This Privacy Policy explains how we collect, use, and protect your information 
            when you interact with our services.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">1. Information We Collect</h2>
          <p>
            We may collect personal information you provide, such as your email, wallet address,
            or contact details when using our platform. We may also collect non-personal data like
            browser type, IP address, and usage analytics.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">2. How We Use Your Information</h2>
          <p>
            Your information is used to:
            <ul className="list-disc ml-6 mt-2">
              <li>Provide and improve our services</li>
              <li>Communicate with you about updates or support</li>
              <li>Ensure platform security and compliance</li>
            </ul>
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">3. Data Security</h2>
          <p>
            We implement security measures to protect your data from unauthorized access, 
            alteration, or disclosure. However, please remember that no online method 
            of transmission is 100% secure.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">4. Third-Party Services</h2>
          <p>
            Our website may contain links to third-party websites or integrations 
            (like Uniswap or Discord). We are not responsible for the content or 
            privacy practices of those external sites.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">5. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be 
            posted on this page with an updated revision date.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact our team via our{" "}
            <Link href="https://support.uniswap.org/hc/en-us/requests/new" className="text-blue-400 hover:text-blue-500">
              Help Center
            </Link>.
          </p>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-blue-400 hover:text-blue-500 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
