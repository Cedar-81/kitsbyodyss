import { Link, useNavigate, useParams } from "react-router-dom";
import FoodCard from "../components/food_card";
import { useEffect, useState } from "react";
import { FoodAPI } from "../utils/api";
import { addToast } from "@heroui/toast";
import { useFoodStore } from "../utils/store/app_store";

export default function Food() {
    const { id } = useParams();
    const [foodList, setFoodList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { setIsUpdating, setCurrentFoodId } = useFoodStore();

    useEffect(() => {
        setLoading(true);
        //fetch food list for this overview
        const fetchFood = async () => {
            try {
                const res = await FoodAPI.getByOverview(id!);
                setFoodList(res.data || []);
                setLoading(false);
                console.log("food: ", res);
            } catch (err) {
                addToast({title: "Failed to fetch food!", color: "danger" });
                setLoading(false);
                console.error("Failed to fetch food", err);
            }
        };
        fetchFood();
    }, [id]);

    const handleCreate = () => {
        setIsUpdating(false);
        setCurrentFoodId(null);
        
        //navigate to create food page
        navigate(`/${id}/new-food`);
    }

    if(loading) {
        return (
        <div className='flex items-center justify-center w-full h-screen'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
        );
    }

    return (
    <div className="w-full p-5 md:px-12 space-y-4">
        <div className="w-full bg-gray-50 sticky top-0 py-3 z-10">
            <div onClick={handleCreate} className="size-9 text-white rounded-full mx-auto flex items-center justify-center bg-brand">
                <svg width="24" className="size-4" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {foodList.map((food) => (
                <FoodCard key={food.id} food={food} />
            ))}
        </div>
    </div>
  )
}
