"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "@/components/table/data-table";
import { userColumns, ipColumns } from "@/components/table/column";
import AddUserPopup from "./addUserForm";
import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";

interface Props {
  endpoint: string;
  cols?: string;
  filterTarget: string;
  filterPlaceholder: string;
}

const Search = ({ endpoint, cols, filterTarget, filterPlaceholder }: Props) => {
  const [searchUsers, setSearchUsers] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  // Function to toggle the visibility of the popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    users();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const users = async () => {
    try {
      const res = await axios.get(endpoint);
      setSearchUsers(res.data);

      return res.data;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  };

  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  return (
    <div className="w-screen flex justify-center items-center flex-col gap-20 z-0">
      <div className="flex flex-col gap-2">
        <div className="flex  gap-2">
          {isPopupOpen && (
            <AddUserPopup onClose={togglePopup} onCreation={users} />
          )}
          <div className="flex-1">
            <Button variant="outline" onClick={togglePopup}>
              + Add User
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-end w-full ">
            <RefreshCcwIcon
              className={`transform transition-transform cursor-pointer  ease-out duration-500 ${
                !isRotated ? "rotate-[360deg]" : ""
              }`}
              onClick={() => {
                users();
                toggleRotation();
              }}
            />
          </div>
        </div>
        <DataTable
          filterPlaceholder={filterPlaceholder}
          filterTarget={filterTarget}
          data={searchUsers}
          // @ts-ignore
          columns={cols === "ip" ? ipColumns : userColumns}
        />
      </div>
    </div>
  );
};

export default Search;
