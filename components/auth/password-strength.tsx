import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "At least one uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "At least one symbol (!@#$%^&*...)",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const strengthScore = requirements.filter((req) => req.met).length;
  const strengthColors = {
    0: "text-red-500",
    1: "text-red-500",
    2: "text-yellow-500",
    3: "text-green-500",
  };

  const strengthLabels = {
    0: "Very Weak",
    1: "Weak",
    2: "Good",
    3: "Strong",
  };

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm">Password strength:</span>
        <span
          className={`text-sm font-medium ${
            strengthColors[strengthScore as keyof typeof strengthColors]
          }`}
        >
          {strengthLabels[strengthScore as keyof typeof strengthLabels]}
        </span>
      </div>

      <div className="flex space-x-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${
              level <= strengthScore
                ? strengthScore === 1
                  ? "bg-red-500"
                  : strengthScore === 2
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <ul className="space-y-1">
        {requirements.map((requirement, index) => (
          <li key={index} className="flex items-center space-x-2 text-xs">
            {requirement.met ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
            <span
              className={requirement.met ? "text-green-600" : "text-gray-500"}
            >
              {requirement.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
