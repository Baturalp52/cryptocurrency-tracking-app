"use client";

import { useState } from "react";
import { Search, XCircle } from "lucide-react";

interface UserSearchBarProps {
  onSearch: (term: string) => void;
}

export default function UserSearchBar({ onSearch }: UserSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="d-flex align-items-center w-100 mb-3">
      <Search size={20} className="text-muted" />
      <input
        type="text"
        className="form-control border-0 shadow-none flex-fill mx-2"
        placeholder="Search users by name or email"
        value={searchTerm}
        onChange={handleChange}
      />
      {searchTerm && (
        <button
          type="button"
          className="btn btn-link p-0 text-muted me-2"
          onClick={() => {
            setSearchTerm("");
            onSearch("");
          }}
        >
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
}
