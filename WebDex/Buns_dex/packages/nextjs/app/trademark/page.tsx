
import React from "react";
import Link from "next/link";

const TrademarkPolicyPage = () => {
  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-white">
          Trademark Policy
        </h1>

        <p className="mb-6 text-gray-300">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 leading-relaxed text-gray-300">
          <p>
            The <strong>BlockheaderWeb3</strong> name, logo, and related marks
            are trademarks owned by our organization. This policy outlines
            proper use of our brand assets.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">
            1. Proper Use
          </h2>
          <p>
            You may use the BlockheaderWeb3 trademarks to reference or link to
            our products, provided such use does not imply endorsement,
            partnership, or official association.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">
            2. Restricted Use
          </h2>
          <ul className="list-disc ml-6 mt-2">
            <li>Do not alter, distort, or modify our logos or trademarks.</li>
            <li>
              Do not use our trademarks in product names, domains, or marketing
              materials without explicit written consent.
            </li>
            <li>
              Do not use our marks in a way that misleads users about ownership
              or official affiliation.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8">
            3. Brand Assets
          </h2>
          <p>
            You can access official brand materials and usage guidelines on our{" "}
            <Link
              href="https://github.com/Olorunshogo/WebDex"
              className="text-blue-400 hover:text-blue-500"
            >
              GitHub repository
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">
            4. Reporting Misuse
          </h2>
          <p>
            If you discover unauthorized or confusing use of our trademarks,
            please notify us at{" "}
            <Link
              href="mailto:support@blockheaderweb3.io"
              className="text-blue-400 hover:text-blue-500"
            >
              support@blockheaderweb3.io
            </Link>
            .
          </p>

          <h2 className="text-xl font-semibold text-white mt-8">
            5. Updates to This Policy
          </h2>
          <p>
            We reserve the right to update this Trademark Policy as needed. Any
            changes will take effect once published on this page.
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-500 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrademarkPolicyPage;
