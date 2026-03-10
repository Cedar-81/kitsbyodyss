import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { OverviewAPI } from "../utils/api";
import { useKitStore, useOverviewStore, useUserStore } from "../utils/store/app_store";
import { addToast } from "@heroui/toast";
import { Tooltip } from "@heroui/react";

export default function Profile() {
    const { user } = useUserStore();
    const { id } = useParams();
    const navigate = useNavigate();
    const { overviewList, setOverviewList } = useOverviewStore();
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    //retrieve all overviews
    const fetchKit = async () => {
      if (id) {
        try {
          const res = await OverviewAPI.getByUser(id);
          setOverviewList(res.data || []);
          console.log("overviews: ", res);
          setLoading(false);
        } catch (err) {
          console.error("Failed to fetch overviews", err);
          addToast({ title: "Failed to fetch kits!", color: "danger" });
          setLoading(false);
        }
      }
    };
    
    fetchKit();
  }, [id, setOverviewList]);

  const { populateKitForm, setIsUpdating, setCurrentKitId, kitFormData} = useKitStore();
  const { setOverview, overview} = useOverviewStore();
  
    const handleEdit = async (id: string) => {
      const overviewData = await fetchOverview(id);
      if(!overviewData || !overviewData.id) return addToast({ title: "Couldn't retreive selected overview!", color: "danger" });
      console.log("fetched overview for edit: ", overview);
      populateKitForm({
        user_id: id,
        name: overviewData.title,
        access_price: overviewData.price,
        trip_price: overviewData.budget,
        budget_currency_code: overviewData.budget_currency_code,
        access_currency_code: overviewData.price_currency_code,
        location: overviewData.location,
        trip_duration: overviewData.duration,
        trip_duration_time_frame: overviewData.duration_time_frame,
        description: overviewData.overview,
        main_image: overviewData.main_image,
        images: overviewData.images || [], 
      });
      console.log("populated form data: ", kitFormData);
      setCurrentKitId(overviewData.id);
      setIsUpdating(true);
      navigate(`/profile/${id}/new-kit`);
    };

    const fetchOverview = async (kit_id: string) => {
      if (!kit_id) return;
      // console.log("fetching overview with id: ", kit_id);
      try {
        const res = await OverviewAPI.getById(kit_id);
        setOverview(res.data);
        console.log("overview", res);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch overview", err);
      }
    };

    const handleDelete = async (overview_id: string) => {
        addToast({title: "Deleting accommodation...", color: "primary"})
        const res = await OverviewAPI.delete(overview_id)
    
        if(res.error) {
          addToast({title: "Couldn't delete overview!", color: "danger"})
        }else {
          addToast({title: "Overview deleted successfully.", color: "success"})
        }
    }

    if(loading) {
        return (
        <div className='flex items-center justify-center w-full h-screen'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
        );
    }

    if(!overviewList || overviewList.length == 0) {
      <div className='flex items-center justify-center w-full h-screen'>
        hello world
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="60" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/></path><path fill="currentColor" d="M12 16c-2.59 0 -4.85 1.21 -6.06 3l6.06 2l6.06 -2c-1.21 -1.79 -3.47 -3 -6.06 -3Z" opacity="0"><set fill="freeze" attributeName="opacity" begin="0.6s" to="1"/><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.4s" values="M12 21c-2.59 0 -4.85 -0.21 -6.06 -2l6.06 2l6.06 -2c-1.21 1.79 -3.47 2 -6.06 2Z;M12 16c-2.59 0 -4.85 1.21 -6.06 3l6.06 2l6.06 -2c-1.21 -1.79 -3.47 -3 -6.06 -3Z"/></path><circle cx="12" cy="12" r="1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" opacity="0"><set fill="freeze" attributeName="opacity" begin="1.1s" to="1"/><animate fill="freeze" attributeName="r" begin="1.1s" dur="0.2s" values="0;1"/></circle><g fill="currentColor"><circle cx="7" cy="12" transform="rotate(15 12 12)"><animate fill="freeze" attributeName="r" begin="0.9s" dur="0.2s" to="1"/></circle><circle cx="7" cy="12" transform="rotate(65 12 12)"><animate fill="freeze" attributeName="r" begin="0.95s" dur="0.2s" to="1"/></circle><circle cx="7" cy="12" transform="rotate(115 12 12)"><animate fill="freeze" attributeName="r" begin="1s" dur="0.2s" to="1"/></circle><circle cx="7" cy="12" transform="rotate(165 12 12)"><animate fill="freeze" attributeName="r" begin="1.05s" dur="0.2s" to="1"/></circle></g><path fill="none" stroke="currentColor" stroke-dasharray="8" stroke-dashoffset="8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12h-5.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.3s" dur="0.2s" to="0"/><animateTransform fill="freeze" attributeName="transform" begin="1.5s" dur="0.2s" type="rotate" values="0 12 12;15 12 12"/></path></svg>
      </div>
    }

  return (
    <div className="p-5 md:px-12 space-y-5 w-full">

        {/* <div className="flex gap-4">
          <div className="size-20 rounded-full bg-gray-300"></div>
          <div>
            <h1 className="text-2xl font-semibold text-black/80">Username</h1>
          </div>
        </div> */}

        <div className="w-full flex items-center justify-between pb-2">
          <h1 className="text-xl font-semibold text-black/80">Kits by Username</h1>
          <Link to={"new-kit"}>
            <button className="size-8 md:w-max md:h-11 md:px-4 font-medium cursor-pointer md:gap-2 rounded-full flex items-center justify-center py-2 bg-brand/40 text-brand">
              <svg className="size-4" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M12 5V19" stroke="#E03E1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span className="hidden md:flex">Create new kit</span>
          </button>
          </Link>
        </div>

        {overviewList.length !== 0 ? <div className="grid grid-cols-2 md:grid-cols-5 w-full justify-between gap-4">
            {overviewList.map((overview) => (
                <div onClick={() => navigate(`/${overview.id}`)} key={overview.id} className="space-y-2 relative w-full"> 
                    <div className="h-40 md:h-72 w-full bg-brand/10 rounded-lg shadow-lg">
                      {user?.id == overview.user_id && <div className="flex items-center absolute right-2 top-2 justify-center gap-2">
                        <Tooltip content="edit kit">
                          <button onClick={(e) => {e.stopPropagation(); handleEdit(overview.id ? overview.id : '')}} className="size-8  bg-white/80 hover:bg-white rounded-full flex items-center justify-center">
                            <svg className="size-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.0001 20.9999H21.0001M15.0001 4.99989L19.0001 8.99989M21.1741 6.81189C21.7028 6.28332 21.9998 5.56636 21.9999 4.81875C22 4.07113 21.7031 3.3541 21.1746 2.82539C20.646 2.29668 19.929 1.99961 19.1814 1.99951C18.4338 1.99942 17.7168 2.29632 17.1881 2.82489L3.84206 16.1739C3.60988 16.4054 3.43817 16.6904 3.34206 17.0039L2.02106 21.3559C1.99521 21.4424 1.99326 21.5342 2.01541 21.6217C2.03756 21.7092 2.08298 21.7891 2.14685 21.8529C2.21073 21.9167 2.29068 21.962 2.37821 21.984C2.46575 22.006 2.55762 22.0039 2.64406 21.9779L6.99706 20.6579C7.31023 20.5626 7.59523 20.392 7.82706 20.1609L21.1741 6.81189Z" stroke="#E03E1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </button>
                        </Tooltip>
                        <Tooltip content="create new kit">
                          <button onClick={(e) => {e.stopPropagation(); handleDelete(overview.id ? overview.id : '')}} className="size-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center">
                            <svg className="size-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M3 6H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="red" stroke-opacity="0.81" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </button>
                        </Tooltip>
                      </div>}
                        {overview.main_image ? <img src={overview.main_image} alt="Overview Image" className="h-full w-full object-cover rounded-lg" /> : <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>}
                    </div>
                    <h2 className="text-base font-semibold text-black/70 leading-5 md:text-lg line-clamp-2">{overview.title}</h2>
                </div>
            ))}
        </div> :
            <div className="h-[70%] w-full flex justify-center items-center">
              <div className="text-center space-y-2 w-[80%] mx-auto text-brand/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-20 mx-auto" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="60" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/></path><path fill="currentColor" d="M12 16c-2.59 0 -4.85 1.21 -6.06 3l6.06 2l6.06 -2c-1.21 -1.79 -3.47 -3 -6.06 -3Z" opacity="0"><set fill="freeze" attributeName="opacity" begin="0.6s" to="1"/><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.4s" values="M12 21c-2.59 0 -4.85 -0.21 -6.06 -2l6.06 2l6.06 -2c-1.21 1.79 -3.47 2 -6.06 2Z;M12 16c-2.59 0 -4.85 1.21 -6.06 3l6.06 2l6.06 -2c-1.21 -1.79 -3.47 -3 -6.06 -3Z"/></path><circle cx="12" cy="12" r="1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" opacity="0"><set fill="freeze" attributeName="opacity" begin="1.1s" to="1"/><animate fill="freeze" attributeName="r" begin="1.1s" dur="0.2s" values="0;1"/></circle><g fill="currentColor"><circle cx="7" cy="12" transform="rotate(15 12 12)"><animate fill="freeze" attributeName="r" begin="0.9s" dur="0.2s" to="1"/></circle><circle cx="7" cy="12" transform="rotate(65 12 12)"><animate fill="freeze" attributeName="r" begin="0.95s" dur="0.2s" to="1"/></circle><circle cx="7" cy="12" transform="rotate(115 12 12)"><animate fill="freeze" attributeName="r" begin="1s" dur="0.2s" to="1"/></circle><circle cx="7" cy="12" transform="rotate(165 12 12)"><animate fill="freeze" attributeName="r" begin="1.05s" dur="0.2s" to="1"/></circle></g><path fill="none" stroke="currentColor" stroke-dasharray="8" stroke-dashoffset="8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12h-5.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.3s" dur="0.2s" to="0"/><animateTransform fill="freeze" attributeName="transform" begin="1.5s" dur="0.2s" type="rotate" values="0 12 12;15 12 12"/></path></svg>
                <h1 className="lg:text-lg font-semibold">Woah... such emptiness! Click the + button above to start a new kit</h1>
              </div>
            </div>
        }

        {/* <button onClick={handleGoogleLogout} className="w-full flex items-center justify-center text-brand/80 text-sm">
          <svg className="h-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17L15 12M15 12L10 7M15 12H3M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="#E03E1A" stroke-opacity="0.85" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p className="">Logout</p>
        </button> */}
    </div>
  )
}
