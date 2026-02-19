const steps = ["pending", "accepted", "assigned", "completed"];

export default function DonationTracker({ status }) {
  const currentStep = steps.indexOf(status);

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Pending</span>
        <span>Accepted</span>
        <span>Assigned</span>
        <span>Completed</span>
      </div>

      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`h-2 w-full rounded ${
                index <= currentStep
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
            {index !== steps.length - 1 && (
              <div className="w-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
