import { auth } from "@/auth";
import Unathorized from "@/components/errPages/Unathorized";
import UploadExcel from "@/components/ExcelUpload";

const Home = async () => {
  const session = await auth();

  if (session?.user.role !== "GLOBAL_ADMIN") {
    return <Unathorized />;
  }

  return (
    <div>
      <UploadExcel />
    </div>
  );
};

export default Home;
