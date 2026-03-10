import { Link, useParams } from "react-router-dom";

export default function Transportation() {
    const { id } = useParams();
  return (
    <div className="w-full p-5 space-y-4">
        <div className="w-full bg-gray-50 sticky top-0 py-3 z-10">
            <Link to={`/${id}/new-transportation`} className="w-full">
                <div className="size-9 text-white rounded-full mx-auto flex items-center justify-center bg-brand">
                    <svg width="24" className="size-4" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </Link>
        </div>

        <p>Transportation</p>
        
    </div>
  )
}
