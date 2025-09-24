"use client";
import React from "react";
import styles from "./privacy-policy.module.css";
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-orange-200">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          <strong>Effective Date:</strong> 24/09/2025
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            1. Information We Collect
          </h2>
          <p>
            We may collect your name, mobile number, email, and address when you
            book a ride. This information is only used to provide taxi booking
            and related services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To confirm bookings and provide our services.</li>
            <li>To contact you regarding your ride.</li>
            <li>
              We <strong>do not sell or share</strong> your information with any
              third party.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            3. Security
          </h2>
          <p>
            We take appropriate steps to keep your information safe. If online
            payments are enabled, they are always processed through secure
            gateways.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            4. Cookies
          </h2>
          <p>
            Our website may use cookies to improve your browsing experience. You
            may disable cookies in your browser if you prefer.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            5. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. The updated
            version will always be available on our website/app.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-orange-500 mb-2">
            6. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              📧 Email:{" "}
              <a
                href="mailto:onlinetaxi09@gmail.com"
                className="text-orange-600 underline"
              >
                onlinetaxi09@gmail.com
              </a>
            </li>
            <li>📞 Phone: +91 9988-2222-83</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
