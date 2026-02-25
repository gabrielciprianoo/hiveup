import React from "react";
import { sileo } from "sileo";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

const defaultOptions = {
  roundness: 12,
};

export const toastSuccess = (title: string, description?: string) => {
  sileo.success({
    title,
    description: isMobile() ? undefined : description,
    ...defaultOptions,
    fill: "#059669",
    icon: <CheckCircle className="w-5 h-5" />,
    styles: {
      title: "!text-white !font-medium",
      description: "!text-white/80",
      badge: "!bg-white !text-emerald-600",
    },
  });
};

export const toastError = (title: string, description?: string) => {
  sileo.error({
    title,
    description: isMobile() ? undefined : description,
    ...defaultOptions,
    fill: "#DC2626",
    icon: <XCircle className="w-5 h-5" />,
    styles: {
      title: "!text-white !font-medium",
      description: "!text-white/80",
      badge: "!bg-white !text-red-600",
    },
  });
};

export const toastWarning = (title: string, description?: string) => {
  sileo.warning({
    title,
    description: isMobile() ? undefined : description,
    ...defaultOptions,
    fill: "#D97706",
    icon: <AlertTriangle className="w-5 h-5" />,
    styles: {
      title: "!text-white !font-medium",
      description: "!text-white/80",
      badge: "!bg-white !text-amber-600",
    },
  });
};

export const toastInfo = (title: string, description?: string) => {
  sileo.info({
    title,
    description: isMobile() ? undefined : description,
    ...defaultOptions,
    fill: "#2563EB",
    icon: <Info className="w-5 h-5" />,
    styles: {
      title: "!text-white !font-medium",
      description: "!text-white/80",
      badge: "!bg-white !text-blue-600",
    },
  });
};
