import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { OverviewAPI } from "../utils/api";
import {  useOverviewStore, useUserStore } from "../utils/store/app_store";
import { addToast } from "@heroui/toast";

export default function Overview() {
  const { id } = useParams();
  const { overview, setOverview } = useOverviewStore();
  const [isPublished, setIsPublished] = useState(false);
  const { user } = useUserStore();
  console.log("overview from store: ", overview, " published: ", isPublished);

  useEffect(() => {
    //retrieve all overviews
    fetchOverview();
  }, [id, setOverview, isPublished]);
  
  const fetchOverview = async () => {
    if (id) {
      try {
        const res = await OverviewAPI.getById(id);
        setOverview(res.data);
        setIsPublished(res.data.published)
        console.log("overview", res);
      } catch (err) {
        console.error("Failed to fetch overview", err);
      }
    }
  };

  const handlePublish = async () => {
    addToast({ title: "Publishing kit...", color: "primary" });
    if(!overview || !overview.id || !id) return;
    const res = await OverviewAPI.update(id, { user_id: user?.id, published: true })  
    console.log("publish res: ", res);
    
    if(res.error) {
      addToast({ title: "Failed to publish kit!", color: "danger" });
    } else {
      addToast({ title: "Kit is now public!", color: "success" });
      setIsPublished(true);
    }
  }

  const handleUnPublish = async () => {
    addToast({ title: "Unpublishing kit...", color: "primary" });
    if(!overview || !overview.id || !id) return;
    const res = await OverviewAPI.update(id, { user_id: user?.id, published: false })  
    console.log("unpublish res: ", res);
    
    if(res.error) {
      addToast({ title: "Failed to unpublish kit!", color: "danger" });
    } else {
      setIsPublished(false);
      addToast({ title: "Kit is no longer public!", color: "success" });
    }
  }

  const handleCopy = async () => {
    try {
      addToast({ title: "Copying kit...", color: "primary" });

      const url = window.location.href; 
      await navigator.clipboard.writeText(url);

      addToast({ title: "Kit link copied!", color: "success" });
    } catch (err) {
      console.error(err);
      addToast({ title: "Failed to copy", color: "danger" });
    }
  };

  if(!overview) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }


  return (
    <div className="w-full p-5 md:px-12 space-y-8 md:flex md:gap-16">
      <div className="w-full md:w-1/2 space-y-4">
        <div className="h-60 md:h-full w-full object-cover rounded-lg md:rounded-2xl overflow-clip bg-gray-200">
          {overview.main_image ? <img src={overview.main_image} alt="Overview Image" className="h-full w-full object-cover rounded-lg" /> : <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>}
        </div>
        {/* <div className="grid grid-cols-3 gap-2">
          <div className="h-20 w-full object-cover rounded-lg bg-gray-200">
            {overview.image[0] ? <img src={overview.image[0]} alt="Overview Image" className="h-full w-full object-cover rounded-lg" /> : <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>}
          </div>
          <div className="h-20 w-full object-cover rounded-lg bg-gray-200">
            {overview.image[1] ? <img src={overview.image[1]} alt="Overview Image" className="h-full w-full object-cover rounded-lg" /> : <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>}
          </div>
          <div className="h-20 w-full object-cover rounded-lg bg-gray-200">
            {overview.image[2] ? <img src={overview.image[2]} alt="Overview Image" className="h-full w-full object-cover rounded-lg" /> : <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>}
          </div>
        </div> */}
      </div>



      <div className="space-y-5 md:w-1/2 md:py-5">
        <div className="space-y-2 md:w-[70%]">
          <h1 className="text-2xl md:text-4xl font-bold">{overview?.title}</h1>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex gap-2 items-center">
              <svg width="20" height="20" className="opacity-80" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1.6665C6.33337 1.6665 3.33337 4.6665 3.33337 8.33317C3.33337 12.8332 9.16671 17.9165 9.41671 18.1665C9.58337 18.2498 9.83337 18.3332 10 18.3332C10.1667 18.3332 10.4167 18.2498 10.5834 18.1665C10.8334 17.9165 16.6667 12.8332 16.6667 8.33317C16.6667 4.6665 13.6667 1.6665 10 1.6665ZM10 16.4165C8.25004 14.7498 5.00004 11.1665 5.00004 8.33317C5.00004 5.58317 7.25004 3.33317 10 3.33317C12.75 3.33317 15 5.58317 15 8.33317C15 11.0832 11.75 14.7498 10 16.4165ZM10 4.99984C8.16671 4.99984 6.66671 6.49984 6.66671 8.33317C6.66671 10.1665 8.16671 11.6665 10 11.6665C11.8334 11.6665 13.3334 10.1665 13.3334 8.33317C13.3334 6.49984 11.8334 4.99984 10 4.99984ZM10 9.99984C9.08337 9.99984 8.33337 9.24984 8.33337 8.33317C8.33337 7.4165 9.08337 6.6665 10 6.6665C10.9167 6.6665 11.6667 7.4165 11.6667 8.33317C11.6667 9.24984 10.9167 9.99984 10 9.99984Z" fill="black"/> 
              </svg>
              <p className="text-sm font-medium">{overview.location}</p>
            </div>
            <div className="flex gap-2 items-center">
              <svg width="20" height="20" className="opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7V4C19 3.73478 18.8946 3.48043 18.7071 3.29289C18.5196 3.10536 18.2652 3 18 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5M3 5C3 5.53043 3.21071 6.03914 3.58579 6.41421C3.96086 6.78929 4.46957 7 5 7H20C20.2652 7 20.5196 7.10536 20.7071 7.29289C20.8946 7.48043 21 7.73478 21 8V12M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V16M21 12H18C17.4696 12 16.9609 12.2107 16.5858 12.5858C16.2107 12.9609 16 13.4696 16 14C16 14.5304 16.2107 15.0391 16.5858 15.4142C16.9609 15.7893 17.4696 16 18 16H21M21 12C21.2652 12 21.5196 12.1054 21.7071 12.2929C21.8946 12.4804 22 12.7348 22 13V15C22 15.2652 21.8946 15.5196 21.7071 15.7071C21.5196 15.8946 21.2652 16 21 16" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <p className="text-sm font-medium">{overview.budget} {overview.budget_currency_code}</p>
            </div>
            <div className="flex gap-2 items-center">
              <svg width="20" height="20" className="opacity-80" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.14589 2.50162C9.19467 2.7171 9.15589 2.94314 9.03806 3.13004C8.92024 3.31693 8.73302 3.44939 8.51756 3.49829C8.35404 3.53549 8.19198 3.57886 8.03172 3.62829C7.92716 3.66057 7.81726 3.67194 7.7083 3.66175C7.59934 3.65156 7.49345 3.62001 7.39669 3.5689C7.29992 3.51779 7.21417 3.44812 7.14433 3.36387C7.07449 3.27962 7.02192 3.18243 6.98964 3.07787C6.95736 2.9733 6.94599 2.8634 6.95618 2.75444C6.96636 2.64548 6.99792 2.5396 7.04903 2.44283C7.10014 2.34607 7.16981 2.26031 7.25406 2.19047C7.33831 2.12063 7.43549 2.06807 7.54006 2.03579C7.74006 1.97356 7.94284 1.9194 8.14839 1.87329C8.25515 1.84901 8.36564 1.84601 8.47356 1.86445C8.58147 1.88289 8.6847 1.92242 8.77733 1.98077C8.86997 2.03912 8.9502 2.11515 9.01344 2.20452C9.07668 2.29389 9.12168 2.39485 9.14589 2.50162ZM10.8542 2.50162C10.9031 2.28616 11.0356 2.09894 11.2225 1.98111C11.4094 1.86329 11.6354 1.8245 11.8509 1.87329C15.5626 2.71495 18.3342 6.03329 18.3342 9.99995C18.3342 14.6025 14.6026 18.3333 10.0009 18.3333C6.03339 18.3333 2.71506 15.5625 1.87339 11.8508C1.83019 11.6374 1.87218 11.4157 1.99039 11.2329C2.1086 11.0501 2.29364 10.9208 2.50593 10.8727C2.71823 10.8246 2.94092 10.8614 3.12639 10.9754C3.31186 11.0893 3.44538 11.2713 3.49839 11.4825C3.76357 12.6439 4.33514 13.7131 5.15364 14.5788C5.97214 15.4444 7.00766 16.0749 8.15246 16.4047C9.29726 16.7345 10.5095 16.7515 11.6631 16.4539C12.8167 16.1563 13.8694 15.555 14.7119 14.7126C15.5543 13.8702 16.1555 12.8174 16.4531 11.6638C16.7507 10.5102 16.7338 9.29799 16.404 8.15319C16.0742 7.00839 15.4437 5.97287 14.578 5.15437C13.7124 4.33587 12.6432 3.7643 11.4817 3.49912C11.2662 3.45005 11.0791 3.31739 10.9614 3.13032C10.8437 2.94326 10.8052 2.71711 10.8542 2.50162ZM5.51172 3.93329C5.58625 4.01353 5.64423 4.10767 5.68235 4.21034C5.72047 4.313 5.73797 4.42217 5.73387 4.53161C5.72977 4.64104 5.70414 4.7486 5.65844 4.84812C5.61275 4.94764 5.54788 5.03718 5.46756 5.11162C5.34422 5.22551 5.22561 5.34384 5.11172 5.46662C4.96034 5.62414 4.75316 5.71591 4.53478 5.72217C4.3164 5.72843 4.10429 5.64869 3.94413 5.50011C3.78397 5.35153 3.68856 5.14599 3.67845 4.92776C3.66833 4.70952 3.74432 4.49604 3.89006 4.33329C4.03172 4.17995 4.1795 4.0319 4.33339 3.88912C4.41363 3.81459 4.50778 3.75661 4.61044 3.7185C4.71311 3.68038 4.82228 3.66287 4.93171 3.66697C5.04115 3.67107 5.1487 3.69671 5.24822 3.7424C5.34775 3.7881 5.43729 3.85296 5.51172 3.93329ZM10.0001 4.99995C10.2211 4.99995 10.433 5.08775 10.5893 5.24403C10.7456 5.40031 10.8334 5.61227 10.8334 5.83329V9.65495L13.0892 11.9108C13.241 12.068 13.325 12.2785 13.3231 12.497C13.3212 12.7155 13.2336 12.9245 13.0791 13.079C12.9246 13.2335 12.7156 13.3211 12.4971 13.323C12.2786 13.3249 12.0681 13.2409 11.9109 13.0891L9.41089 10.5891C9.2546 10.4329 9.16677 10.2209 9.16672 9.99995V5.83329C9.16672 5.61227 9.25452 5.40031 9.4108 5.24403C9.56708 5.08775 9.77904 4.99995 10.0001 4.99995ZM3.07756 6.98995C3.28872 7.05507 3.46537 7.20139 3.56867 7.39673C3.67196 7.59207 3.69345 7.82044 3.62839 8.03162C3.57896 8.19187 3.5356 8.35393 3.49839 8.51745C3.44538 8.72858 3.31186 8.91058 3.12639 9.02453C2.94092 9.13848 2.71823 9.17534 2.50593 9.12722C2.29364 9.0791 2.1086 8.94983 1.99039 8.76704C1.87218 8.58425 1.83019 8.36247 1.87339 8.14912C1.92006 7.94356 1.97422 7.74079 2.03589 7.54079C2.10101 7.32963 2.24732 7.15297 2.44267 7.04968C2.63801 6.94638 2.86638 6.9249 3.07756 6.98995Z" fill="black"/>
              </svg>
              <p className="text-sm font-medium">{overview.duration} {overview.duration_time_frame}</p>
            </div>
          </div>
        </div>
        <div className="space-y-2 md:mt-6">
          <div className="flex items-center md:w-[70%] justify-between gap-2">
              <Link to={"food"} className="bg-black text-white px-4 flex items-center justify-center py-2 w-full rounded-full h-11">View</Link>
              {(overview.user_id == user?.id) && (!isPublished ? <button onClick={handlePublish} className="bg-brand text-white px-4 py-2 w-full rounded-full h-11">Publish</button> :
              <button onClick={handleUnPublish} className="border-2 border-brand/80 text-brand/80 px-4 py-2 w-full rounded-full h-11">unPublish</button>)}
              {(isPublished && (overview.user_id == user?.id)) && <button onClick={handleCopy} className="size-11 min-w-11 rounded-full border-2 border-brand flex items-center justify-center">
                <svg className="size-4" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_1999_164)">
                    <path d="M4 16C2.9 16 2 15.1 2 14V4C2 2.9 2.9 2 4 2H14C15.1 2 16 2.9 16 4M10 8H20C21.1046 8 22 8.89543 22 10V20C22 21.1046 21.1046 22 20 22H10C8.89543 22 8 21.1046 8 20V10C8 8.89543 8.89543 8 10 8Z" stroke="#E03E1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect width="13" height="13.4502" transform="translate(12 12)" fill="white"/>
                    <path d="M17.9788 19.1001C18.1399 19.3154 18.3453 19.4935 18.5813 19.6224C18.8172 19.7513 19.0781 19.828 19.3463 19.8472C19.6145 19.8664 19.8837 19.8277 20.1356 19.7338C20.3875 19.6398 20.6163 19.4927 20.8063 19.3026L21.9313 18.1776C22.2729 17.824 22.4619 17.3503 22.4576 16.8587C22.4533 16.3671 22.2561 15.8968 21.9085 15.5492C21.5609 15.2015 21.0906 15.0043 20.599 15.0001C20.1073 14.9958 19.6337 15.1848 19.2801 15.5263L18.6351 16.1676M19.4788 18.3501C19.3178 18.1348 19.1123 17.9566 18.8764 17.8277C18.6404 17.6988 18.3795 17.6222 18.1113 17.603C17.8432 17.5838 17.574 17.6224 17.3221 17.7164C17.0702 17.8104 16.8414 17.9574 16.6513 18.1476L15.5263 19.2726C15.1848 19.6262 14.9958 20.0998 15.0001 20.5915C15.0043 21.0831 15.2015 21.5534 15.5492 21.901C15.8968 22.2486 16.3671 22.4458 16.8587 22.4501C17.3503 22.4544 17.824 22.2654 18.1776 21.9238L18.8188 21.2826" stroke="#E03E1A" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_1999_164">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>

              </button>}
          </div>
        </div>
        <div className="p-3 px-4 rounded-xl md:mt-8 flex items-center md:w-1/2 justify-between bg-gray-100 w-full border-1 border-brand">
          <div>
            <h2 className="font-semibold text-sm">Access Price</h2>
            <p><span className="font-medium">{overview.price_currency_code}</span> {overview.price?.toString() || ''}</p>
          </div>
          <button className={`h-8 text-sm px-8 rounded-full ${user?.id == overview.user_id ? "bg-brand/50 text-white/50" : "bg-brand text-white"}`} disabled={user?.id == overview.user_id}>Purchase</button>
        </div>
        <div className="space-y-3 pt-3 md:w-1/2">
          <h2 className="font-medium text-lg">Overview</h2>
          <p className="text-gray-500">
            {overview.overview}
          </p>
        </div>
      </div>

    </div>
  )
}
