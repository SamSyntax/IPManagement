"use client";

import PageLoading from "@/app/(pages)/(ipActions)/ipAddresses/loading";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./column";
import { DataTable } from "./data-table";

const ActionsTable = ({ id }: { id: string }) => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const actions = await axios.post("/api/getAgentActions", {
          agentId: id.toString(),
        });
        setData(actions.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="h-full overflow-hidden">
      {isLoading ? (
        <PageLoading />
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default ActionsTable;
