/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

export const ConfirmModal = ({ onCancel, onConfirm, showModal }) => {
  const cancelButtonRef = useRef(null);
  useEffect(() => {
    // Focus on the cancel button when the modal is shown
    if (showModal) {
      cancelButtonRef.current.focus();
    }
  }, [showModal]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg w-full max-w-[500px]">
        <h3 className="text-2xl font-semibold text-zinc-50 mb-2">
          Are you sure?
        </h3>
        <p className="text-zinc-300">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </p>
        <ul className="flex justify-end gap-3 mt-4">
          <li>
            <button
              ref={cancelButtonRef}
              onClick={onCancel}
              className="py-2 px-4 bg-zinc-900 border border-zinc-700 text-zinc-50 rounded-md"
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-zinc-50 text-zinc-900 font-semibold rounded-md text-sm md:text-base"
            >
              Confirm
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
