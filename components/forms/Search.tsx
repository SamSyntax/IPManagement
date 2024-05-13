"use client";

import { ipColumns, userColumns } from "@/components/column";
import { DataTable } from "@/components/data-table";
import { useGlobalState } from "@/providers/global-state";
import axios from "axios";
import { RefreshCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ExportData from "../ExportData";
import AddSheet from "./addSheet";

interface Props {
  endpoint: string;
  cols?: string;
  filterTarget: string;
  filterPlaceholder: string;
}

const Search = ({ endpoint, cols, filterTarget, filterPlaceholder }: Props) => {
  const [searchUsers, setSearchUsers] = useState<any>([]);
  const [rotation, setRotation] = useState(0);

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

  const { isFetched } = useGlobalState();

  if (isFetched) {
    users();
  }
  const toggleRotation = () => {
    setRotation(rotation + 360);
  };

  return (
    <div className="w-full flex justify-center items-start flex-col gap-20 z-1">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex  gap-2">
          <div className="flex-1 flex gap-2">
            <AddSheet type="add" />
            <ExportData />
          </div>
          <div className="flex flex-1 items-center justify-end w-full ">
            <RefreshCcwIcon
              className="transform transition-transform cursor-pointer  ease-out duration-500 z-1"
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
          tableType={cols === "ip" ? "ip" : "user"}
        />
      </div>
    </div>
  );
};

export default Search;
