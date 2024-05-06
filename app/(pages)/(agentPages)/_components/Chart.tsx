import { prisma } from "@/lib/db";
import { BarChart, Card, Title } from "@tremor/react";

interface Props {
  agentId: string;
}

const Chart = async ({ agentId }: Props) => {
  const data = await prisma.action.findMany({
    where: {
      agentId: agentId,
    },
    select: {
      actionType: true,
      createdAt: true,
    },
  });

  const chartdata = [
    {
      name: "Amphibians",
      "Number of threatened species": 2488,
    },
    {
      name: "Birds",
      "Number of threatened species": 1445,
    },
    {
      name: "Crustaceans",
      "Number of threatened species": 743,
    },
    {
      name: "Ferns",
      "Number of threatened species": 281,
    },
    {
      name: "Arachnids",
      "Number of threatened species": 251,
    },
    {
      name: "Corals",
      "Number of threatened species": 232,
    },
    {
      name: "Algae",
      "Number of threatened species": 98,
    },
  ];

  const dataSet: any = [];

  {
    data.map((action) => dataSet.push(action));
  }

  return (
    <div className=" w-full h-full">
      <Card>
        <Title>Chart</Title>

        <BarChart
          className="h-80"
          data={chartdata}
          index="name"
          categories={["Number of threatened species"]}
          colors={["blue"]}
          yAxisWidth={48}
        />
      </Card>
    </div>
  );
};

export default Chart;
