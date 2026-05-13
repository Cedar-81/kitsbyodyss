import { useNavigate, useParams } from "react-router-dom";
import TransportationCard from "../components/transportation_card";
import { useEffect, useState } from "react";
import { OverviewAPI, TransportationAPI } from "../utils/api";
import { addToast } from "@heroui/toast";
import { useTransportationStore, useProfileStore } from "../utils/store/app_store";

export default function Transportation() {
    const { id, user_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const navigate = useNavigate();
    const { setIsUpdating, setCurrentTransportationId } = useTransportationStore();
    const { profile } = useProfileStore()
    const [transportationList, setTransportationList] = useState<any[]>([]);

    // Owner of the overview (kit)
    const [overviewOwnerId, setOverviewOwnerId] = useState<string | null>(null);

    // Fetch overview owner and check authorization
    useEffect(() => {
        async function fetchOverviewOwner() {
            if (!id) return;
            const res = await OverviewAPI.getById(id);
            if (res.data) {
                const kitOwnerId = res.data.user_id;
                const kitPublished = res.data.published;
                setOverviewOwnerId(kitOwnerId);

                const isOwner = profile?.user_id === kitOwnerId;
                const routeMatchesOwner = user_id === kitOwnerId;
                const canView = kitPublished || isOwner;

                if (!routeMatchesOwner) {
                    if (canView) {
                        navigate(`/${kitOwnerId}/${id}/transportation`, { replace: true });
                        return;
                    }
                    setAuthorized(false);
                    setLoading(false);
                    return;
                }

                setAuthorized(canView);
                setLoading(false);
            }
        }
        fetchOverviewOwner();
    }, [id, profile?.user_id, user_id, navigate]);

    useEffect(() => {
        if (!authorized) return; // Don't fetch if not authorized
        setLoading(true);
        //fetch transportation list for this overview
        const fetchTransportations = async () => {
            try {
                const res = await TransportationAPI.getByOverview(id!);
                setTransportationList(res.data || []);
                setLoading(false);
                console.log("transportation: ", res);
            } catch (err) {
                addToast({title: "Failed to fetch transport items!", color: "danger" });
                setLoading(false);
                console.error("Failed to fetch transport items", err);
            }
        };
        fetchTransportations();
    }, [id, authorized]);

    const handleCreate = () => {
        setIsUpdating(false);
        setCurrentTransportationId(null);
        
        //navigate to create transportation page
        navigate(`/${user_id}/${id}/new-transportation`);
    }

    if(loading) {
        return (
        <div className='flex items-center justify-center w-full h-screen'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
        );
    }

    if (!authorized) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <div className="text-center space-y-2 w-[80%] mx-auto text-brand/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-20 mx-auto" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeDasharray="60" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"></path><path fill="currentColor" d="M12 16c-2.59 0 -4.85 1.21 -6.06 3l6.06 2l6.06 -2c-1.21 -1.79 -3.47 -3 -6.06 -3Z" opacity="0"></path></svg>
                    <h1 className="lg:text-lg font-semibold">You don't have access to this kit. Only the owner or users who have purchased access can view it.</h1>
                </div>
            </div>
        );
    }
    console.log("some data: ", profile?.user_id, user_id)

    const canCreate = profile ? (profile.user_id === overviewOwnerId) : false;
    
  return (
    <div className="w-full p-5 md:px-12 space-y-4">
        {canCreate && <div className="w-full bg-gray-50 sticky top-0 py-3 z-10">
            <div onClick={handleCreate} className="size-9 text-white rounded-full mx-auto flex items-center justify-center bg-brand">
                <svg width="24" className="size-4" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>}

        {transportationList.length !== 0 ? <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {transportationList.map((transportation) => (
                <TransportationCard key={transportation.id} transportation={transportation} />
            ))}
        </div> :
            <div className="h-[70%] w-full flex justify-center items-center">
              <div className="text-center space-y-2 w-[80%] mx-auto text-brand/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-20 mx-auto" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="60" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/></path><path fill="currentColor" d="M12 16c-2.59 0 -4.85 1.21 -6.06 3l6.06 2l6.06 -2c-1.21 -1.79 -3.47 -3 -6.06 -3Z" opacity="0"><set fill="freeze" attributeName="opacity" begin="0.6s" to="1"/><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.4s" values="M12 21c-2.59 0 -4.85 -0.21 -6.06 -2l6.06 2l6.06 -2c-1.21 1.79 -3.47 2 -6.06 2Z;M12 16c-2.59 0 -4.85 1.21 -6.06 3l6.06 2l6.06 -2c-1.21 -1.79 -3.47 -3 -6.06 -3Z"/></path><circle cx="12" cy="12" r="1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" opacity="0"><set fill="freeze" attributeName="opacity" begin="1.1s" to="1"/><animate fill="freeze" attributeName="r" begin="1.1s" dur="0.2s" values="0;1"/></circle><g fill="currentColor"><circle cx="7" cy="12" transform="rotate(15 12 12)"><animate fill="freeze" attributeName="r" begin="0.9s" dur="0.2s" to="1"/></circle><circle cx="7" cy="12" transform="rotate(65 12 12)"><animate fill="freeze" attributeName="r" begin="0.95s" dur="0.2s" to="1"/></circle><circle cx="7" cy="12" transform="rotate(115 12 12)"><animate fill="freeze" attributeName="r" begin="1s" dur="0.2s" to="1"/></circle><circle cx="7" cy="12" transform="rotate(165 12 12)"><animate fill="freeze" attributeName="r" begin="1.05s" dur="0.2s" to="1"/></circle></g><path fill="none" stroke="currentColor" stroke-dasharray="8" stroke-dashoffset="8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12h-5.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.3s" dur="0.2s" to="0"/><animateTransform fill="freeze" attributeName="transform" begin="1.5s" dur="0.2s" type="rotate" values="0 12 12;15 12 12"/></path></svg>
                <h1 className="lg:text-lg font-semibold">Woah... such emptiness! Click the + button above to create your first transportation item.</h1>
              </div>
            </div>
        }
    </div>
  )
}
