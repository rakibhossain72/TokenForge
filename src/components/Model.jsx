import React from "react";
import { Loader2, X, CheckCircle, XCircle } from "lucide-react";

export function Model({ isOpen, onClose, message, status, txHash }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900">
          {status === "loading"
            ? "Processing..."
            : status === "success"
            ? "Success!"
            : "Error"}
        </h3>
        <div className="flex flex-col items-center gap-4 pt-4">
          {status === "loading" && (
            <Loader2 className="animate-spin w-10 h-10 text-cyan-500" />
          )}
          {status === "success" && (
            <CheckCircle className="w-10 h-10 text-green-500" />
          )}
          {status === "error" && <XCircle className="w-10 h-10 text-red-500" />}
          {status === "success" ? (
            <p className="mt-2 text-sm text-gray-500">
            <a
              href={`https://alfajores.celoscan.io//tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 underline"
            >
              View on Celoscan
            </a>
          </p>
          ) : (
            <p className="text-gray-900 text-center">{message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
