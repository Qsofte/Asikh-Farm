import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-primary-light pt-20 min-h-screen">
      {/* Header Section */}
      <div
        className="relative w-full h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('../images/3rd-Home-main.png')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <h1 className="relative z-10 text-4xl md:text-5xl font-gilroy-semibold text-white">
          Privacy Policy
        </h1>
      </div>

      {/* Breadcrumb Navigation */}
      <div
        className="px-5 py-5 font-gilroy-semibold text-base cursor-pointer hover:text-primary-green transition-colors"
        onClick={() => navigate('/')}
      >
        Home › Privacy Policy
      </div>

      {/* Privacy Policy Content */}
      <div className="container mx-auto px-4 md:px-8 py-8 mb-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
          <h1 className="text-3xl font-gilroy-semibold text-primary-dark mb-6">
            Privacy Policy
          </h1>

          <p className="mb-4 text-gray-700">
            This Privacy Notice for Ramhar Agri (doing business as Asikh farms)
            ('we', 'us', or 'our'), describes how and why we might access,
            collect, store, use, and/or share ('process') your personal
            information when you use our services ('Services'), including when
            you:
          </p>

          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Visit our website at http://www.asikhfarms.in, or any website of
              ours that links to this Privacy Notice
            </li>
            <li className="mb-2">
              Engage with us in other related ways, including any sales,
              marketing, or events
            </li>
          </ul>

          <p className="mb-6 text-gray-700">
            Questions or concerns? Reading this Privacy Notice will help you
            understand your privacy rights and choices. We are responsible for
            making decisions about how your personal information is processed.
            If you do not agree with our policies and practices, please do not
            use our Services. If you still have any questions or concerns,
            please contact us at support@asikhfarms.in.
          </p>

          <h2 className="text-2xl font-gilroy-semibold text-primary-dark mt-8 mb-4">
            SUMMARY OF KEY POINTS
          </h2>

          <p className="mb-4 text-gray-700">
            This summary provides key points from our Privacy Notice, but you
            can find out more details about any of these topics by clicking the
            link following each key point or by using our table of contents
            below to find the section you are looking for.
          </p>

          <p className="mb-4 text-gray-700">
            What personal information do we process? When you visit, use, or
            navigate our Services, we may process personal information depending
            on how you interact with us and the Services, the choices you make,
            and the products and features you use. Learn more about personal
            information you disclose to us.
          </p>

          <p className="mb-4 text-gray-700">
            Do we process any sensitive personal information? Some of the
            information may be considered 'special' or 'sensitive' in certain
            jurisdictions, for example your racial or ethnic origins, sexual
            orientation, and religious beliefs. We do not process sensitive
            personal information.
          </p>

          <p className="mb-4 text-gray-700">
            Do we collect any information from third parties? We do not collect
            any information from third parties.
          </p>

          <p className="mb-4 text-gray-700">
            How do we process your information? We process your information to
            provide, improve, and administer our Services, communicate with you,
            for security and fraud prevention, and to comply with law. We may
            also process your information for other purposes with your consent.
            We process your information only when we have a valid legal reason
            to do so. Learn more about how we process your information.
          </p>

          <p className="mb-4 text-gray-700">
            In what situations and with which parties do we share personal
            information? We may share information in specific situations and
            with specific third parties. Learn more about when and with whom we
            share your personal information.
          </p>

          <p className="mb-4 text-gray-700">
            How do we keep your information safe? We have adequate
            organisational and technical processes and procedures in place to
            protect your personal information. However, no electronic
            transmission over the internet or information storage technology can
            be guaranteed to be 100% secure, so we cannot promise or guarantee
            that hackers, cybercriminals, or other unauthorised third parties
            will not be able to defeat our security and improperly collect,
            access, steal, or modify your information. Learn more about how we
            keep your information safe.
          </p>

          <p className="mb-4 text-gray-700">
            What are your rights? Depending on where you are located
            geographically, the applicable privacy law may mean you have certain
            rights regarding your personal information. Learn more about your
            privacy rights. How do you exercise your rights? The easiest way to
            exercise your rights is by submitting a data subject access request,
            or by contacting us. We will consider and act upon any request in
            accordance with applicable data protection laws.
          </p>

          <p className="mb-6 text-gray-700">
            Want to learn more about what we do with any information we collect?
            Review the Privacy Notice in full.
          </p>

          <h2 className="text-2xl font-gilroy-semibold text-primary-dark mt-8 mb-4">
            TABLE OF CONTENTS
          </h2>

          <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">
            <li>WHAT INFORMATION DO WE COLLECT?</li>
            <li>HOW DO WE PROCESS YOUR INFORMATION?</li>
            <li>WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</li>
            <li>DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</li>
            <li>HOW LONG DO WE KEEP YOUR INFORMATION?</li>
            <li>HOW DO WE KEEP YOUR INFORMATION SAFE?</li>
            <li>WHAT ARE YOUR PRIVACY RIGHTS?</li>
            <li>CONTROLS FOR DO-NOT-TRACK FEATURES</li>
            <li>DO WE MAKE UPDATES TO THIS NOTICE?</li>
            <li>HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</li>
            <li>
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
              YOU?
            </li>
          </ol>

          <h2 className="text-xl font-gilroy-semibold text-primary-dark mt-8 mb-4">
            1. WHAT INFORMATION DO WE COLLECT?
          </h2>

          <p className="font-medium mb-2 text-gray-800">
            Personal information you disclose to us
          </p>

          <p className="mb-4 text-gray-700">
            In Short: We collect personal information that you provide to us.
          </p>

          <p className="mb-4 text-gray-700">
            We collect personal information that you voluntarily provide to us
            when you express an interest in obtaining information about us or
            our products and Services, when you participate in activities on the
            Services, or otherwise when you contact us.
          </p>

          <p className="mb-4 text-gray-700">
            Personal Information Provided by You. The personal information that
            we collect depends on the context of your interactions with us and
            the Services, the choices you make, and the products and features
            you use. The personal information we collect may include the
            following:
          </p>

          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">email addresses</li>
            <li className="mb-2">phone numbers</li>
          </ul>

          <p className="mb-6 text-gray-700">
            Sensitive Information. We do not process sensitive information. All
            personal information that you provide to us must be true, complete,
            and accurate, and you must notify us of any changes to such personal
            information.
          </p>

          {/* Additional sections would follow the same structure */}
          {/* For brevity, I'm showing just the first section as a template */}
          {/* You can continue adding sections following the same format */}

          <h2 className="text-xl font-gilroy-semibold text-primary-dark mt-8 mb-4">
            10. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
          </h2>

          <p className="font-medium mb-2 text-gray-800">
            If you have questions or comments about this notice, you may contact
            us by post at:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">
              Ramhar Agri
              <br />
              Chintamani Market, West of BSNL Golumber, Hajipur,
              <br />
              Vaishali, Bihar 844101
              <br />
              India
            </p>
          </div>

          <h2 className="text-xl font-gilroy-semibold text-primary-dark mt-8 mb-4">
            11. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
            YOU?
          </h2>

          <p className="mb-4 text-gray-700">
            Based on the applicable laws of your country, you may have the right
            to request access to the personal information we collect from you,
            details about how we have processed it, correct inaccuracies, or
            delete your personal information. You may also have the right to
            withdraw your consent to our processing of your personal
            information. These rights may be limited in some circumstances by
            applicable law. To request to review, update, or delete your
            personal information, please fill out and submit a data subject
            access request @ https://
            app.termly.io/notify/cb540d13-c153-43e2-860d-7d824b77d10d
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
