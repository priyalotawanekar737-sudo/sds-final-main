import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import sdslogo from "../../assests/sdslogo.jpeg";

export default function Certificate({ donorName, donationTitle, onClose }) {
  const certificateRef = useRef(null);
  const today = new Date().toLocaleDateString();

  const downloadPDF = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("Smart-Donation-Certificate.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
        >
          ✕
        </button>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={downloadPDF}
          className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 z-10"
        >
          Download PDF
        </button>

        {/* CERTIFICATE BODY */}
        <div
          ref={certificateRef}
          className="p-10 md:p-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl text-white relative"
        >

          <div className="bg-white text-gray-800 rounded-lg p-8 md:p-14 shadow-inner">

            {/* CENTER LOGO SECTION (Replaced SD with Image) */}
            <div className="flex items-center justify-center mb-6">
              <img
                src={sdslogo}
                alt="Smart Donation Logo"
                className="h-20 w-20 object-contain rounded-full shadow-md"
              />
              <h2 className="text-2xl font-bold text-gray-800 ml-3">
                Smart Donation System
              </h2>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-6">
              Certificate of Appreciation
            </h1>

            <p className="text-center text-gray-600 mb-4">
              This certificate is proudly presented to
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6">
              {donorName}
            </h2>

            <p className="text-center text-gray-600 mb-4">
              In recognition of your generous contribution towards
            </p>

            <h3 className="text-xl font-medium text-center text-gray-800 mb-6">
              "{donationTitle}"
            </h3>

            <p className="text-center text-gray-600 mb-10">
              Your kindness and commitment to social impact are deeply appreciated.
            </p>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-10">
              <div>
                <p className="font-semibold text-gray-800">
                  Smart Donation System
                </p>
                <p className="text-sm text-gray-500">
                  Authorized Digital Signature
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {today}
                </p>
                <p className="text-sm text-gray-500">
                  Date Issued
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}