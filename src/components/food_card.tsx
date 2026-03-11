import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFoodStore, useUserStore } from "../utils/store/app_store";
import { FoodAPI } from "../utils/api";
import { addToast } from "@heroui/toast";

export default function FoodCard({ food }: { food: any }) {
  const [activeTab, setActiveTab] = useState("highlights");
  const navigate = useNavigate();
  const { populateFoodForm, setIsUpdating, setCurrentFoodId, foodList, setFoodList } = useFoodStore();
  const { user } = useUserStore();
  const { user_id } = useParams();

  const handleEdit = () => {
    populateFoodForm(food);
    setCurrentFoodId(food.id);
    setIsUpdating(true);
    navigate(`/${user_id}/${food.overview_id}/new-food`);
  };

  const handleDelete = async (food_id: string) => {
    addToast({title: "Deleting food...", color: "primary"})
    const res = await FoodAPI.delete(food_id)

    if(res.error) {
      addToast({title: "Couldn't delete food!", color: "danger"})
    }else {
      const updated_food_list = foodList.filter((item => item.id !== food_id))
      setFoodList(updated_food_list)
      addToast({title: "Food deleted successfully.", color: "success"})
    }
  }

  const tabContent = {
    highlights: food.highlights || ["No highlights yet"],
    notes: food.notes || ["No notes yet"],
    review: food.review || "No review yet"
  };

  return (
    <div className="rounded-2xl w-full space-y-4 py-4 overflow-clip bg-brand-light border border-black/50">
        
        <div className="flex items-center justify-between px-4">
          <div className="flex gap-4 items-end">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C13.1935 12 14.3381 11.5259 15.182 10.682C16.0259 9.83807 16.5 8.69347 16.5 7.5C16.5 6.30653 16.0259 5.16193 15.182 4.31802C14.3381 3.47411 13.1935 3 12 3C10.8065 3 9.66193 3.47411 8.81802 4.31802C7.97411 5.16193 7.5 6.30653 7.5 7.5C7.5 8.69347 7.97411 9.83807 8.81802 10.682C9.66193 11.5259 10.8065 12 12 12ZM12 13.5C10.4087 13.5 8.88258 12.8679 7.75736 11.7426C6.63214 10.6174 6 9.0913 6 7.5C6 5.9087 6.63214 4.38258 7.75736 3.25736C8.88258 2.13214 10.4087 1.5 12 1.5C13.5913 1.5 15.1174 2.13214 16.2426 3.25736C17.3679 4.38258 18 5.9087 18 7.5C18 9.0913 17.3679 10.6174 16.2426 11.7426C15.1174 12.8679 13.5913 13.5 12 13.5Z" fill="#E03E1A" fill-opacity="0.85"/>
                  <path d="M12 12C12.1989 12 12.3897 12.079 12.5303 12.2197C12.671 12.3603 12.75 12.5511 12.75 12.75V18.75C12.75 18.9489 12.671 19.1397 12.5303 19.2803C12.3897 19.421 12.1989 19.5 12 19.5C11.8011 19.5 11.6103 19.421 11.4697 19.2803C11.329 19.1397 11.25 18.9489 11.25 18.75V12.75C11.25 12.5511 11.329 12.3603 11.4697 12.2197C11.6103 12.079 11.8011 12 12 12Z" fill="#E03E1A" fill-opacity="0.85"/>
                  <path d="M9 15.2129V16.7354C6.3225 17.1644 4.5 18.0914 4.5 18.7499C4.5 19.6334 7.779 20.9999 12 20.9999C16.221 20.9999 19.5 19.6334 19.5 18.7499C19.5 18.0899 17.6775 17.1644 15 16.7354V15.2129C18.495 15.7274 21 17.1179 21 18.7499C21 20.8199 16.971 22.4999 12 22.4999C7.029 22.4999 3 20.8199 3 18.7499C3 17.1164 5.505 15.7274 9 15.2129Z" fill="#E03E1A" fill-opacity="0.85"/>
              </svg>

              <div>
                  <h1 className="">{food.name}</h1>
                  <p className="text-xs">{food.location}</p>
              </div>
          </div>

        {user?.id == food.user_id && <div className="flex items-center justify-center gap-5">
           <svg onClick={handleEdit} className="size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.0001 20.9999H21.0001M15.0001 4.99989L19.0001 8.99989M21.1741 6.81189C21.7028 6.28332 21.9998 5.56636 21.9999 4.81875C22 4.07113 21.7031 3.3541 21.1746 2.82539C20.646 2.29668 19.929 1.99961 19.1814 1.99951C18.4338 1.99942 17.7168 2.29632 17.1881 2.82489L3.84206 16.1739C3.60988 16.4054 3.43817 16.6904 3.34206 17.0039L2.02106 21.3559C1.99521 21.4424 1.99326 21.5342 2.01541 21.6217C2.03756 21.7092 2.08298 21.7891 2.14685 21.8529C2.21073 21.9167 2.29068 21.962 2.37821 21.984C2.46575 22.006 2.55762 22.0039 2.64406 21.9779L6.99706 20.6579C7.31023 20.5626 7.59523 20.392 7.82706 20.1609L21.1741 6.81189Z" stroke="#E03E1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg onClick={() => handleDelete(food.id)} className="size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M3 6H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="red" stroke-opacity="0.81" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>}

        </div>

        <div className="h-40 w-full object-cover bg-gray-200">
          {food.image ? <img src={food.image} alt="Food Image" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>}
        </div>

        <div className="flex items-center gap-2 px-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 12.8002H12.8V12.2669C12.8 11.9469 12.5867 11.7336 12.2667 11.7336H11.7333V6.40023H12.8L13.8667 4.26689C12.8 4.37356 11.7333 4.37356 10.6667 4.26689C9.81333 3.62689 9.17333 2.98689 8.53333 2.13356V1.60023C8.53333 1.28023 8.32 1.06689 8 1.06689C7.68 1.06689 7.46666 1.28023 7.46666 1.60023V2.13356C6.82666 2.98689 6.18667 3.62689 5.33333 4.26689C4.26666 4.37356 3.2 4.37356 2.13333 4.26689L3.2 6.40023H4.26666V11.7336H3.73333C3.41333 11.7336 3.2 11.9469 3.2 12.2669V12.8002H2.66666C2.34666 12.8002 2.13333 13.0136 2.13333 13.3336V13.8669H13.8667V13.3336C13.8667 13.0136 13.6533 12.8002 13.3333 12.8002ZM7.46666 11.7336H5.33333V6.40023H7.46666V11.7336ZM10.6667 11.7336H8.53333V6.40023H10.6667V11.7336Z" fill="#E03E1A" fill-opacity="0.85"/>
            </svg>

            <h4 className="text-sm font-medium">{food.landmark}</h4>
        </div>

        <div className="flex items-center justify-between px-4">
            <div className="flex gap-2 items-center text-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 7V4C19 3.73478 18.8946 3.48043 18.7071 3.29289C18.5196 3.10536 18.2652 3 18 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5M3 5C3 5.53043 3.21071 6.03914 3.58579 6.41421C3.96086 6.78929 4.46957 7 5 7H20C20.2652 7 20.5196 7.10536 20.7071 7.29289C20.8946 7.48043 21 7.73478 21 8V12M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V16M21 12H18C17.4696 12 16.9609 12.2107 16.5858 12.5858C16.2107 12.9609 16 13.4696 16 14C16 14.5304 16.2107 15.0391 16.5858 15.4142C16.9609 15.7893 17.4696 16 18 16H21M21 12C21.2652 12 21.5196 12.1054 21.7071 12.2929C21.8946 12.4804 22 12.7348 22 13V15C22 15.2652 21.8946 15.5196 21.7071 15.7071C21.5196 15.8946 21.2652 16 21 16" stroke="#E03E1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h4>{food.price} {food.currency_code || "NGN"}</h4>
            </div>
            <button disabled={food.booking_link.trim() == ""} className="flex gap-2 disabled:opacity-25 items-center text-sm">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.64334 12.3574L12.3575 7.64322M5.87501 9.41072L4.69667 10.5891C4.38714 10.8986 4.1416 11.2661 3.97408 11.6705C3.80656 12.0749 3.72034 12.5084 3.72034 12.9461C3.72034 13.3839 3.80656 13.8173 3.97408 14.2218C4.1416 14.6262 4.38714 14.9937 4.69667 15.3032C5.00621 15.6128 5.37368 15.8583 5.77811 16.0258C6.18254 16.1933 6.61601 16.2796 7.05376 16.2796C7.49151 16.2796 7.92497 16.1933 8.3294 16.0258C8.73383 15.8583 9.1013 15.6128 9.41084 15.3032L10.5875 14.1249M9.41001 5.87488L10.5883 4.69655C10.8979 4.38701 11.2653 4.14148 11.6698 3.97396C12.0742 3.80644 12.5077 3.72021 12.9454 3.72021C13.3832 3.72021 13.8166 3.80644 14.2211 3.97396C14.6255 4.14148 14.993 4.38701 15.3025 4.69655C15.612 5.00609 15.8576 5.37356 16.0251 5.77799C16.1926 6.18242 16.2788 6.61588 16.2788 7.05363C16.2788 7.49139 16.1926 7.92485 16.0251 8.32928C15.8576 8.73371 15.612 9.10118 15.3025 9.41072L14.1242 10.5891" stroke="#E03E1A" stroke-opacity="0.85" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h4>Book</h4>
            </button>
            <div className="flex gap-2 items-center text-sm">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.92 3.60403C9.03004 3.41519 9.18768 3.25851 9.37718 3.14961C9.56669 3.04071 9.78143 2.9834 10 2.9834C10.2186 2.9834 10.4333 3.04071 10.6228 3.14961C10.8123 3.25851 10.97 3.41519 11.08 3.60403L12.595 6.20403C12.6822 6.3541 12.7997 6.48435 12.94 6.5865C13.0803 6.68866 13.2404 6.76047 13.41 6.79737L16.3517 7.43403C16.5652 7.48046 16.7628 7.58204 16.9248 7.72866C17.0868 7.87527 17.2076 8.06179 17.275 8.26963C17.3425 8.47746 17.3543 8.69934 17.3092 8.91316C17.2642 9.12697 17.1639 9.32524 17.0183 9.4882L15.0142 11.7324C14.8986 11.8617 14.8111 12.0137 14.7575 12.1787C14.7038 12.3437 14.6851 12.5181 14.7025 12.6907L15.005 15.6849C15.027 15.9024 14.9917 16.1218 14.9024 16.3214C14.8131 16.5209 14.6731 16.6936 14.4962 16.8221C14.3194 16.9506 14.1119 17.0305 13.8946 17.0538C13.6772 17.0771 13.4576 17.043 13.2575 16.9549L10.5042 15.7415C10.3453 15.6715 10.1736 15.6353 10 15.6353C9.82639 15.6353 9.65469 15.6715 9.49583 15.7415L6.7425 16.9549C6.54244 17.043 6.32277 17.0771 6.1054 17.0538C5.88804 17.0305 5.68059 16.9506 5.50375 16.8221C5.32692 16.6936 5.18687 16.5209 5.0976 16.3214C5.00833 16.1218 4.97295 15.9024 4.995 15.6849L5.2975 12.6907C5.31501 12.5181 5.29642 12.3438 5.2429 12.1788C5.18939 12.0138 5.10213 11.8618 4.98666 11.7324L2.98166 9.4882C2.8361 9.32524 2.7358 9.12697 2.69076 8.91316C2.64572 8.69934 2.65751 8.47746 2.72497 8.26963C2.79242 8.06179 2.91317 7.87527 3.07518 7.72866C3.2372 7.58204 3.43481 7.48046 3.64833 7.43403L6.59 6.79737C6.75967 6.76067 6.91984 6.68904 7.0603 6.58702C7.20077 6.48501 7.31844 6.35486 7.40583 6.20487L8.92 3.60403Z" stroke="#E03E1A" stroke-opacity="0.85" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h4>{food.rating || "N/A"} stars</h4>
            </div>
        </div>


        <div>
            <div className="flex w-full divide-x-1 text-center text-sm border-y-1 border-black/20 divide-black/20">
                <button 
                  onClick={() => setActiveTab("highlights")}
                  className={`w-full h-10 flex items-center justify-center cursor-pointer ${
                    activeTab === "highlights" ? "border-b-2 border-b-brand" : ""
                  }`}
                >
                  Highlights
                </button>
                <button 
                  onClick={() => setActiveTab("notes")}
                  className={`w-full h-10 flex items-center justify-center cursor-pointer ${
                    activeTab === "notes" ? "border-b-2 border-b-brand" : ""
                  }`}
                >
                  Notes
                </button>
                <button 
                  onClick={() => setActiveTab("review")}
                  className={`w-full h-10 flex items-center justify-center cursor-pointer ${
                    activeTab === "review" ? "border-b-2 border-b-brand" : ""
                  }`}
                >
                  Review
                </button>
            </div>

            <ul className="w-full text-xs list-disc! pl-10 pt-4">
                {activeTab === "review" ? (
                  <li className="text-sm py-1">{tabContent.review}</li>
                ) : (
                  (tabContent[activeTab as keyof typeof tabContent] as string[]).map((item: string, index: number) => (
                    <li key={index} className="text-sm py-1">{item}</li>
                  ))
                )}
            </ul>
        </div>
    </div>
  )
}
