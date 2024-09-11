import { getServerSession } from "next-auth/next";
import { authOptions } from "../../_lib/auth";
import Unauthorized from "../../_components/unauthorized";
import ManageBarbershopContent from "./ManageBarbershopContent";
export default async function ManageBarbershop() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <Unauthorized />;
    }
    return <ManageBarbershopContent />;
}
