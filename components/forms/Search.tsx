"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "@/components/data-table";
import { userColumns, ipColumns } from "@/components/column";
import { RefreshCcwIcon } from "lucide-react";
import AddSheet from "./addSheet";

interface Props {
  endpoint: string;
  cols?: string;
  filterTarget: string;
  filterPlaceholder: string;
}

const Search = ({ endpoint, cols, filterTarget, filterPlaceholder }: Props) => {
  const [searchUsers, setSearchUsers] = useState([]);
  const [rotation, setRotation] = useState(0);

  // Function to toggle the visibility of the popup

  // // const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // const interval = setInterval(() => {
    //   users(); // Call the users function
    // }, 30000);
    users();

    // Clean up the interval on component unmount
    // return () => clearInterval(interval);

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
    setRotation(rotation + 360);
  };

  return (
    <div className="w-screen flex justify-center items-center flex-col gap-20 z-0">
      <div className="flex flex-col gap-2">
        <div className="flex  gap-2">
          <div className="flex-1">
            <AddSheet onCreation={users} />
          </div>
          <div className="flex flex-1 items-center justify-end w-full ">
            <RefreshCcwIcon
              className="transform transition-transform cursor-pointer  ease-out duration-500"
              style={{
                transform: `rotate(-${rotation}deg)`,
                transition: "transform 0.5s ease-out",
              }}
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
          table={cols === "ip" ? "ip" : "user"}
        />
      </div>
    </div>
  );
};

export default Search;
